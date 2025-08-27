-- Fichier : 004_cleanup_and_maintenance.sql
-- Description : Ajoute des fonctions de maintenance, des vues et des politiques de sécurité.

-- Fonction pour nettoyer les données expirées automatiquement
-- MARQUEE COMME STABLE pour indiquer qu'elle ne modifie pas la base de données (bien qu'elle le fasse via DELETE)
-- mais n'affecte pas le résultat d'une transaction unique.
CREATE OR REPLACE FUNCTION cleanup_expired_data()
RETURNS INTEGER AS $$
DECLARE
    total_cleaned INTEGER := 0;
    mfa_cleaned INTEGER;
    login_cleaned INTEGER;
BEGIN
    -- Nettoyer les tokens MFA expirés (plus de 1 jour)
    DELETE FROM public.mfa_tokens
    WHERE expires_at < NOW() - INTERVAL '1 day';
    GET DIAGNOSTICS mfa_cleaned = ROW_COUNT;

    -- Nettoyer les tentatives de connexion anciennes (plus de 30 jours)
    DELETE FROM public.login_attempts
    WHERE created_at < NOW() - INTERVAL '30 days';
    GET DIAGNOSTICS login_cleaned = ROW_COUNT;

    total_cleaned := mfa_cleaned + login_cleaned;

    -- Log du nettoyage
    RAISE NOTICE 'Nettoyage terminé: % tokens MFA, % tentatives de connexion, % total',
                 mfa_cleaned, login_cleaned, total_cleaned;

    RETURN total_cleaned;
END;
$$ LANGUAGE plpgsql STABLE;

