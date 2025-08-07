#!/bin/bash

# Script de test pour les sous-domaines dynamiques
# Teste les redirections et la validation des slugs

echo "🧪 Test des sous-domaines dynamiques"
echo "=================================="

# Configuration
BASE_URL="https://my.wozif.com"
TEST_SLUGS=("boutique123" "ma-boutique" "store-abc" "test-2024")
INVALID_SLUGS=("ab" "very-long-slug-that-exceeds-fifty-characters-and-should-be-rejected" "invalid@slug" "test_slug")

# Fonction pour tester une redirection
test_redirection() {
    local slug=$1
    local expected_status=$2
    local description=$3
    
    echo ""
    echo "🔍 Test: $description"
    echo "URL: https://$slug.my.wozif.com"
    
    # Test avec curl
    response=$(curl -s -o /dev/null -w "%{http_code}" "https://$slug.my.wozif.com")
    
    if [ "$response" = "$expected_status" ]; then
        echo "✅ Succès: Status $response (attendu: $expected_status)"
    else
        echo "❌ Échec: Status $response (attendu: $expected_status)"
    fi
}

# Fonction pour tester une URL spécifique
test_url() {
    local url=$1
    local expected_status=$2
    local description=$3
    
    echo ""
    echo "🔍 Test: $description"
    echo "URL: $url"
    
    response=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    
    if [ "$response" = "$expected_status" ]; then
        echo "✅ Succès: Status $response (attendu: $expected_status)"
    else
        echo "❌ Échec: Status $response (attendu: $expected_status)"
    fi
}

# Tests des sous-domaines valides
echo ""
echo "📋 Tests des sous-domaines valides (redirection 301 attendue)"
for slug in "${TEST_SLUGS[@]}"; do
    test_redirection "$slug" "301" "Sous-domaine valide: $slug"
done

# Tests des sous-domaines invalides
echo ""
echo "📋 Tests des sous-domaines invalides (400 ou 404 attendu)"
for slug in "${INVALID_SLUGS[@]}"; do
    test_redirection "$slug" "400" "Sous-domaine invalide: $slug"
done

# Tests des sous-domaines réservés
echo ""
echo "📋 Tests des sous-domaines réservés (404 attendu)"
reserved_subdomains=("www" "api" "my" "admin" "app")
for subdomain in "${reserved_subdomains[@]}"; do
    test_redirection "$subdomain" "404" "Sous-domaine réservé: $subdomain"
done

# Tests des URLs spécifiques
echo ""
echo "📋 Tests des URLs spécifiques"
test_url "https://my.wozif.com/boutique123" "200" "URL directe avec slug"
test_url "https://my.wozif.com/boutique123/products" "200" "URL avec chemin"
test_url "https://my.wozif.com/boutique123/checkout" "200" "URL de checkout"

# Test de performance
echo ""
echo "📋 Test de performance"
start_time=$(date +%s.%N)
curl -s -o /dev/null "https://boutique123.my.wozif.com"
end_time=$(date +%s.%N)
duration=$(echo "$end_time - $start_time" | bc)
echo "⏱️  Temps de redirection: ${duration}s"

echo ""
echo "🎉 Tests terminés !"
echo ""
echo "📊 Résumé:"
echo "- Sous-domaines valides: Redirection 301 vers my.wozif.com/{slug}"
echo "- Sous-domaines invalides: Erreur 400"
echo "- Sous-domaines réservés: Erreur 404"
echo "- URLs directes: Accès normal à l'application"
