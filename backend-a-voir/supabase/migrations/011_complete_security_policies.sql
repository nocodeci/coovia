-- Migration pour compléter les politiques de sécurité Supabase
-- Date: 2024-01-XX
-- Problème: Certaines tables ont RLS activé mais pas de politiques, ce qui les rend "unrestricted"

-- ========================================
-- POLITIQUES POUR LA TABLE USERS
-- ========================================

-- Supprimer les anciennes politiques qui utilisent current_setting (non sécurisé)
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;

-- Politique de lecture pour l'utilisateur lui-même
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (
        auth.uid()::text = supabase_user_id::text
    );

-- Politique de modification pour l'utilisateur lui-même
CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (
        auth.uid()::text = supabase_user_id::text
    );

-- Politique de création pour les nouveaux utilisateurs
CREATE POLICY "Users can create own profile" ON public.users
    FOR INSERT WITH CHECK (
        auth.uid()::text = supabase_user_id::text
    );

-- Politique pour les administrateurs (peuvent voir tous les utilisateurs)
CREATE POLICY "Admins can view all users" ON public.users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users u 
            WHERE u.supabase_user_id = auth.uid() 
            AND u.role = 'admin'
        )
    );

-- ========================================
-- POLITIQUES POUR LA TABLE STORES
-- ========================================

-- Supprimer les anciennes politiques
DROP POLICY IF EXISTS "Users can view own stores" ON public.stores;
DROP POLICY IF EXISTS "Users can manage own stores" ON public.stores;

-- Politique de lecture pour le propriétaire de la boutique
CREATE POLICY "Store owners can view own stores" ON public.stores
    FOR SELECT USING (
        owner_id IN (
            SELECT id FROM public.users 
            WHERE supabase_user_id = auth.uid()
        )
    );

-- Politique de gestion complète pour le propriétaire
CREATE POLICY "Store owners can manage own stores" ON public.stores
    FOR ALL USING (
        owner_id IN (
            SELECT id FROM public.users 
            WHERE supabase_user_id = auth.uid()
        )
    );

-- Politique pour les administrateurs
CREATE POLICY "Admins can view all stores" ON public.stores
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users u 
            WHERE u.supabase_user_id = auth.uid() 
            AND u.role = 'admin'
        )
    );

-- ========================================
-- POLITIQUES POUR LA TABLE PRODUCTS
-- ========================================

-- Supprimer les anciennes politiques
DROP POLICY IF EXISTS "Users can view products of own stores" ON public.products;
DROP POLICY IF EXISTS "Users can manage products of own stores" ON public.products;

-- Politique de lecture publique pour les produits actifs
CREATE POLICY "Public can view active products" ON public.products
    FOR SELECT USING (status = 'active');

-- Politique de lecture pour le propriétaire de la boutique
CREATE POLICY "Store owners can view all their products" ON public.products
    FOR SELECT USING (
        store_id IN (
            SELECT s.id FROM public.stores s
            JOIN public.users u ON s.owner_id = u.id
            WHERE u.supabase_user_id = auth.uid()
        )
    );

-- Politique de gestion complète pour le propriétaire
CREATE POLICY "Store owners can manage their products" ON public.products
    FOR ALL USING (
        store_id IN (
            SELECT s.id FROM public.stores s
            JOIN public.users u ON s.owner_id = u.id
            WHERE u.supabase_user_id = auth.uid()
        )
    );

-- ========================================
-- POLITIQUES POUR LA TABLE CUSTOMERS
-- ========================================

-- Politique de lecture pour le propriétaire de la boutique
CREATE POLICY "Store owners can view their customers" ON public.customers
    FOR SELECT USING (
        store_id IN (
            SELECT s.id FROM public.stores s
            JOIN public.users u ON s.owner_id = u.id
            WHERE u.supabase_user_id = auth.uid()
        )
    );

-- Politique de gestion pour le propriétaire
CREATE POLICY "Store owners can manage their customers" ON public.customers
    FOR ALL USING (
        store_id IN (
            SELECT s.id FROM public.stores s
            JOIN public.users u ON s.owner_id = u.id
            WHERE u.supabase_user_id = auth.uid()
        )
    );

-- ========================================
-- POLITIQUES POUR LA TABLE ORDERS
-- ========================================

