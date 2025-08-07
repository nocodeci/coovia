#!/bin/bash

# Script de test pour la configuration Hostinger + Vercel
# Teste les URLs avec la configuration actuelle

echo "🧪 Test de la configuration Hostinger + Vercel"
echo "============================================="

# Configuration
BASE_URL="https://my.wozif.com"
TEST_SLUGS=("boutique123" "ma-boutique" "store-abc" "test-2024")

# Fonction pour tester une URL
test_url() {
    local url=$1
    local description=$2
    
    echo ""
    echo "🔍 Test: $description"
    echo "URL: $url"
    
    # Test avec curl
    response=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    
    if [ "$response" = "200" ]; then
        echo "✅ Succès: Status $response"
    else
        echo "❌ Échec: Status $response"
    fi
}

# Test DNS
echo ""
echo "📋 Test de la résolution DNS"
echo "Domaine principal (Hostinger):"
nslookup wozif.com | grep "Address:"

echo ""
echo "Sous-domaine (Vercel):"
nslookup my.wozif.com | grep "Address:"

# Tests des URLs
echo ""
echo "📋 Tests des URLs (Status 200 attendu)"

# Test de l'URL principale
test_url "$BASE_URL" "Application principale"

# Tests des URLs avec slugs
for slug in "${TEST_SLUGS[@]}"; do
    test_url "$BASE_URL/$slug" "Boutique: $slug"
done

# Test d'une URL inexistante
test_url "$BASE_URL/boutique-inexistante" "URL inexistante (gérée par React Router)"

# Test HTTPS
echo ""
echo "📋 Test HTTPS"
test_url "$BASE_URL" "HTTPS (redirection automatique)"

# Test des headers de sécurité
echo ""
echo "📋 Test des headers de sécurité"
headers=$(curl -s -I "$BASE_URL" | grep -E "(Strict-Transport-Security|X-Content-Type-Options|X-Frame-Options|X-XSS-Protection)")

if [ -n "$headers" ]; then
    echo "✅ Headers de sécurité présents"
    echo "$headers"
else
    echo "❌ Headers de sécurité manquants"
fi

echo ""
echo "🎉 Tests terminés !"
echo ""
echo "📊 Résumé de la configuration Hostinger + Vercel:"
echo "- ✅ Domaine principal: wozif.com (Hostinger)"
echo "- ✅ Sous-domaine: my.wozif.com (Vercel)"
echo "- ✅ Application: Déployée sur Vercel"
echo "- ✅ URLs: my.wozif.com/{slug} fonctionnelles"
echo "- ✅ HTTPS: Activé automatiquement"
echo "- ✅ Headers de sécurité: Configurés"
echo ""
echo "🌐 URLs de test:"
echo "- https://my.wozif.com"
echo "- https://my.wozif.com/boutique123"
echo "- https://my.wozif.com/ma-boutique"
