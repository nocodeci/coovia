#!/bin/bash

# 🏪 Test des Sous-domaines wozif.store - Next.js
echo "🧪 Test des Sous-domaines wozif.store - Next.js"
echo "================================================"

# Couleurs pour l'affichage
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

# Test des sous-domaines
test_url "https://test-store.wozif.store" "Sous-domaine test-store"

# Test de l'API backend
echo -e "\n${YELLOW}🔍 Test de l'API Backend${NC}"
echo "URL: https://api.wozif.store/api/boutique/test-store"

if curl -s "https://api.wozif.store/api/boutique/test-store" > /dev/null; then
    echo -e "${GREEN}✅ API Backend accessible${NC}"
else
    echo -e "${RED}❌ API Backend inaccessible${NC}"
    echo "Vérifiez que l'API est déployée et accessible"
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
echo "Pour tester localement :"
echo "1. Ajoutez ces lignes à /etc/hosts :"
echo -e "${BLUE}   127.0.0.1 test-store.wozif.store${NC}"
echo -e "${BLUE}   127.0.0.1 ma-boutique.wozif.store${NC}"
echo ""
echo "2. Démarrez le serveur de développement :"
echo -e "${BLUE}   npm run dev${NC}"
echo ""
echo "3. Testez les URLs :"
echo -e "${BLUE}   http://test-store.wozif.store:3000${NC}"
echo -e "${BLUE}   http://ma-boutique.wozif.store:3000${NC}"

# Vérification de la configuration Next.js
echo -e "\n${YELLOW}🔍 Vérification de la configuration${NC}"
if [ -f "next.config.mjs" ]; then
    echo -e "${GREEN}✅ next.config.mjs trouvé${NC}"
else
    echo -e "${RED}❌ next.config.mjs manquant${NC}"
fi

if [ -f "src/middleware.ts" ]; then
    echo -e "${GREEN}✅ middleware.ts trouvé${NC}"
else
    echo -e "${RED}❌ middleware.ts manquant${NC}"
fi

if [ -d "src/app/[storeId]" ]; then
    echo -e "${GREEN}✅ Dossier [storeId] trouvé${NC}"
else
    echo -e "${RED}❌ Dossier [storeId] manquant${NC}"
fi

# Test de build
echo -e "\n${YELLOW}🔍 Test de build${NC}"
if npm run build > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Build réussi${NC}"
else
    echo -e "${RED}❌ Erreur de build${NC}"
    echo "Exécutez 'npm run build' pour voir les erreurs"
fi

echo -e "\n${GREEN}✅ Tests terminés${NC}"
echo "================================================"