-- Politique de lecture pour le propriétaire de la boutique
CREATE POLICY "Store owners can view their orders" ON public.orders
    FOR SELECT USING (
        store_id IN (
            SELECT s.id FROM public.stores s
            JOIN public.users u ON s.owner_id = u.id
            WHERE u.supabase_user_id = auth.uid()
        )
    );

-- Politique de gestion pour le propriétaire
CREATE POLICY "Store owners can manage their orders" ON public.orders
    FOR ALL USING (
        store_id IN (
            SELECT s.id FROM public.stores s
            JOIN public.users u ON s.owner_id = u.id
            WHERE u.supabase_user_id = auth.uid()
        )
    );

-- ========================================
-- POLITIQUES POUR LA TABLE ORDER_ITEMS
-- ========================================

-- Activer RLS sur order_items si pas déjà fait
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Politique de lecture pour le propriétaire de la boutique
CREATE POLICY "Store owners can view their order items" ON public.order_items
    FOR SELECT USING (
        order_id IN (
            SELECT o.id FROM public.orders o
            JOIN public.stores s ON o.store_id = s.id
            JOIN public.users u ON s.owner_id = u.id
            WHERE u.supabase_user_id = auth.uid()
        )
    );

-- Politique de gestion pour le propriétaire
CREATE POLICY "Store owners can manage their order items" ON public.order_items
    FOR ALL USING (
        order_id IN (
            SELECT o.id FROM public.orders o
            JOIN public.stores s ON o.store_id = s.id
            JOIN public.users u ON s.owner_id = u.id
            WHERE u.supabase_user_id = auth.uid()
        )
    );

-- ========================================
-- POLITIQUES POUR LA TABLE PAYMENT_GATEWAYS
-- ========================================

-- Politique de lecture pour le propriétaire de la boutique
CREATE POLICY "Store owners can view their payment gateways" ON public.payment_gateways
    FOR SELECT USING (
        store_id IN (
            SELECT s.id FROM public.stores s
            JOIN public.users u ON s.owner_id = u.id
            WHERE u.supabase_user_id = auth.uid()
        )
    );

-- Politique de gestion pour le propriétaire
CREATE POLICY "Store owners can manage their payment gateways" ON public.payment_gateways
    FOR ALL USING (
        store_id IN (
            SELECT s.id FROM public.stores s
            JOIN public.users u ON s.owner_id = u.id
            WHERE u.supabase_user_id = auth.uid()
        )
    );

-- ========================================
-- POLITIQUES POUR LA TABLE PAYMENT_METHODS
-- ========================================

-- Activer RLS sur payment_methods si pas déjà fait
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;

-- Politique de lecture pour le propriétaire de la boutique
CREATE POLICY "Store owners can view their payment methods" ON public.payment_methods
    FOR SELECT USING (
        store_id IN (
            SELECT s.id FROM public.stores s
            JOIN public.users u ON s.owner_id = u.id
            WHERE u.supabase_user_id = auth.uid()
        )
    );

-- Politique de gestion pour le propriétaire
CREATE POLICY "Store owners can manage their payment methods" ON public.payment_methods
    FOR ALL USING (
        store_id IN (
            SELECT s.id FROM public.stores s
            JOIN public.users u ON s.owner_id = u.id
            WHERE u.supabase_user_id = auth.uid()
        )
    );

-- ========================================
-- POLITIQUES POUR LA TABLE PAYMENT_TRANSACTIONS
-- ========================================

-- Politique de lecture pour le propriétaire de la boutique
CREATE POLICY "Store owners can view their payment transactions" ON public.payment_transactions
    FOR SELECT USING (
        store_id IN (
            SELECT s.id FROM public.stores s
            JOIN public.users u ON s.owner_id = u.id
            WHERE u.supabase_user_id = auth.uid()
        )
    );

-- Politique de gestion pour le propriétaire
CREATE POLICY "Store owners can manage their payment transactions" ON public.payment_transactions
    FOR ALL USING (
        store_id IN (
            SELECT s.id FROM public.stores s
            JOIN public.users u ON s.owner_id = u.id
            WHERE u.supabase_user_id = auth.uid()
        )
    );

-- ========================================
-- POLITIQUES POUR LA TABLE MFA_TOKENS
-- ========================================

-- Politique de lecture pour l'utilisateur lui-même
CREATE POLICY "Users can view own MFA tokens" ON public.mfa_tokens
    FOR SELECT USING (
        user_id IN (
            SELECT id FROM public.users 
            WHERE supabase_user_id = auth.uid()
        )
    );

