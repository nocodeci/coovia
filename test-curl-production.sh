#!/bin/bash

echo "🔍 Test de l'API Cloudflare en Production avec cURL"
echo "==================================================="
echo ""

# Test 1: Vérification de l'accessibilité de l'API
echo "📡 Test 1: Vérification de l'accessibilité de l'API..."
curl -s -o /dev/null -w "Status: %{http_code}\n" "https://api.wozif.com/api/cloudflare/upload"
echo ""

# Test 2: Test avec méthode GET
echo "📡 Test 2: Test avec méthode GET..."
curl -s -X GET "https://api.wozif.com/api/cloudflare/upload" | head -c 200
echo "..."
echo ""

# Test 3: Test avec méthode POST sans fichier
echo "📡 Test 3: Test POST sans fichier..."
curl -s -X POST "https://api.wozif.com/api/cloudflare/upload" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "store_id=9fbf121f-1496-4f97-ad7f-096b3866e813&type=document"
echo ""
echo ""

# Test 4: Test avec méthode POST avec fichier vide
echo "📡 Test 4: Test POST avec fichier vide..."
curl -s -X POST "https://api.wozif.com/api/cloudflare/upload" \
  -F "file=@/dev/null" \
  -F "store_id=9fbf121f-1496-4f97-ad7f-096b3866e813" \
  -F "type=document"
echo ""
echo ""

# Test 5: Vérification des headers CORS
echo "📡 Test 5: Vérification des headers CORS..."
curl -s -I "https://api.wozif.com/api/cloudflare/upload" | grep -i "access-control\|cors"
echo ""

echo "🔍 Diagnostic terminé"
echo "💡 Si vous voyez toujours l'erreur 422, le serveur n'a pas été mis à jour"
echo "📋 Vérifiez que vous avez bien :"
echo "   1. Pullé le code depuis GitHub"
echo "   2. Mis à jour le fichier .env avec les nouvelles clés"
echo "   3. Redémarré le serveur PHP et Nginx"
