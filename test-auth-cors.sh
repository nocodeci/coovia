#!/bin/bash

echo "🧪 Test d'Authentification avec CORS"
echo "===================================="
echo ""

# Test 1: Validation email (première étape)
echo "1️⃣ Test validation email :"
curl -v "https://api.wozif.com/api/auth/validate-email" \
  -H "Origin: https://app.wozif.store" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}' \
  2>&1 | grep -E "(HTTP/|access-control|vary)"
echo ""
echo ""

# Test 2: Validation password (deuxième étape)
echo "2️⃣ Test validation password :"
curl -v "https://api.wozif.com/api/auth/validate-password" \
  -H "Origin: https://app.wozif.store" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","temp_token":"test-token"}' \
  2>&1 | grep -E "(HTTP/|access-control|vary)"
echo ""
echo ""

echo "✅ Tests d'authentification terminés !"
echo ""
echo "📋 Résultats attendus :"
echo "   - HTTP 200 ou 422 (pas d'erreur CORS)"
echo "   - access-control-allow-origin: https://app.wozif.store"
echo "   - access-control-allow-credentials: true"
echo "   - Plus de blocage CORS dans le navigateur"
