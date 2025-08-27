-- Migration pour configurer les politiques de sécurité Supabase pour Lunar
-- Date: 2024-01-XX

-- Activer RLS (Row Level Security) sur toutes les tables Lunar
ALTER TABLE lunar_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE lunar_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE lunar_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE lunar_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE lunar_product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE lunar_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE lunar_collection_product ENABLE ROW LEVEL SECURITY;

-- ========================================
-- POLITIQUES POUR LUNAR_CHANNELS
-- ========================================

-- Politique de lecture publique pour les channels
CREATE POLICY "Channels are viewable by everyone" ON lunar_channels
    FOR SELECT USING (true);

-- Politique de création/modification pour les administrateurs et propriétaires de boutique
CREATE POLICY "Channels are manageable by store owners and admins" ON lunar_channels
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM stores s 
            WHERE s.user_id = auth.uid() 
            OR auth.uid() IN (
                SELECT user_id FROM user_roles 
                WHERE role = 'admin'
            )
        )
    );

-- ========================================
-- POLITIQUES POUR LUNAR_CUSTOMERS
-- ========================================

-- Politique de lecture pour le client lui-même et les propriétaires de boutique
CREATE POLICY "Customers can view their own data" ON lunar_customers
    FOR SELECT USING (
        user_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM stores s 
            WHERE s.user_id = auth.uid()
        )
    );

-- Politique de création/modification pour le client lui-même
CREATE POLICY "Customers can manage their own data" ON lunar_customers
    FOR ALL USING (user_id = auth.uid());

-- Politique de suppression pour les propriétaires de boutique
CREATE POLICY "Store owners can delete customer data" ON lunar_customers
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM stores s 
            WHERE s.user_id = auth.uid()
        )
    );

-- ========================================
-- POLITIQUES POUR LUNAR_PRODUCTS
-- ========================================

-- Politique de lecture publique pour les produits actifs
CREATE POLICY "Active products are viewable by everyone" ON lunar_products
    FOR SELECT USING (is_active = true);

-- Politique de lecture pour tous les produits (y compris inactifs) pour les propriétaires
CREATE POLICY "Store owners can view all their products" ON lunar_products
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM stores s 
            WHERE s.id = lunar_products.store_id 
            AND s.user_id = auth.uid()
        )
    );

-- Politique de création/modification pour les propriétaires de boutique
CREATE POLICY "Store owners can manage their products" ON lunar_products
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM stores s 
            WHERE s.id = lunar_products.store_id 
            AND s.user_id = auth.uid()
        )
    );

-- ========================================
-- POLITIQUES POUR LUNAR_ORDERS
-- ========================================

-- Politique de lecture pour le client et le propriétaire de la boutique
CREATE POLICY "Orders are viewable by customer and store owner" ON lunar_orders
    FOR SELECT USING (
        user_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM stores s 
            WHERE s.id = lunar_orders.store_id 
            AND s.user_id = auth.uid()
        )
    );

-- Politique de création pour les clients authentifiés
CREATE POLICY "Authenticated users can create orders" ON lunar_orders
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Politique de modification pour les propriétaires de boutique (statut, etc.)
CREATE POLICY "Store owners can update order status" ON lunar_orders
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM stores s 
            WHERE s.id = lunar_orders.store_id 
            AND s.user_id = auth.uid()
        )
    );

-- Politique de suppression pour les propriétaires de boutique
CREATE POLICY "Store owners can delete orders" ON lunar_orders
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM stores s 
            WHERE s.id = lunar_orders.store_id 
            AND s.user_id = auth.uid()
        )
    );

-- ========================================
-- POLITIQUES POUR LUNAR_PRODUCT_VARIANTS
-- ========================================

-- Politique de lecture publique pour les variantes de produits actifs
CREATE POLICY "Active product variants are viewable by everyone" ON lunar_product_variants
    FOR SELECT USING (is_active = true);

-- Politique de lecture pour toutes les variantes pour les propriétaires
CREATE POLICY "Store owners can view all variants" ON lunar_product_variants
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM lunar_products p 
            JOIN stores s ON s.id = p.store_id 
            WHERE p.id = lunar_product_variants.product_id 
            AND s.user_id = auth.uid()
        )
    );

-- Politique de gestion pour les propriétaires de boutique
CREATE POLICY "Store owners can manage variants" ON lunar_product_variants
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM lunar_products p 
            JOIN stores s ON s.id = p.store_id 
            WHERE p.id = lunar_product_variants.product_id 
            AND s.user_id = auth.uid()
        )
    );

-- ========================================
-- POLITIQUES POUR LUNAR_COLLECTIONS
-- ========================================

-- Politique de lecture publique pour les collections actives
CREATE POLICY "Active collections are viewable by everyone" ON lunar_collections
    FOR SELECT USING (is_active = true);

-- Politique de gestion pour les administrateurs
CREATE POLICY "Collections are manageable by admins" ON lunar_collections
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() 
            AND role = 'admin'
        )
    );

-- ========================================
-- POLITIQUES POUR LUNAR_COLLECTION_PRODUCT
-- ========================================

-- Politique de lecture publique
CREATE POLICY "Collection products are viewable by everyone" ON lunar_collection_product
    FOR SELECT USING (true);

-- Politique de gestion pour les administrateurs
CREATE POLICY "Collection products are manageable by admins" ON lunar_collection_product
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() 
            AND role = 'admin'
        )
    );

-- ========================================
-- FONCTIONS UTILITAIRES
-- ========================================

-- Fonction pour vérifier si l'utilisateur est propriétaire d'une boutique
CREATE OR REPLACE FUNCTION is_store_owner(store_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM stores s 
        WHERE s.id = store_uuid 
        AND s.user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour vérifier si l'utilisateur est administrateur
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM user_roles 
        WHERE user_id = auth.uid() 
        AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- INDEX POUR LES PERFORMANCES
-- ========================================

-- Index pour améliorer les performances des requêtes
CREATE INDEX IF NOT EXISTS idx_lunar_products_store_id ON lunar_products(store_id);
CREATE INDEX IF NOT EXISTS idx_lunar_products_is_active ON lunar_products(is_active);
CREATE INDEX IF NOT EXISTS idx_lunar_products_slug ON lunar_products(slug);
CREATE INDEX IF NOT EXISTS idx_lunar_orders_user_id ON lunar_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_lunar_orders_store_id ON lunar_orders(store_id);
CREATE INDEX IF NOT EXISTS idx_lunar_orders_status ON lunar_orders(status);
CREATE INDEX IF NOT EXISTS idx_lunar_customers_user_id ON lunar_customers(user_id);
CREATE INDEX IF NOT EXISTS idx_lunar_customers_email ON lunar_customers(email);
CREATE INDEX IF NOT EXISTS idx_lunar_collections_slug ON lunar_collections(slug);
CREATE INDEX IF NOT EXISTS idx_lunar_product_variants_product_id ON lunar_product_variants(product_id);
