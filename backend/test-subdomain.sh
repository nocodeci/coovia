#!/bin/bash

# Script de test pour la création automatique de sous-domaines
# Usage: ./test-subdomain.sh

echo "🧪 Test de la création automatique de sous-domaines"
echo "=================================================="

# Configuration
API_URL="http://localhost:8000/api"
TEST_SLUG="test-boutique-$(date +%s)"

echo "📋 Configuration:"
echo "  API URL: $API_URL"
echo "  Test slug: $TEST_SLUG"
echo ""

# 1. Test de validation du slug
echo "1️⃣ Test de validation du slug..."
curl -s -X GET "$API_URL/stores/subdomain/$TEST_SLUG/check" \
  -H "Accept: application/json" \
  | jq '.'

echo ""
echo "2️⃣ Test de création de boutique avec sous-domaine..."
echo "   (Ce test nécessite un token d'authentification)"
echo "   Créez une boutique via l'interface web et vérifiez les logs :"
echo "   tail -f storage/logs/laravel.log | grep 'sous-domaine'"
echo ""

# 3. Test de vérification DNS
echo "3️⃣ Test de vérification DNS..."
echo "   Une fois la boutique créée, testez :"
echo "   curl -I https://$TEST_SLUG.wozif.store"
echo ""

echo "✅ Tests terminés"
echo ""
echo "📝 Pour vérifier les logs en temps réel :"
echo "   tail -f storage/logs/laravel.log"
echo ""
echo "🔧 Pour configurer les variables d'environnement :"
echo "   Voir le fichier SUBDOMAIN_SETUP_GUIDE.md"
