-- Migration complète pour sécuriser TOUTES les tables Lunar
-- Date: 2024-01-XX
-- Problème: Configuration Lunar incomplète - tables manquantes et politiques insuffisantes

-- ========================================
-- DÉTECTION ET ACTIVATION RLS SUR TOUTES LES TABLES LUNAR
-- ========================================

-- Activer RLS sur toutes les tables Lunar existantes
DO $$
DECLARE
    lunar_table RECORD;
BEGIN
    FOR lunar_table IN 
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename LIKE 'lunar_%'
        AND rowsecurity = false
    LOOP
        EXECUTE 'ALTER TABLE public.' || quote_ident(lunar_table.tablename) || ' ENABLE ROW LEVEL SECURITY;';
        RAISE NOTICE 'RLS activé sur: %', lunar_table.tablename;
    END LOOP;
END $$;

-- ========================================
-- POLITIQUES POUR TABLES LUNAR MANQUANTES
-- ========================================

-- ========================================
-- LUNAR_ATTRIBUTES
-- ========================================
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'lunar_attributes') THEN
        -- Politique de lecture publique pour les attributs actifs
        CREATE POLICY "Active attributes are viewable by everyone" ON lunar_attributes
            FOR SELECT USING (is_active = true);
        
        -- Politique de gestion pour les administrateurs
        CREATE POLICY "Attributes are manageable by admins" ON lunar_attributes
            FOR ALL USING (
                EXISTS (
                    SELECT 1 FROM public.users u 
                    WHERE u.supabase_user_id = auth.uid() 
                    AND u.role = 'admin'
                )
            );
    END IF;
END $$;

-- ========================================
-- LUNAR_ATTRIBUTE_GROUPS
-- ========================================
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'lunar_attribute_groups') THEN
        -- Politique de lecture publique pour les groupes d'attributs actifs
        CREATE POLICY "Active attribute groups are viewable by everyone" ON lunar_attribute_groups
            FOR SELECT USING (is_active = true);
        
        -- Politique de gestion pour les administrateurs
        CREATE POLICY "Attribute groups are manageable by admins" ON lunar_attribute_groups
            FOR ALL USING (
                EXISTS (
                    SELECT 1 FROM public.users u 
                    WHERE u.supabase_user_id = auth.uid() 
                    AND u.role = 'admin'
                )
            );
    END IF;
END $$;

-- ========================================
-- LUNAR_BRANDS
-- ========================================
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'lunar_brands') THEN
        -- Politique de lecture publique pour les marques actives
        CREATE POLICY "Active brands are viewable by everyone" ON lunar_brands
            FOR SELECT USING (is_active = true);
        
        -- Politique de gestion pour les propriétaires de boutique
        CREATE POLICY "Store owners can manage their brands" ON lunar_brands
            FOR ALL USING (
                EXISTS (
                    SELECT 1 FROM lunar_products p
                    JOIN public.stores s ON s.id = p.store_id
                    JOIN public.users u ON s.owner_id = u.id
                    WHERE p.brand_id = lunar_brands.id
                    AND u.supabase_user_id = auth.uid()
                )
            );
    END IF;
END $$;

-- ========================================
-- LUNAR_CATEGORIES
-- ========================================
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'lunar_categories') THEN
        -- Politique de lecture publique pour les catégories actives
        CREATE POLICY "Active categories are viewable by everyone" ON lunar_categories
            FOR SELECT USING (is_active = true);
        
        -- Politique de gestion pour les administrateurs
        CREATE POLICY "Categories are manageable by admins" ON lunar_categories
            FOR ALL USING (
                EXISTS (
                    SELECT 1 FROM public.users u 
                    WHERE u.supabase_user_id = auth.uid() 
                    AND u.role = 'admin'
                )
            );
    END IF;
END $$;

-- ========================================
-- LUNAR_CARTS ET LUNAR_CART_LINES
-- ========================================
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'lunar_carts') THEN
        -- Politique de lecture pour le propriétaire du panier
        CREATE POLICY "Users can view own carts" ON lunar_carts
            FOR SELECT USING (user_id = auth.uid());
        
        -- Politique de gestion pour le propriétaire du panier
        CREATE POLICY "Users can manage own carts" ON lunar_carts
            FOR ALL USING (user_id = auth.uid());
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'lunar_cart_lines') THEN
        -- Politique de lecture pour le propriétaire du panier
        CREATE POLICY "Users can view own cart lines" ON lunar_cart_lines
            FOR SELECT USING (
                cart_id IN (
                    SELECT id FROM lunar_carts 
                    WHERE user_id = auth.uid()
                )
            );
        
        -- Politique de gestion pour le propriétaire du panier
        CREATE POLICY "Users can manage own cart lines" ON lunar_cart_lines
            FOR ALL USING (
                cart_id IN (
                    SELECT id FROM lunar_carts 
                    WHERE user_id = auth.uid()
                )
            );
    END IF;
