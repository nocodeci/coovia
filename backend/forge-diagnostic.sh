#!/bin/bash

# Script de diagnostic Forge
# Vérifie l'état de la configuration et identifie les problèmes

echo "🔍 Diagnostic Forge - Coovia Backend"
echo "===================================="

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
print_info() {
    echo -e "${BLUE}ℹ️ $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

SITE_NAME="api.wozif.com"
SERVER_NAME="twilight-rain"

echo ""
print_info "Vérification de la configuration Forge"
echo "==========================================="

# Vérifier l'authentification
print_info "1. Vérification de l'authentification..."
if forge server:list &> /dev/null; then
    print_success "Authentifié avec Forge"
else
    print_error "Non authentifié avec Forge"
    echo "   Exécutez: forge login"
    exit 1
fi

# Vérifier les serveurs
print_info "2. Vérification des serveurs..."
SERVERS=$(forge server:list 2>/dev/null | grep -c "Server" || echo "0")
if [ "$SERVERS" -gt 0 ]; then
    print_success "$SERVERS serveur(s) trouvé(s)"
    forge server:list 2>/dev/null | grep "$SERVER_NAME" && print_success "Serveur $SERVER_NAME trouvé"
else
    print_error "Aucun serveur trouvé"
fi

# Vérifier les sites
print_info "3. Vérification des sites..."
SITES=$(forge site:list 2>/dev/null | grep -c "Site" || echo "0")
if [ "$SITES" -gt 0 ]; then
    print_success "$SITES site(s) trouvé(s)"
    forge site:list 2>/dev/null | grep "$SITE_NAME" && print_success "Site $SITE_NAME trouvé"
else
    print_error "Aucun site trouvé"
fi

echo ""
print_warning "DIAGNOSTIC DE L'ERREUR GIT"
echo "================================"
echo ""
print_error "❌ Problème identifié: Repository Git non configuré"
echo ""
print_info "🔧 SOLUTION REQUISE:"
echo "======================"
echo ""
echo "1. 📋 Allez sur https://forge.laravel.com"
echo "2. 🔧 Sélectionnez le serveur: $SERVER_NAME"
echo "3. 🌐 Cliquez sur le site: $SITE_NAME"
echo "4. 📦 Allez dans 'Git Repository'"
echo "5. ⚙️ Configurez le repository:"
echo "   - Repository: https://github.com/votre-username/coovia.git"
echo "   - Branche: main"
echo "   - Répertoire: backend"
echo "6. ✅ Cliquez sur 'Install Repository'"
echo ""

print_info "📋 VÉRIFICATIONS À EFFECTUER:"
echo "================================"
echo "□ Repository GitHub existe et est accessible"
echo "□ Repository contient le dossier 'backend'"
echo "□ Repository est public ou accessible via SSH/token"
echo "□ URL du repository est correcte"
echo "□ Branche 'main' existe"
echo ""

print_warning "🚨 SOLUTIONS ALTERNATIVES:"
echo "=============================="
echo ""
echo "Si le repository est privé:"
echo "1. Rendez-le public temporairement"
echo "2. Ou configurez l'authentification SSH"
echo "3. Ou utilisez un token d'accès personnel"
echo ""
echo "Si le repository n'existe pas:"
echo "1. Créez-le sur GitHub"
echo "2. Poussez votre code"
echo "3. Configurez-le dans Forge"
echo ""

print_info "🔧 COMMANDES DE DIAGNOSTIC:"
echo "=============================="
echo "forge server:list                    # Lister les serveurs"
echo "forge site:list                      # Lister les sites"
echo "forge deploy:logs $SITE_NAME         # Voir les logs de déploiement"
echo "forge site:logs $SITE_NAME           # Voir les logs du site"
echo ""

print_success "📖 GUIDE COMPLET: FORGE_GIT_ERROR_FIX.md"
echo ""
print_info "Une fois le repository configuré, redéployez avec:"
echo "forge deploy $SITE_NAME"
