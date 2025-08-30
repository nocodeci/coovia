#!/bin/bash

echo "🧪 Test de la Route OPTIONS pour CORS Preflight"
echo "================================================"
echo ""

# Test 1: Route OPTIONS sur /api/auth/validate-password
echo "1️⃣ Test OPTIONS sur /api/auth/validate-password:"
curl -v -X OPTIONS "https://api.wozif.com/api/auth/validate-password" \
  -H "Origin: https://app.wozif.store" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type,Authorization"
echo ""
echo ""

# Test 2: Route OPTIONS sur /api/stores
echo "2️⃣ Test OPTIONS sur /api/stores:"
curl -v -X OPTIONS "https://api.wozif.com/api/stores" \
  -H "Origin: https://app.wozif.store" \
  -H "Access-Control-Request-Method: GET"
echo ""
echo ""

# Test 3: Route OPTIONS sur une route inexistante (doit aussi marcher)
echo "3️⃣ Test OPTIONS sur route inexistante:"
curl -v -X OPTIONS "https://api.wozif.com/api/route-inexistante" \
  -H "Origin: https://app.wozif.store"
echo ""
echo ""

echo "✅ Tests OPTIONS terminés !"
echo ""
echo "📋 Résultats attendus :"
echo "   - Toutes les requêtes OPTIONS doivent retourner 200"
echo "   - Pas d'erreur 405 Method Not Allowed"
echo "   - Headers CORS correctement envoyés"