END $$;

-- ========================================
-- LUNAR_DISCOUNTS
-- ========================================
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'lunar_discounts') THEN
        -- Politique de lecture publique pour les réductions actives
        CREATE POLICY "Active discounts are viewable by everyone" ON lunar_discounts
            FOR SELECT USING (is_active = true);
        
        -- Politique de gestion pour les propriétaires de boutique
        CREATE POLICY "Store owners can manage their discounts" ON lunar_discounts
            FOR ALL USING (
                EXISTS (
                    SELECT 1 FROM lunar_products p
                    JOIN public.stores s ON s.id = p.store_id
                    JOIN public.users u ON s.owner_id = u.id
                    WHERE p.id IN (
                        SELECT product_id FROM lunar_discount_product 
                        WHERE discount_id = lunar_discounts.id
                    )
                    AND u.supabase_user_id = auth.uid()
                )
            );
    END IF;
END $$;

-- ========================================
-- LUNAR_INVENTORY
-- ========================================
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'lunar_inventory') THEN
        -- Politique de lecture pour les propriétaires de boutique
        CREATE POLICY "Store owners can view their inventory" ON lunar_inventory
            FOR SELECT USING (
                EXISTS (
                    SELECT 1 FROM lunar_products p
                    JOIN public.stores s ON s.id = p.store_id
                    JOIN public.users u ON s.owner_id = u.id
                    WHERE p.id = lunar_inventory.product_id
                    AND u.supabase_user_id = auth.uid()
                )
            );
        
        -- Politique de gestion pour les propriétaires de boutique
        CREATE POLICY "Store owners can manage their inventory" ON lunar_inventory
            FOR ALL USING (
                EXISTS (
                    SELECT 1 FROM lunar_products p
                    JOIN public.stores s ON s.id = p.store_id
                    JOIN public.users u ON s.owner_id = u.id
                    WHERE p.id = lunar_inventory.product_id
                    AND u.supabase_user_id = auth.uid()
                )
            );
    END IF;
END $$;

-- ========================================
-- LUNAR_MENUS
-- ========================================
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'lunar_menus') THEN
        -- Politique de lecture publique pour les menus actifs
        CREATE POLICY "Active menus are viewable by everyone" ON lunar_menus
            FOR SELECT USING (is_active = true);
        
        -- Politique de gestion pour les administrateurs
        CREATE POLICY "Menus are manageable by admins" ON lunar_menus
            FOR ALL USING (
                EXISTS (
                    SELECT 1 FROM public.users u 
                    WHERE u.supabase_user_id = auth.uid() 
                    AND u.role = 'admin'
                )
            );
    END IF;
END $$;

-- ========================================
-- LUNAR_PAGES
-- ========================================
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'lunar_pages') THEN
        -- Politique de lecture publique pour les pages actives
        CREATE POLICY "Active pages are viewable by everyone" ON lunar_pages
            FOR SELECT USING (is_active = true);
        
        -- Politique de gestion pour les administrateurs
        CREATE POLICY "Pages are manageable by admins" ON lunar_pages
            FOR ALL USING (
                EXISTS (
                    SELECT 1 FROM public.users u 
                    WHERE u.supabase_user_id = auth.uid() 
                    AND u.role = 'admin'
                )
            );
    END IF;
END $$;

-- ========================================
-- LUNAR_TAX_CLASSES ET LUNAR_TAX_RATES
-- ========================================
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'lunar_tax_classes') THEN
        -- Politique de lecture publique
        CREATE POLICY "Tax classes are viewable by everyone" ON lunar_tax_classes
            FOR SELECT USING (true);
        
        -- Politique de gestion pour les administrateurs
        CREATE POLICY "Tax classes are manageable by admins" ON lunar_tax_classes
            FOR ALL USING (
                EXISTS (
                    SELECT 1 FROM public.users u 
                    WHERE u.supabase_user_id = auth.uid() 
                    AND u.role = 'admin'
                )
            );
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'lunar_tax_rates') THEN
        -- Politique de lecture publique
        CREATE POLICY "Tax rates are viewable by everyone" ON lunar_tax_rates
            FOR SELECT USING (true);
        
        -- Politique de gestion pour les administrateurs
        CREATE POLICY "Tax rates are manageable by admins" ON lunar_tax_rates
            FOR ALL USING (
                EXISTS (
                    SELECT 1 FROM public.users u 
                    WHERE u.supabase_user_id = auth.uid() 
                    AND u.role = 'admin'
                )
            );
    END IF;
END $$;

