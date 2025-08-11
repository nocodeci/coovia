-- Script de vérification complète des tables de la base de données
-- Ce script liste toutes les tables qui devraient être présentes après application des migrations

-- ========================================
-- TABLES PUBLIQUES (SCHEMA PUBLIC)
-- ========================================

SELECT 
    '📊 TABLES PUBLIQUES DÉTECTÉES' as status,
    tablename,
    rowsecurity as rls_enabled,
    CASE 
        WHEN rowsecurity = false THEN '❌ RLS désactivé'
        ELSE '✅ RLS activé'
    END as rls_status
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename NOT LIKE 'pg_%'
ORDER BY tablename;

-- ========================================
-- TABLES LUNAR SPÉCIFIQUES
-- ========================================

SELECT 
    '🛒 TABLES LUNAR DÉTECTÉES' as status,
    tablename,
    rowsecurity as rls_enabled,
    CASE 
        WHEN rowsecurity = false THEN '❌ RLS désactivé'
        ELSE '✅ RLS activé'
    END as rls_status
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename LIKE 'lunar_%'
ORDER BY tablename;

-- ========================================
-- TABLES ATTENDUES - SCHEMA PUBLIC
-- ========================================

WITH expected_tables AS (
    SELECT 'users' as table_name, 'Utilisateurs et authentification' as description, 'Critique' as importance
    UNION ALL SELECT 'stores', 'Boutiques', 'Critique'
    UNION ALL SELECT 'products', 'Produits', 'Critique'
    UNION ALL SELECT 'customers', 'Clients', 'Critique'
    UNION ALL SELECT 'orders', 'Commandes', 'Critique'
    UNION ALL SELECT 'order_items', 'Éléments de commande', 'Critique'
    UNION ALL SELECT 'payment_gateways', 'Passerelles de paiement', 'Haute'
    UNION ALL SELECT 'payment_methods', 'Méthodes de paiement', 'Haute'
    UNION ALL SELECT 'payment_transactions', 'Transactions de paiement', 'Haute'
    UNION ALL SELECT 'mfa_tokens', 'Tokens MFA', 'Haute'
    UNION ALL SELECT 'login_attempts', 'Tentatives de connexion', 'Moyenne'
    UNION ALL SELECT 'personal_access_tokens', 'Tokens d''accès personnel', 'Haute'
    UNION ALL SELECT 'sessions', 'Sessions utilisateur', 'Moyenne'
    UNION ALL SELECT 'cache', 'Cache système', 'Moyenne'
    UNION ALL SELECT 'cache_locks', 'Verrous de cache', 'Moyenne'
)
SELECT 
    '📋 TABLES PUBLIQUES ATTENDUES' as status,
    et.table_name,
    et.description,
    et.importance,
    CASE 
        WHEN t.tablename IS NOT NULL THEN '✅ Présente'
        ELSE '❌ Manquante'
    END as presence_status,
    CASE 
        WHEN t.rowsecurity = true THEN '✅ RLS activé'
        WHEN t.rowsecurity = false THEN '❌ RLS désactivé'
        ELSE '❓ Inconnu'
    END as rls_status
FROM expected_tables et
LEFT JOIN pg_tables t ON et.table_name = t.tablename AND t.schemaname = 'public'
ORDER BY 
    CASE et.importance
        WHEN 'Critique' THEN 1
        WHEN 'Haute' THEN 2
        WHEN 'Moyenne' THEN 3
        ELSE 4
    END,
    et.table_name;

-- ========================================
-- TABLES LUNAR ATTENDUES
-- ========================================

WITH expected_lunar_tables AS (
    -- Tables de base Lunar
    SELECT 'lunar_channels' as table_name, 'Canaux de vente' as description, 'Haute' as importance
    UNION ALL SELECT 'lunar_customers', 'Clients Lunar', 'Critique'
    UNION ALL SELECT 'lunar_products', 'Produits Lunar', 'Critique'
    UNION ALL SELECT 'lunar_orders', 'Commandes Lunar', 'Critique'
    UNION ALL SELECT 'lunar_product_variants', 'Variantes de produits', 'Haute'
    UNION ALL SELECT 'lunar_collections', 'Collections', 'Moyenne'
    UNION ALL SELECT 'lunar_collection_product', 'Produits dans collections', 'Moyenne'
    
    -- Tables critiques manquantes
    UNION ALL SELECT 'lunar_carts', 'Paniers utilisateurs', 'Critique'
    UNION ALL SELECT 'lunar_cart_lines', 'Lignes de panier', 'Critique'
    UNION ALL SELECT 'lunar_inventory', 'Inventaire', 'Critique'
    UNION ALL SELECT 'lunar_discounts', 'Réductions', 'Haute'
    UNION ALL SELECT 'lunar_brands', 'Marques', 'Haute'
    UNION ALL SELECT 'lunar_categories', 'Catégories', 'Haute'
    UNION ALL SELECT 'lunar_attributes', 'Attributs produits', 'Critique'
    UNION ALL SELECT 'lunar_attribute_groups', 'Groupes d''attributs', 'Critique'
    
    -- Tables système
    UNION ALL SELECT 'lunar_tax_classes', 'Classes de taxe', 'Haute'
    UNION ALL SELECT 'lunar_tax_rates', 'Taux de taxe', 'Haute'
    UNION ALL SELECT 'lunar_menus', 'Menus navigation', 'Moyenne'
    UNION ALL SELECT 'lunar_pages', 'Pages CMS', 'Moyenne'
    UNION ALL SELECT 'lunar_urls', 'URLs SEO', 'Moyenne'
    UNION ALL SELECT 'lunar_assets', 'Assets (images, fichiers)', 'Haute'
    UNION ALL SELECT 'lunar_tags', 'Tags', 'Moyenne'
)
SELECT 
    '🛒 TABLES LUNAR ATTENDUES' as status,
    elt.table_name,
    elt.description,
    elt.importance,
    CASE 
        WHEN t.tablename IS NOT NULL THEN '✅ Présente'
        ELSE '❌ Manquante'
    END as presence_status,
    CASE 
        WHEN t.rowsecurity = true THEN '✅ RLS activé'
        WHEN t.rowsecurity = false THEN '❌ RLS désactivé'
        ELSE '❓ Inconnu'
    END as rls_status
