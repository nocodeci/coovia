#!/bin/bash

# Script de test pour vérifier la configuration CORS et Sanctum

echo "🧪 Test de la configuration CORS et Sanctum"
echo "=========================================="
echo ""

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction pour afficher les résultats
print_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
    fi
}

# Test 1: Vérifier que le serveur répond
echo "1. Test de connectivité du serveur..."
curl -s http://localhost:8000/api/health > /dev/null
print_result $? "Serveur Laravel accessible"

# Test 2: Test CORS preflight
echo ""
echo "2. Test CORS preflight..."
CORS_RESPONSE=$(curl -s -X OPTIONS \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type,Authorization" \
  -w "%{http_code}" \
  http://localhost:8000/api/auth/login)

if [[ $CORS_RESPONSE == *"200"* ]]; then
    print_result 0 "CORS preflight réussi"
else
    print_result 1 "CORS preflight échoué (Code: $CORS_RESPONSE)"
fi

# Test 3: Vérifier les en-têtes CORS
echo ""
echo "3. Vérification des en-têtes CORS..."
CORS_HEADERS=$(curl -s -I -X OPTIONS \
  -H "Origin: http://localhost:5173" \
  http://localhost:8000/api/auth/login)

if echo "$CORS_HEADERS" | grep -q "Access-Control-Allow-Origin"; then
    print_result 0 "En-tête Access-Control-Allow-Origin présent"
else
    print_result 1 "En-tête Access-Control-Allow-Origin manquant"
fi

if echo "$CORS_HEADERS" | grep -q "Access-Control-Allow-Credentials: true"; then
    print_result 0 "En-tête Access-Control-Allow-Credentials correct"
else
    print_result 1 "En-tête Access-Control-Allow-Credentials incorrect ou manquant"
fi

# Test 4: Test de la route Sanctum CSRF
echo ""
echo "4. Test de la route Sanctum CSRF..."
CSRF_RESPONSE=$(curl -s -w "%{http_code}" http://localhost:8000/sanctum/csrf-cookie)
if [[ $CSRF_RESPONSE == *"204"* ]] || [[ $CSRF_RESPONSE == *"200"* ]]; then
    print_result 0 "Route Sanctum CSRF accessible"
else
    print_result 1 "Route Sanctum CSRF inaccessible (Code: $CSRF_RESPONSE)"
fi

# Test 5: Vérifier la configuration
echo ""
echo "5. Vérification de la configuration..."
if grep -q "supports_credentials.*true" config/cors.php; then
    print_result 0 "supports_credentials = true dans config/cors.php"
else
    print_result 1 "supports_credentials n'est pas true dans config/cors.php"
fi

if grep -q "localhost:5173" config/cors.php; then
    print_result 0 "localhost:5173 autorisé dans config/cors.php"
else
    print_result 1 "localhost:5173 non autorisé dans config/cors.php"
fi

# Test 6: Vérifier les variables d'environnement
echo ""
echo "6. Vérification des variables d'environnement..."
if [ -f ".env" ]; then
    print_result 0 "Fichier .env existe"
    
    if grep -q "SANCTUM_STATEFUL_DOMAINS" .env; then
        print_result 0 "SANCTUM_STATEFUL_DOMAINS configuré"
    else
        print_result 1 "SANCTUM_STATEFUL_DOMAINS non configuré"
    fi
else
    print_result 1 "Fichier .env manquant"
fi

echo ""
echo "🎯 Résumé des tests :"
echo "===================="
echo ""
echo "Si tous les tests sont verts (✅), votre configuration CORS et Sanctum"
echo "est correcte et prête à être utilisée avec le frontend."
echo ""
echo "Si certains tests sont rouges (❌), consultez le guide de dépannage :"
echo "📖 frontend/SANCTUM_CORS_FIX.md"
echo ""
echo "🚀 Pour redémarrer le serveur avec la nouvelle configuration :"
echo "   ./restart-server.sh"
