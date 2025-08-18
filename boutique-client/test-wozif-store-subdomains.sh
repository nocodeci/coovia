#!/bin/bash

# 🏪 Test des Sous-domaines wozif.store
echo "🧪 Test des Sous-domaines wozif.store"
echo "======================================"

# Couleurs pour l'affichage
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction pour tester une URL
test_url() {
    local url=$1
    local description=$2
    
    echo -e "\n${YELLOW}🔍 Test: $description${NC}"
    echo "URL: $url"
    
    # Test avec curl
    response=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    
    if [ "$response" = "200" ]; then
        echo -e "${GREEN}✅ Status: $response - OK${NC}"
    else
        echo -e "${RED}❌ Status: $response - ERREUR${NC}"
    fi
}

# Test du domaine principal
test_url "https://wozif.store" "Domaine principal"

# Test des sous-domaines (si configurés)
test_url "https://test-store.wozif.store" "Sous-domaine test-store"

# Test de l'API backend
echo -e "\n${YELLOW}🔍 Test de l'API Backend${NC}"
echo "URL: http://localhost:8000/api/boutique/test-store"

if curl -s "http://localhost:8000/api/boutique/test-store" > /dev/null; then
    echo -e "${GREEN}✅ API Backend accessible${NC}"
else
    echo -e "${RED}❌ API Backend inaccessible${NC}"
    echo "Assurez-vous que le serveur Laravel est démarré :"
    echo "cd ../backend && php artisan serve"
fi

# Test de résolution DNS
echo -e "\n${YELLOW}🔍 Test de résolution DNS${NC}"
if nslookup wozif.store > /dev/null 2>&1; then
    echo -e "${GREEN}✅ wozif.store résout correctement${NC}"
else
    echo -e "${RED}❌ wozif.store ne résout pas${NC}"
fi

# Test de configuration locale
echo -e "\n${YELLOW}🔍 Configuration locale${NC}"
echo "Pour tester localement, ajoutez ces lignes à /etc/hosts :"
echo "127.0.0.1 test-store.wozif.store"
echo "127.0.0.1 ma-boutique.wozif.store"

echo -e "\n${GREEN}✅ Tests terminés${NC}"
echo "======================================"
