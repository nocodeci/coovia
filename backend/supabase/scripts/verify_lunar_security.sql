-- Script de vérification de la sécurité Lunar
-- Ce script vérifie que toutes les tables Lunar sont correctement sécurisées

-- ========================================
-- VÉRIFICATION DES TABLES LUNAR EXISTANTES
-- ========================================

SELECT 
    '📊 TABLES LUNAR DÉTECTÉES' as status,
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
-- VÉRIFICATION DES POLITIQUES LUNAR
-- ========================================

WITH lunar_policies AS (
    SELECT 
        t.tablename,
        t.rowsecurity as rls_enabled,
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
    AND t.tablename LIKE 'lunar_%'
    GROUP BY t.tablename, t.rowsecurity
)
SELECT 
    '🔒 SÉCURITÉ LUNAR' as status,
    tablename,
    rls_enabled,
    policy_count,
    security_status
FROM lunar_policies
ORDER BY 
    CASE security_status
        WHEN '❌ RLS désactivé' THEN 1
        WHEN '🚨 Aucune politique' THEN 2
        WHEN '⚠️  Politiques insuffisantes' THEN 3
        WHEN '⚠️  Politiques partielles' THEN 4
        ELSE 5
    END,
    tablename;

-- ========================================
-- DÉTAIL DES POLITIQUES PAR TABLE
-- ========================================

SELECT 
    '📋 DÉTAIL DES POLITIQUES' as status,
    tablename,
    policyname,
    cmd as operation,
    permissive,
    roles
FROM pg_policies 
WHERE schemaname = 'public'
AND tablename LIKE 'lunar_%'
ORDER BY tablename, policyname;

-- ========================================
-- TABLES LUNAR MANQUANTES (COMMUNES)
-- ========================================

SELECT 
    '🔍 TABLES LUNAR MANQUANTES' as status,
    'lunar_attributes' as table_name,
    'Attributs de produits' as description,
    'Critique' as importance
UNION ALL
SELECT 
    '🔍 TABLES LUNAR MANQUANTES' as status,
    'lunar_attribute_groups' as table_name,
    'Groupes d''attributs' as description,
    'Critique' as importance
UNION ALL
SELECT 
    '🔍 TABLES LUNAR MANQUANTES' as status,
    'lunar_brands' as table_name,
    'Marques' as description,
    'Haute' as importance
UNION ALL
SELECT 
    '🔍 TABLES LUNAR MANQUANTES' as status,
    'lunar_categories' as table_name,
    'Catégories' as description,
    'Haute' as importance
UNION ALL
SELECT 
    '🔍 TABLES LUNAR MANQUANTES' as status,
    'lunar_carts' as table_name,
    'Paniers' as description,
    'Critique' as importance
UNION ALL
SELECT 
    '🔍 TABLES LUNAR MANQUANTES' as status,
    'lunar_cart_lines' as table_name,
    'Lignes de panier' as description,
    'Critique' as importance
UNION ALL
SELECT 
    '🔍 TABLES LUNAR MANQUANTES' as status,
    'lunar_discounts' as table_name,
    'Réductions' as description,
    'Haute' as importance
UNION ALL
SELECT 
    '🔍 TABLES LUNAR MANQUANTES' as status,
    'lunar_inventory' as table_name,
    'Inventaire' as description,
    'Critique' as importance
UNION ALL
SELECT 
    '🔍 TABLES LUNAR MANQUANTES' as status,
    'lunar_menus' as table_name,
    'Menus de navigation' as description,
    'Moyenne' as importance
UNION ALL
SELECT 
    '🔍 TABLES LUNAR MANQUANTES' as status,
    'lunar_pages' as table_name,
    'Pages CMS' as description,
    'Moyenne' as importance
UNION ALL
SELECT 
    '🔍 TABLES LUNAR MANQUANTES' as status,
    'lunar_tax_classes' as table_name,
    'Classes de taxe' as description,
    'Haute' as importance
UNION ALL
SELECT 
    '🔍 TABLES LUNAR MANQUANTES' as status,
    'lunar_tax_rates' as table_name,
    'Taux de taxe' as description,
    'Haute' as importance
UNION ALL
SELECT 
    '🔍 TABLES LUNAR MANQUANTES' as status,
    'lunar_urls' as table_name,
    'URLs SEO' as description,
    'Moyenne' as importance
UNION ALL
SELECT 
    '🔍 TABLES LUNAR MANQUANTES' as status,
    'lunar_assets' as table_name,
    'Assets (images, fichiers)' as description,
    'Haute' as importance
UNION ALL
SELECT 
    '🔍 TABLES LUNAR MANQUANTES' as status,
    'lunar_tags' as table_name,
    'Tags' as description,
    'Moyenne' as importance;

-- ========================================
-- RECOMMANDATIONS DE SÉCURITÉ LUNAR
-- ========================================

SELECT 
    '💡 RECOMMANDATIONS LUNAR' as type,
    CASE 
        WHEN COUNT(*) FILTER (WHERE rowsecurity = false) > 0 THEN 
            'Activer RLS sur ' || COUNT(*) FILTER (WHERE rowsecurity = false) || ' table(s) Lunar'
        ELSE 'Toutes les tables Lunar ont RLS activé'
    END as recommendation
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename LIKE 'lunar_%';

SELECT 
    '💡 RECOMMANDATIONS LUNAR' as type,
    CASE 
        WHEN COUNT(*) FILTER (WHERE policy_count = 0) > 0 THEN 
            'Ajouter des politiques sur ' || COUNT(*) FILTER (WHERE policy_count = 0) || ' table(s) Lunar'
        ELSE 'Toutes les tables Lunar ont des politiques'
    END as recommendation
FROM (
    SELECT 
        t.tablename,
        COUNT(p.policyname) as policy_count
    FROM pg_tables t
    LEFT JOIN pg_policies p ON t.tablename = p.tablename AND t.schemaname = p.schemaname
    WHERE t.schemaname = 'public' 
    AND t.tablename LIKE 'lunar_%'
    AND t.rowsecurity = true
    GROUP BY t.tablename
) as lunar_table_policies;

-- ========================================
-- VÉRIFICATION DES RELATIONS LUNAR
-- ========================================

SELECT 
    '🔗 RELATIONS LUNAR' as status,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
AND tc.table_name LIKE 'lunar_%'
ORDER BY tc.table_name, kcu.column_name;

-- ========================================
-- RÉSUMÉ DE SÉCURITÉ LUNAR
-- ========================================

SELECT 
    '📊 RÉSUMÉ LUNAR' as status,
    COUNT(*) as total_tables,
    COUNT(*) FILTER (WHERE rowsecurity = true) as tables_with_rls,
    COUNT(*) FILTER (WHERE rowsecurity = false) as tables_without_rls,
    ROUND(
        (COUNT(*) FILTER (WHERE rowsecurity = true)::decimal / COUNT(*)::decimal) * 100, 2
    ) as rls_coverage_percent
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename LIKE 'lunar_%';
