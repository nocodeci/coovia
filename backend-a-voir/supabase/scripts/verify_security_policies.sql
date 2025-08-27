-- Script de vérification des politiques de sécurité Supabase
-- Ce script vérifie que toutes les tables ont RLS activé et des politiques appropriées

-- ========================================
-- VÉRIFICATION DES TABLES SANS RLS
-- ========================================

SELECT 
    '⚠️  TABLE SANS RLS' as status,
    schemaname,
    tablename,
    'RLS non activé' as issue
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename NOT LIKE 'pg_%'
AND tablename NOT LIKE 'lunar_%'
AND rowsecurity = false
ORDER BY tablename;

-- ========================================
-- VÉRIFICATION DES TABLES SANS POLITIQUES
-- ========================================

SELECT 
    '🚨  TABLE SANS POLITIQUES' as status,
    t.schemaname,
    t.tablename,
    'Aucune politique de sécurité définie' as issue
FROM pg_tables t
LEFT JOIN pg_policies p ON t.tablename = p.tablename AND t.schemaname = p.schemaname
WHERE t.schemaname = 'public' 
AND t.tablename NOT LIKE 'pg_%'
AND t.tablename NOT LIKE 'lunar_%'
AND t.rowsecurity = true
AND p.policyname IS NULL
ORDER BY t.tablename;

-- ========================================
-- VÉRIFICATION DES POLITIQUES EXISTANTES
-- ========================================

SELECT 
    '✅  POLITIQUES EXISTANTES' as status,
    schemaname,
    tablename,
    policyname,
    cmd as operation,
    permissive,
    roles
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ========================================
-- RÉSUMÉ DES TABLES SÉCURISÉES
-- ========================================

WITH table_status AS (
    SELECT 
        t.tablename,
        t.rowsecurity as rls_enabled,
        COUNT(p.policyname) as policy_count,
        CASE 
            WHEN t.rowsecurity = false THEN '❌ RLS désactivé'
            WHEN COUNT(p.policyname) = 0 THEN '🚨 Aucune politique'
            WHEN COUNT(p.policyname) < 3 THEN '⚠️  Politiques partielles'
            ELSE '✅ Bien sécurisé'
        END as security_status
    FROM pg_tables t
    LEFT JOIN pg_policies p ON t.tablename = p.tablename AND t.schemaname = p.schemaname
    WHERE t.schemaname = 'public' 
    AND t.tablename NOT LIKE 'pg_%'
    AND t.tablename NOT LIKE 'lunar_%'
    GROUP BY t.tablename, t.rowsecurity
)
SELECT 
    tablename,
    rls_enabled,
    policy_count,
    security_status
FROM table_status
ORDER BY 
    CASE security_status
        WHEN '❌ RLS désactivé' THEN 1
        WHEN '🚨 Aucune politique' THEN 2
        WHEN '⚠️  Politiques partielles' THEN 3
        ELSE 4
    END,
    tablename;

-- ========================================
-- RECOMMANDATIONS DE SÉCURITÉ
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
AND tablename NOT LIKE 'pg_%'
AND tablename NOT LIKE 'lunar_%';

SELECT 
    '💡 RECOMMANDATIONS' as type,
    CASE 
        WHEN COUNT(*) FILTER (WHERE policy_count = 0) > 0 THEN 
            'Ajouter des politiques sur ' || COUNT(*) FILTER (WHERE policy_count = 0) || ' table(s)'
        ELSE 'Toutes les tables ont des politiques'
    END as recommendation
FROM (
    SELECT 
        t.tablename,
        COUNT(p.policyname) as policy_count
    FROM pg_tables t
    LEFT JOIN pg_policies p ON t.tablename = p.tablename AND t.schemaname = p.schemaname
    WHERE t.schemaname = 'public' 
    AND t.tablename NOT LIKE 'pg_%'
    AND t.tablename NOT LIKE 'lunar_%'
    AND t.rowsecurity = true
    GROUP BY t.tablename
) as table_policies;
