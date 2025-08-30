#!/bin/bash

echo "🧪 Test de Configuration CORS pour api.wozif.com"
echo "================================================"
echo ""

# Test 1: Requête OPTIONS (préflight CORS)
echo "1️⃣ Test OPTIONS (préflight CORS):"
curl -I -X OPTIONS "https://api.wozif.com/api/auth/validate-password" \
  -H "Origin: https://app.wozif.store" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type,Authorization"
echo ""
echo ""

# Test 2: Requête GET simple
echo "2️⃣ Test GET simple:"
curl -I "https://api.wozif.com/api/health" \
  -H "Origin: https://app.wozif.store"
echo ""
echo ""

# Test 3: Vérification des headers CORS
echo "3️⃣ Vérification des headers CORS:"
curl -v "https://api.wozif.com/api/health" \
  -H "Origin: https://app.wozif.store" \
  2>&1 | grep -E "(Access-Control|HTTP/|Origin)"
echo ""
echo ""

echo "✅ Tests terminés !"
echo ""
echo "📋 Résultats attendus :"
echo "   - OPTIONS doit retourner 200 (pas 405)"
echo "   - Access-Control-Allow-Origin: https://app.wozif.store"
echo "   - Access-Control-Allow-Credentials: true"
echo "   - Pas d'erreur CORS dans le navigateur"