FROM expected_lunar_tables elt
LEFT JOIN pg_tables t ON elt.table_name = t.tablename AND t.schemaname = 'public'
ORDER BY 
    CASE elt.importance
        WHEN 'Critique' THEN 1
        WHEN 'Haute' THEN 2
        WHEN 'Moyenne' THEN 3
        ELSE 4
    END,
    elt.table_name;

-- ========================================
-- VÉRIFICATION DES POLITIQUES DE SÉCURITÉ
-- ========================================

SELECT 
    '🔒 POLITIQUES DE SÉCURITÉ' as status,
    t.tablename,
    COUNT(p.policyname) as policy_count,
    CASE 
        WHEN t.rowsecurity = false THEN '❌ RLS désactivé'
        WHEN COUNT(p.policyname) = 0 THEN '🚨 Aucune politique'
        WHEN COUNT(p.policyname) < 2 THEN '⚠️  Politiques insuffisantes'
        WHEN COUNT(p.policyname) < 4 THEN '⚠️  Politiques partielles'
        ELSE '✅ Bien sécurisé'
    END as security_status
FROM pg_tables t
LEFT JOIN pg_policies p ON t.tablename = p.tablename AND t.schemaname = p.schemaname
WHERE t.schemaname = 'public' 
AND t.tablename NOT LIKE 'pg_%'
GROUP BY t.tablename, t.rowsecurity
ORDER BY 
    CASE 
        WHEN t.rowsecurity = false THEN 1
        WHEN COUNT(p.policyname) = 0 THEN 2
        WHEN COUNT(p.policyname) < 2 THEN 3
        WHEN COUNT(p.policyname) < 4 THEN 4
        ELSE 5
    END,
    t.tablename;

-- ========================================
-- RÉSUMÉ GLOBAL
-- ========================================

SELECT 
    '📊 RÉSUMÉ GLOBAL' as status,
    COUNT(*) as total_tables,
    COUNT(*) FILTER (WHERE rowsecurity = true) as tables_with_rls,
    COUNT(*) FILTER (WHERE rowsecurity = false) as tables_without_rls,
    ROUND(
        (COUNT(*) FILTER (WHERE rowsecurity = true)::decimal / COUNT(*)::decimal) * 100, 2
    ) as rls_coverage_percent
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename NOT LIKE 'pg_%';

-- ========================================
-- RECOMMANDATIONS
-- ========================================

SELECT 
    '💡 RECOMMANDATIONS' as type,
    CASE 
        WHEN COUNT(*) FILTER (WHERE rowsecurity = false) > 0 THEN 
            'Activer RLS sur ' || COUNT(*) FILTER (WHERE rowsecurity = false) || ' table(s)'
        ELSE 'Toutes les tables ont RLS activé'
    END as recommendation
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename NOT LIKE 'pg_%';

SELECT 
    '💡 RECOMMANDATIONS' as type,
    CASE 
        WHEN COUNT(*) FILTER (WHERE policy_count = 0) > 0 THEN 
            'Ajouter des politiques sur ' || COUNT(*) FILTER (WHERE policy_count = 0) || ' table(s) avec RLS'
        ELSE 'Toutes les tables avec RLS ont des politiques'
    END as recommendation
FROM (
    SELECT 
        t.tablename,
        COUNT(p.policyname) as policy_count
    FROM pg_tables t
    LEFT JOIN pg_policies p ON t.tablename = p.tablename AND t.schemaname = p.schemaname
    WHERE t.schemaname = 'public' 
    AND t.tablename NOT LIKE 'pg_%'
    AND t.rowsecurity = true
    GROUP BY t.tablename
) as table_policies;

-- ========================================
-- TABLES SYSTÈME SUPABASE (INFORMATIF)
-- ========================================

SELECT 
    '🔧 TABLES SYSTÈME SUPABASE' as status,
    tablename,
    'Table système Supabase' as description
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename LIKE 'pg_%'
ORDER BY tablename;
