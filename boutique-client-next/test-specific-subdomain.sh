#!/bin/bash

# 🧪 Test du Sous-domaine Spécifique - test.wozif.store
echo "🧪 Test du Sous-domaine Spécifique - test.wozif.store"
echo "====================================================="

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

# Test du sous-domaine test
if nslookup test.wozif.store > /dev/null 2>&1; then
    echo -e "${GREEN}✅ test.wozif.store résout correctement${NC}"
    echo "Adresses IP :"
    nslookup test.wozif.store | grep "Address:"
else
    echo -e "${RED}❌ test.wozif.store ne résout pas${NC}"
fi

# Test de la boutique cible
if nslookup test-store.wozif.store > /dev/null 2>&1; then
    echo -e "${GREEN}✅ test-store.wozif.store résout correctement${NC}"
else
    echo -e "${RED}❌ test-store.wozif.store ne résout pas${NC}"
fi

# Test de l'application
echo -e "\n${YELLOW}🔍 Test de l'application${NC}"

# Test du sous-domaine test
test_url "https://test.wozif.store" "Sous-domaine test"

# Test de la boutique cible
test_url "https://test-store.wozif.store" "Boutique test-store"

# Test de l'API backend
echo -e "\n${YELLOW}🔍 Test de l'API Backend${NC}"
echo "URL: http://localhost:8000/api/boutique/test-store"

if curl -s "http://localhost:8000/api/boutique/test-store" > /dev/null; then
    echo -e "${GREEN}✅ API Backend accessible${NC}"
    
    # Afficher les données de la boutique
    echo -e "\n${BLUE}📋 Données de la boutique test-store :${NC}"
    curl -s "http://localhost:8000/api/boutique/test-store" | jq '.' 2>/dev/null || curl -s "http://localhost:8000/api/boutique/test-store"
else
    echo -e "${RED}❌ API Backend inaccessible${NC}"
    echo "Assurez-vous que le serveur Laravel est démarré :"
    echo "cd ../backend && php artisan serve"
fi

# Test des produits de la boutique
echo -e "\n${YELLOW}🔍 Test des produits de la boutique${NC}"
echo "URL: http://localhost:8000/api/boutique/test-store/products"

if curl -s "http://localhost:8000/api/boutique/test-store/products" > /dev/null; then
    echo -e "${GREEN}✅ Produits de la boutique accessibles${NC}"
    
    # Compter les produits
    product_count=$(curl -s "http://localhost:8000/api/boutique/test-store/products" | jq 'length' 2>/dev/null || echo "0")
    echo -e "${BLUE}📦 Nombre de produits : $product_count${NC}"
else
    echo -e "${RED}❌ Produits de la boutique inaccessibles${NC}"
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

# Instructions de test local
echo -e "\n${YELLOW}🔍 Instructions de test local${NC}"
echo "Pour tester localement :"
echo "1. Ajouter au fichier /etc/hosts :"
echo -e "${BLUE}   127.0.0.1 test.wozif.store${NC}"
echo ""
echo "2. Démarrer le serveur de développement :"
echo -e "${BLUE}   npm run dev${NC}"
echo ""
echo "3. Tester l'URL :"
echo -e "${BLUE}   http://test.wozif.store:3000${NC}"
echo ""
echo "4. Vérifier la redirection vers la boutique test-store"

# Résumé
echo -e "\n${YELLOW}🔍 Résumé de la configuration${NC}"
echo -e "${BLUE}Sous-domaine de test : test.wozif.store${NC}"
echo -e "${BLUE}Boutique cible : test-store${NC}"
echo -e "${BLUE}URL d'accès : https://test.wozif.store${NC}"
echo -e "${BLUE}Redirection automatique vers : /test-store${NC}"

echo -e "\n${GREEN}✅ Tests terminés${NC}"
echo "====================================================="
