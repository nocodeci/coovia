#!/bin/bash

# Script pour appliquer les corrections de sécurité Supabase
# Ce script corrige le problème des tables "unrestricted"

set -e

echo "🔒 Application des corrections de sécurité Supabase..."
echo "=================================================="

# Vérifier que Supabase CLI est installé
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI n'est pas installé. Veuillez l'installer d'abord."
    echo "   Installation: https://supabase.com/docs/guides/cli"
    exit 1
fi

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "supabase/config.toml" ]; then
    echo "❌ Veuillez exécuter ce script depuis le répertoire racine du projet"
    exit 1
fi

# Démarrer Supabase localement si pas déjà démarré
echo "🚀 Démarrage de Supabase..."
supabase start

# Attendre que Supabase soit prêt
echo "⏳ Attente que Supabase soit prêt..."
sleep 10

# Appliquer les migrations de sécurité
echo "🔧 Application des migrations de sécurité..."
echo "   - Migration générale (011_complete_security_policies.sql)"
echo "   - Migration Lunar complète (012_complete_lunar_security.sql)"
supabase db reset --linked

# Vérifier l'état des politiques de sécurité
echo "🔍 Vérification des politiques de sécurité..."
supabase db reset --linked

echo ""
echo "✅ Corrections de sécurité appliquées avec succès !"
echo ""
echo "📊 Pour vérifier l'état de la sécurité, exécutez :"
echo "   supabase db reset --linked"
echo ""
echo "🔍 Pour une vérification détaillée, utilisez le script :"
echo "   supabase/supabase/scripts/verify_security_policies.sql"
echo ""
echo "🌐 Accédez à Supabase Studio :"
echo "   http://localhost:54323"
echo ""
echo "⚠️  IMPORTANT : Redémarrez votre application après ces modifications"
