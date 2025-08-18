#!/bin/bash

# 🏪 Test des Sous-domaines Vercel - wozif.store
echo "🧪 Test des Sous-domaines Vercel - wozif.store"
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

# Test de résolution DNS
echo -e "\n${YELLOW}🔍 Test de résolution DNS${NC}"

# Test du domaine principal
if nslookup wozif.store > /dev/null 2>&1; then
    echo -e "${GREEN}✅ wozif.store résout correctement${NC}"
    nslookup wozif.store | grep "Address:"
else
    echo -e "${RED}❌ wozif.store ne résout pas${NC}"
fi

# Test des sous-domaines
if nslookup test-store.wozif.store > /dev/null 2>&1; then
    echo -e "${GREEN}✅ test-store.wozif.store résout correctement${NC}"
    nslookup test-store.wozif.store | grep "Address:"
else
    echo -e "${RED}❌ test-store.wozif.store ne résout pas${NC}"
fi

# Test de l'application
echo -e "\n${YELLOW}🔍 Test de l'application${NC}"

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

# Vérification de la configuration Vercel
echo -e "\n${YELLOW}🔍 Vérification de la configuration Vercel${NC}"

# Vérifier que le domaine est assigné au projet
if vercel domains ls | grep -q "wozif.store"; then
    echo -e "${GREEN}✅ Domaine wozif.store trouvé dans Vercel${NC}"
else
    echo -e "${RED}❌ Domaine wozif.store non trouvé dans Vercel${NC}"
    echo "Exécutez : vercel domains add wozif.store"
fi

# Vérification de la configuration Next.js
echo -e "\n${YELLOW}🔍 Vérification de la configuration Next.js${NC}"
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

# Informations sur le domaine Vercel
echo -e "\n${YELLOW}🔍 Informations du domaine Vercel${NC}"
echo -e "${BLUE}Domaine: wozif.store${NC}"
echo -e "${BLUE}Registrar: Vercel${NC}"
echo -e "${BLUE}Expiration: 12 août 2026${NC}"
echo -e "${BLUE}Nameservers: ns1.vercel-dns.com, ns2.vercel-dns.com${NC}"

# Instructions de déploiement
echo -e "\n${YELLOW}🔍 Instructions de déploiement${NC}"
echo "1. Déployer le projet :"
echo -e "${BLUE}   vercel --prod${NC}"
echo ""
echo "2. Assigner le domaine (si nécessaire) :"
echo -e "${BLUE}   vercel domains add wozif.store${NC}"
echo ""
echo "3. Vérifier l'assignation :"
echo -e "${BLUE}   vercel domains ls${NC}"

echo -e "\n${GREEN}✅ Tests terminés${NC}"
echo "================================================"