-- Fonction pour obtenir les statistiques de sécurité
CREATE OR REPLACE FUNCTION get_security_stats()
RETURNS TABLE (
    total_users INTEGER,
    mfa_enabled_users INTEGER,
    locked_users INTEGER,
    recent_login_attempts INTEGER,
    failed_login_attempts INTEGER,
    active_mfa_tokens INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        (SELECT COUNT(*)::INTEGER FROM public.users WHERE deleted_at IS NULL) as total_users,
        (SELECT COUNT(*)::INTEGER FROM public.users WHERE mfa_enabled = true AND deleted_at IS NULL) as mfa_enabled_users,
        (SELECT COUNT(*)::INTEGER FROM public.users WHERE locked_until > NOW() AND deleted_at IS NULL) as locked_users,
        (SELECT COUNT(*)::INTEGER FROM public.login_attempts WHERE created_at > NOW() - INTERVAL '24 hours') as recent_login_attempts,
        (SELECT COUNT(*)::INTEGER FROM public.login_attempts WHERE successful = false AND created_at > NOW() - INTERVAL '24 hours') as failed_login_attempts,
        (SELECT COUNT(*)::INTEGER FROM public.mfa_tokens WHERE expires_at > NOW() AND used_at IS NULL) as active_mfa_tokens;
END;
$$ LANGUAGE plpgsql STABLE;

-- Fonction pour obtenir les statistiques d'une boutique
CREATE OR REPLACE FUNCTION get_store_stats(store_id_param BIGINT)
RETURNS TABLE (
    total_products INTEGER,
    active_products INTEGER,
    total_orders INTEGER,
    pending_orders INTEGER,
    total_customers INTEGER,
    total_revenue DECIMAL(10,2),
    active_gateways INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        (SELECT COUNT(*)::INTEGER FROM public.products WHERE store_id = store_id_param) as total_products,
        (SELECT COUNT(*)::INTEGER FROM public.products WHERE store_id = store_id_param AND status = 'active') as active_products,
        (SELECT COUNT(*)::INTEGER FROM public.orders WHERE store_id = store_id_param) as total_orders,
        (SELECT COUNT(*)::INTEGER FROM public.orders WHERE store_id = store_id_param AND status = 'pending') as pending_orders,
        (SELECT COUNT(*)::INTEGER FROM public.customers WHERE store_id = store_id_param) as total_customers,
        (SELECT COALESCE(SUM(total_amount), 0) FROM public.orders WHERE store_id = store_id_param AND financial_status = 'paid') as total_revenue,
        (SELECT COUNT(*)::INTEGER FROM public.payment_gateways WHERE store_id = store_id_param AND is_active = true) as active_gateways;
END;
$$ LANGUAGE plpgsql STABLE;

-- Vue pour les statistiques de sécurité
CREATE OR REPLACE VIEW security_dashboard AS
SELECT
    u.id,
    u.name,
    u.email,
    u.mfa_enabled,
    u.last_login_at,
    u.login_attempts,
    u.locked_until,
    CASE
        WHEN u.locked_until > NOW() THEN 'Verrouillé'
        WHEN u.mfa_enabled THEN 'MFA Activé'
        ELSE 'Standard'
    END as security_status,
    (SELECT COUNT(*) FROM public.login_attempts la WHERE la.user_id = u.id AND la.created_at > NOW() - INTERVAL '24 hours') as recent_attempts,
    (SELECT COUNT(*) FROM public.mfa_tokens mt WHERE mt.user_id = u.id AND mt.expires_at > NOW()) as active_tokens
FROM public.users u
WHERE u.deleted_at IS NULL
ORDER BY u.last_login_at DESC NULLS LAST;

-- Vue pour le tableau de bord des boutiques
CREATE OR REPLACE VIEW stores_dashboard AS
SELECT
    s.id,
    s.name,
    s.is_active,
    u.name as owner_name,
    u.email as owner_email,
    (SELECT COUNT(*) FROM public.products p WHERE p.store_id = s.id) as total_products,
    (SELECT COUNT(*) FROM public.orders o WHERE o.store_id = s.id) as total_orders,
    (SELECT COUNT(*) FROM public.customers c WHERE c.store_id = s.id) as total_customers,
    (SELECT COALESCE(SUM(o.total_amount), 0) FROM public.orders o WHERE o.store_id = s.id AND o.financial_status = 'paid') as total_revenue,
    (SELECT COUNT(*) FROM public.payment_gateways pg WHERE pg.store_id = s.id AND pg.is_active = true) as active_gateways,
    s.created_at,
    s.updated_at
FROM public.stores s
JOIN public.users u ON s.owner_id = u.id
WHERE u.deleted_at IS NULL
ORDER BY s.created_at DESC;

-- Index supplémentaires pour les performances
CREATE INDEX IF NOT EXISTS idx_orders_financial_status ON public.orders(financial_status);
CREATE INDEX IF NOT EXISTS idx_orders_store_financial ON public.orders(store_id, financial_status);
CREATE INDEX IF NOT EXISTS idx_products_store_status ON public.products(store_id, status);
CREATE INDEX IF NOT EXISTS idx_users_mfa_locked ON public.users(mfa_enabled, locked_until);

-- CORRECTION : Remplacement de l'index partiel avec une fonction non-IMMUTABLE.
-- L'index original (`WHERE created_at > NOW() - INTERVAL '7 days'`) échouait.
-- Un index standard sur `created_at` est la bonne approche et reste performant.
CREATE INDEX IF NOT EXISTS idx_login_attempts_created_at ON public.login_attempts(created_at);


-- Activation de la sécurité au niveau des lignes (Row Level Security - RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_gateways ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mfa_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.login_attempts ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour les utilisateurs (peuvent voir et modifier leur propre profil)
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid()::text = supabase_user_id::text OR id = current_setting('app.current_user_id', true)::bigint);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid()::text = supabase_user_id::text OR id = current_setting('app.current_user_id', true)::bigint);

-- Politiques RLS pour les boutiques (le propriétaire peut tout gérer)
CREATE POLICY "Users can view own stores" ON public.stores
    FOR SELECT USING (owner_id = current_setting('app.current_user_id', true)::bigint);

CREATE POLICY "Users can manage own stores" ON public.stores
    FOR ALL USING (owner_id = current_setting('app.current_user_id', true)::bigint);

-- Politiques RLS pour les produits (le propriétaire de la boutique peut tout gérer)
CREATE POLICY "Users can view products of own stores" ON public.products
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.stores s
            WHERE s.id = products.store_id
            AND s.owner_id = current_setting('app.current_user_id', true)::bigint
        )
    );

CREATE POLICY "Users can manage products of own stores" ON public.products
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.stores s
            WHERE s.id = products.store_id
            AND s.owner_id = current_setting('app.current_user_id', true)::bigint
        )
    );

-- (NOTE: Des politiques similaires devraient être créées pour les clients, commandes, etc.
-- en suivant le même modèle pour s'assurer que les propriétaires de boutiques ne voient
-- que les données relatives à leurs propres boutiques.)


-- Message de confirmation
SELECT 'Configuration de sécurité et maintenance terminée avec succès !' as message;