-- ========================================
-- LUNAR_URLS
-- ========================================
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'lunar_urls') THEN
        -- Politique de lecture publique
        CREATE POLICY "URLs are viewable by everyone" ON lunar_urls
            FOR SELECT USING (true);
        
        -- Politique de gestion pour les propriétaires de boutique
        CREATE POLICY "Store owners can manage their URLs" ON lunar_urls
            FOR ALL USING (
                EXISTS (
                    SELECT 1 FROM lunar_products p
                    JOIN public.stores s ON s.id = p.store_id
                    JOIN public.users u ON s.owner_id = u.id
                    WHERE p.id = lunar_urls.element_id
                    AND u.supabase_user_id = auth.uid()
                )
            );
    END IF;
END $$;

-- ========================================
-- LUNAR_ASSETS
-- ========================================
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'lunar_assets') THEN
        -- Politique de lecture publique pour les assets
        CREATE POLICY "Assets are viewable by everyone" ON lunar_assets
            FOR SELECT USING (true);
        
        -- Politique de gestion pour les propriétaires de boutique
        CREATE POLICY "Store owners can manage their assets" ON lunar_assets
            FOR ALL USING (
                EXISTS (
                    SELECT 1 FROM lunar_products p
                    JOIN public.stores s ON s.id = p.store_id
                    JOIN public.users u ON s.owner_id = u.id
                    WHERE p.id = lunar_assets.assetable_id
                    AND u.supabase_user_id = auth.uid()
                )
            );
    END IF;
END $$;

-- ========================================
-- LUNAR_TAGS
-- ========================================
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'lunar_tags') THEN
        -- Politique de lecture publique
        CREATE POLICY "Tags are viewable by everyone" ON lunar_tags
            FOR SELECT USING (true);
        
        -- Politique de gestion pour les administrateurs
        CREATE POLICY "Tags are manageable by admins" ON lunar_tags
            FOR ALL USING (
                EXISTS (
                    SELECT 1 FROM public.users u 
                    WHERE u.supabase_user_id = auth.uid() 
                    AND u.role = 'admin'
                )
            );
    END IF;
END $$;

-- ========================================
-- CORRECTION DES POLITIQUES EXISTANTES
-- ========================================

-- Supprimer les anciennes politiques problématiques
DROP POLICY IF EXISTS "Channels are manageable by store owners and admins" ON lunar_channels;
DROP POLICY IF EXISTS "Collections are manageable by admins" ON lunar_collections;
DROP POLICY IF EXISTS "Collection products are manageable by admins" ON lunar_collection_product;

-- Recréer les politiques avec la logique corrigée
CREATE POLICY "Channels are manageable by store owners and admins" ON lunar_channels
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.stores s 
            JOIN public.users u ON s.owner_id = u.id
            WHERE u.supabase_user_id = auth.uid()
        )
        OR
        EXISTS (
            SELECT 1 FROM public.users u 
            WHERE u.supabase_user_id = auth.uid() 
            AND u.role = 'admin'
        )
    );

CREATE POLICY "Collections are manageable by admins" ON lunar_collections
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users u 
            WHERE u.supabase_user_id = auth.uid() 
            AND u.role = 'admin'
        )
    );

CREATE POLICY "Collection products are manageable by admins" ON lunar_collection_product
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users u 
            WHERE u.supabase_user_id = auth.uid() 
            AND u.role = 'admin'
        )
    );

-- ========================================
-- INDEX POUR LES PERFORMANCES
-- ========================================

-- Index pour les nouvelles tables sécurisées
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'lunar_carts') THEN
        CREATE INDEX IF NOT EXISTS idx_lunar_carts_user_id ON lunar_carts(user_id);
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'lunar_cart_lines') THEN
        CREATE INDEX IF NOT EXISTS idx_lunar_cart_lines_cart_id ON lunar_cart_lines(cart_id);
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'lunar_inventory') THEN
        CREATE INDEX IF NOT EXISTS idx_lunar_inventory_product_id ON lunar_inventory(product_id);
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'lunar_urls') THEN
        CREATE INDEX IF NOT EXISTS idx_lunar_urls_element_id ON lunar_urls(element_id);
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'lunar_assets') THEN
        CREATE INDEX IF NOT EXISTS idx_lunar_assets_assetable_id ON lunar_assets(assetable_id);
    END IF;
END $$;

-- ========================================
-- VÉRIFICATION ET MESSAGE DE CONFIRMATION
-- ========================================

-- Vérifier que toutes les tables Lunar ont RLS activé
SELECT 
    'LUNAR RLS STATUS' as check_type,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename LIKE 'lunar_%'
ORDER BY tablename;

-- Vérifier les politiques Lunar
SELECT 
    'LUNAR POLICIES' as check_type,
    tablename,
    COUNT(policyname) as policy_count
FROM pg_policies 
WHERE schemaname = 'public'
AND tablename LIKE 'lunar_%'
GROUP BY tablename
ORDER BY tablename;

-- Message de confirmation
SELECT 'Configuration Lunar complète et sécurisée appliquée avec succès !' as message;
