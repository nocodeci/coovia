#!/bin/bash

# Script de test pour le domaine app.wozif.com
# Teste la configuration DNS et l'accessibilité

echo "🧪 Test du domaine app.wozif.com"
echo "=================================="

# Configuration
DOMAIN="app.wozif.com"
VERCEL_IP="76.76.21.21"

# Fonction pour tester une URL
test_url() {
    local url=$1
    local expected_status=$2
    local description=$3
    
    echo ""
    echo "🔍 Test: $description"
    echo "URL: $url"
    
    # Test avec curl
    response=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    
    if [ "$response" = "$expected_status" ]; then
        echo "✅ Succès: Status $response (attendu: $expected_status)"
    else
        echo "❌ Échec: Status $response (attendu: $expected_status)"
    fi
}

# Test DNS
echo ""
echo "📋 Test de la résolution DNS"
echo "Domaine: $DOMAIN"
nslookup $DOMAIN | grep "Address:"

# Test de l'IP Vercel
echo ""
echo "📋 Test de l'IP Vercel"
current_ip=$(nslookup $DOMAIN | grep "Address:" | tail -1 | awk '{print $2}')
echo "IP actuelle: $current_ip"
echo "IP Vercel attendue: $VERCEL_IP"

if [ "$current_ip" = "$VERCEL_IP" ]; then
    echo "✅ IP correcte - Pointe vers Vercel"
else
    echo "❌ IP incorrecte - Doit pointer vers Vercel"
    echo "⚠️  Configuration DNS requise chez Hostinger:"
    echo "   Type: A"
    echo "   Nom: app"
    echo "   Valeur: $VERCEL_IP"
    echo "   TTL: 3600"
fi

# Test HTTPS
echo ""
echo "📋 Test HTTPS"
test_url "https://$DOMAIN" "200" "Accès HTTPS"

# Test HTTP (redirection)
echo ""
echo "📋 Test HTTP (redirection)"
test_url "http://$DOMAIN" "301" "Redirection HTTP vers HTTPS"

# Test des headers de sécurité
echo ""
echo "📋 Test des headers de sécurité"
headers=$(curl -s -I "https://$DOMAIN")
echo "$headers" | grep -E "(X-Content-Type-Options|X-Frame-Options|X-XSS-Protection)" || echo "⚠️  Headers de sécurité non détectés"

# Test de performance
echo ""
echo "📋 Test de performance"
start_time=$(date +%s.%N)
curl -s -o /dev/null "https://$DOMAIN"
end_time=$(date +%s.%N)
duration=$(echo "$end_time - $start_time" | bc)
echo "⏱️  Temps de réponse: ${duration}s"

# Test de l'application React
echo ""
echo "📋 Test de l'application React"
html_content=$(curl -s "https://$DOMAIN")
if echo "$html_content" | grep -q "react"; then
    echo "✅ Application React détectée"
else
    echo "❌ Application React non détectée"
fi

echo ""
echo "🎉 Tests terminés !"
echo ""
echo "📊 Résumé:"
echo "- DNS: Doit pointer vers Vercel ($VERCEL_IP)"
echo "- HTTPS: Accès sécurisé"
echo "- Headers: Sécurité configurée"
echo "- Performance: Optimisée"
echo ""
echo "🌐 URLs de test:"
echo "- https://$DOMAIN"
echo "- http://$DOMAIN (redirection)"
