#!/bin/bash

# Script de test pour les URLs de boutiques
# Teste les URLs avec slugs

echo "🧪 Test des URLs de boutiques"
echo "=============================="

# Configuration
BASE_URL="https://my.wozif.com"
TEST_SLUGS=("boutique123" "ma-boutique" "store-abc" "test-2024")

# Fonction pour tester une URL
test_url() {
    local slug=$1
    local url="$BASE_URL/$slug"
    
    echo ""
    echo "🔍 Test: $url"
    
    # Test avec curl
    response=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    
    if [ "$response" = "200" ]; then
        echo "✅ Succès: Status $response"
    else
        echo "❌ Échec: Status $response"
    fi
}

# Tests des URLs avec slugs
echo ""
echo "📋 Tests des URLs avec slugs (Status 200 attendu)"
for slug in "${TEST_SLUGS[@]}"; do
    test_url "$slug"
done

# Test de l'URL principale
echo ""
echo "📋 Test de l'URL principale"
test_url ""

# Test d'une URL inexistante
echo ""
echo "📋 Test d'une URL inexistante"
test_url "boutique-inexistante"

echo ""
echo "🎉 Tests terminés !"
echo ""
echo "📊 Résumé:"
echo "- URLs avec slugs: Accès normal à l'application"
echo "- URL principale: Accès normal à l'application"
echo "- URLs inexistantes: Gérées par React Router"
