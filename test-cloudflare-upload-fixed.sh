#!/bin/bash

echo "🧪 Test d'Upload Cloudflare après Correction de Validation"
echo "========================================================="
echo ""

# Créer un fichier de test
echo "📝 Création du fichier de test..."
echo "Test content - $(date)" > test-upload.txt
echo "✅ Fichier créé: test-upload.txt"
echo ""

# Test 1: Vérifier que l'endpoint répond
echo "🔍 Test 1: Vérification de l'endpoint..."
response=$(curl -s -o /dev/null -w "%{http_code}" "https://api.wozif.com/api/cloudflare/upload")
if [ "$response" = "405" ]; then
    echo "✅ Endpoint accessible (405 = Method Not Allowed, ce qui est normal pour GET)"
else
    echo "❌ Endpoint inaccessible (HTTP $response)"
fi
echo ""

# Test 2: Test CORS preflight
echo "🔍 Test 2: Test CORS preflight..."
cors_response=$(curl -s -o /dev/null -w "%{http_code}" -X OPTIONS \
    -H "Origin: https://app.wozif.store" \
    -H "Access-Control-Request-Method: POST" \
    "https://api.wozif.com/api/cloudflare/upload")

if [ "$cors_response" = "204" ]; then
    echo "✅ CORS preflight fonctionne (HTTP 204)"
else
    echo "❌ CORS preflight échoue (HTTP $cors_response)"
fi
echo ""

# Test 3: Test d'upload avec UUID store_id
echo "🔍 Test 3: Test d'upload avec UUID store_id..."
upload_response=$(curl -s -X POST \
    -F "file=@test-upload.txt" \
    -F "type=document" \
    -F "store_id=9fbbeec1-6aab-4de3-a152-9cf8ae719f62" \
    -H "Origin: https://app.wozif.store" \
    "https://api.wozif.com/api/cloudflare/upload")

echo "📤 Réponse de l'upload:"
echo "$upload_response"
echo ""

# Test 4: Vérifier les médias du store
echo "🔍 Test 4: Vérification des médias du store..."
media_response=$(curl -s "https://api.wozif.com/api/public/stores/9fbbeec1-6aab-4de3-a152-9cf8ae719f62/media")

echo "📋 Réponse des médias:"
echo "$media_response"
echo ""

# Nettoyage
echo "🧹 Nettoyage..."
rm -f test-upload.txt
echo "✅ Fichier de test supprimé"
echo ""

echo "🎯 Résumé des Tests:"
echo "===================="
echo "1. Endpoint accessible: $([ "$response" = "405" ] && echo "✅" || echo "❌")"
echo "2. CORS fonctionne: $([ "$cors_response" = "204" ] && echo "✅" || echo "❌")"
echo "3. Upload testé: Voir réponse ci-dessus"
echo "4. Médias vérifiés: Voir réponse ci-dessus"
echo ""

echo "💡 Si l'upload échoue encore avec 422, vérifiez que le serveur Forge a été redémarré"
echo "💡 Commandes de redémarrage:"
echo "   sudo systemctl restart php8.2-fpm"
echo "   sudo systemctl restart nginx"
echo ""

echo "🔧 Correction appliquée:"
echo "   - store_id validation changée de 'integer' vers 'string'"
echo "   - Support des UUIDs maintenant activé"
echo ""
