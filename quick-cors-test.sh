#!/bin/bash

echo "🚀 Test Rapide CORS pour WOZIF"
echo "================================"
echo ""

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
API_URL="https://api.wozif.com"
FRONTEND_ORIGIN="https://app.wozif.store"

echo "🌐 Test de l'API: $API_URL"
echo "🎯 Frontend: $FRONTEND_ORIGIN"
echo ""

# Test 1: Endpoint de santé
echo "1️⃣ Test endpoint /api/health..."
if curl -s -o /dev/null -w "%{http_code}" "$API_URL/api/health" | grep -q "200"; then
    echo -e "${GREEN}✅ API accessible${NC}"
else
    echo -e "${RED}❌ API inaccessible${NC}"
    exit 1
fi

# Test 2: Test CORS preflight
echo ""
echo "2️⃣ Test CORS preflight (OPTIONS)..."
CORS_RESPONSE=$(curl -s -I -X OPTIONS \
    -H "Origin: $FRONTEND_ORIGIN" \
    -H "Access-Control-Request-Method: GET" \
    -H "Access-Control-Request-Headers: Content-Type, Authorization" \
    "$API_URL/api/auth/check")

if echo "$CORS_RESPONSE" | grep -q "Access-Control-Allow-Origin"; then
    echo -e "${GREEN}✅ En-têtes CORS présents${NC}"
    
    # Afficher les en-têtes CORS
    echo "$CORS_RESPONSE" | grep -E "(Access-Control-|HTTP/)"
else
    echo -e "${RED}❌ En-têtes CORS manquants${NC}"
    echo "Réponse complète:"
    echo "$CORS_RESPONSE"
fi

# Test 3: Test avec Origin
echo ""
echo "3️⃣ Test avec en-tête Origin..."
ORIGIN_RESPONSE=$(curl -s -I \
    -H "Origin: $FRONTEND_ORIGIN" \
    "$API_URL/api/health")

if echo "$ORIGIN_RESPONSE" | grep -q "Access-Control-Allow-Origin"; then
    echo -e "${GREEN}✅ CORS fonctionne avec Origin${NC}"
else
    echo -e "${YELLOW}⚠️  CORS peut ne pas fonctionner correctement${NC}"
fi

# Test 4: Test de l'endpoint auth/check
echo ""
echo "4️⃣ Test endpoint /api/auth/check..."
AUTH_RESPONSE=$(curl -s -w "%{http_code}" \
    -H "Origin: $FRONTEND_ORIGIN" \
    "$API_URL/api/auth/check")

HTTP_CODE="${AUTH_RESPONSE: -3}"
RESPONSE_BODY="${AUTH_RESPONSE%???}"

if [ "$HTTP_CODE" = "401" ]; then
    echo -e "${GREEN}✅ Endpoint accessible (401 = non authentifié, c'est normal)${NC}"
elif [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ Endpoint accessible (200 = OK)${NC}"
else
    echo -e "${YELLOW}⚠️  Endpoint retourne $HTTP_CODE${NC}"
fi

echo ""
echo "📋 Résumé des tests:"
echo "===================="

if echo "$CORS_RESPONSE" | grep -q "Access-Control-Allow-Origin" && \
   echo "$ORIGIN_RESPONSE" | grep -q "Access-Control-Allow-Origin"; then
    echo -e "${GREEN}🎉 Configuration CORS OK !${NC}"
    echo "Votre frontend devrait maintenant pouvoir accéder à l'API."
else
    echo -e "${RED}❌ Problème CORS détecté${NC}"
    echo "Vérifiez que:"
    echo "1. Le middleware CORS est bien enregistré"
    echo "2. Le serveur Forge a été redémarré"
    echo "3. Les modifications ont été déployées"
fi

echo ""
echo "🧪 Pour tester depuis le frontend:"
echo "Ouvrez la console de votre navigateur sur $FRONTEND_ORIGIN"
echo "Et exécutez:"
echo "fetch('$API_URL/api/health').then(r => r.json()).then(console.log)"