-- Politique de gestion pour l'utilisateur lui-même
CREATE POLICY "Users can manage own MFA tokens" ON public.mfa_tokens
    FOR ALL USING (
        user_id IN (
            SELECT id FROM public.users 
            WHERE supabase_user_id = auth.uid()
        )
    );

-- ========================================
-- POLITIQUES POUR LA TABLE LOGIN_ATTEMPTS
-- ========================================

-- Politique de lecture pour l'utilisateur lui-même
CREATE POLICY "Users can view own login attempts" ON public.login_attempts
    FOR SELECT USING (
        user_id IN (
            SELECT id FROM public.users 
            WHERE supabase_user_id = auth.uid()
        )
    );

-- Politique de lecture pour les administrateurs
CREATE POLICY "Admins can view all login attempts" ON public.login_attempts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users u 
            WHERE u.supabase_user_id = auth.uid() 
            AND u.role = 'admin'
        )
    );

-- Politique de création pour les tentatives de connexion
CREATE POLICY "System can create login attempts" ON public.login_attempts
    FOR INSERT WITH CHECK (true);

-- ========================================
-- POLITIQUES POUR LA TABLE PERSONAL_ACCESS_TOKENS
-- ========================================

-- Activer RLS si la table existe
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'personal_access_tokens') THEN
        ALTER TABLE public.personal_access_tokens ENABLE ROW LEVEL SECURITY;
        
        -- Politique de lecture pour l'utilisateur lui-même
        CREATE POLICY "Users can view own access tokens" ON public.personal_access_tokens
            FOR SELECT USING (
                tokenable_id IN (
                    SELECT id FROM public.users 
                    WHERE supabase_user_id = auth.uid()
                )
            );
        
        -- Politique de gestion pour l'utilisateur lui-même
        CREATE POLICY "Users can manage own access tokens" ON public.personal_access_tokens
            FOR ALL USING (
                tokenable_id IN (
                    SELECT id FROM public.users 
                    WHERE supabase_user_id = auth.uid()
                )
            );
    END IF;
END $$;

-- ========================================
-- POLITIQUES POUR LA TABLE SESSIONS
-- ========================================

-- Activer RLS si la table existe
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'sessions') THEN
        ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
        
        -- Politique de lecture pour l'utilisateur lui-même
        CREATE POLICY "Users can view own sessions" ON public.sessions
            FOR SELECT USING (
                user_id IN (
                    SELECT id FROM public.users 
                    WHERE supabase_user_id = auth.uid()
                )
            );
        
        -- Politique de gestion pour l'utilisateur lui-même
        CREATE POLICY "Users can manage own sessions" ON public.sessions
            FOR ALL USING (
                user_id IN (
                    SELECT id FROM public.users 
                    WHERE supabase_user_id = auth.uid()
                )
            );
    END IF;
END $$;

-- ========================================
-- POLITIQUES POUR LA TABLE CACHE
-- ========================================

-- Activer RLS si la table existe
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'cache') THEN
        ALTER TABLE public.cache ENABLE ROW LEVEL SECURITY;
        
        -- Politique de lecture publique pour le cache
        CREATE POLICY "Public can read cache" ON public.cache
            FOR SELECT USING (true);
        
        -- Politique de gestion pour les administrateurs
        CREATE POLICY "Admins can manage cache" ON public.cache
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
-- POLITIQUES POUR LA TABLE JOBS
-- ========================================

-- Activer RLS si la table existe
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'jobs') THEN
        ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
        
        -- Politique de lecture pour les administrateurs
        CREATE POLICY "Admins can view jobs" ON public.jobs
            FOR SELECT USING (
                EXISTS (
                    SELECT 1 FROM public.users u 
                    WHERE u.supabase_user_id = auth.uid() 
                    AND u.role = 'admin'
                )
            );
        
        -- Politique de gestion pour les administrateurs
        CREATE POLICY "Admins can manage jobs" ON public.jobs
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
-- VÉRIFICATION ET MESSAGE DE CONFIRMATION
-- ========================================

-- Vérifier que toutes les tables ont RLS activé
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename NOT LIKE 'pg_%'
ORDER BY tablename;

-- Vérifier les politiques existantes
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Message de confirmation
SELECT 'Politiques de sécurité complètes appliquées avec succès !' as message;
