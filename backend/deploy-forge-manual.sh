#!/bin/bash

# Script de déploiement manuel pour Forge
# Ce script vous guide à travers la configuration et le déploiement

echo "🚀 Déploiement manuel Forge - Coovia Backend"
echo "============================================="

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

# Variables configurables
SITE_NAME="api.wozif.com"
SERVER_NAME="twilight-rain"
GIT_REPO="https://github.com/votre-username/coovia.git"
GIT_BRANCH="main"
PROJECT_DIR="backend"

echo ""
print_info "Configuration du déploiement Forge"
echo "========================================"
echo "🌐 Site: $SITE_NAME"
echo "🔧 Serveur: $SERVER_NAME"
echo "📦 Repository: $GIT_REPO"
echo "🌿 Branche: $GIT_BRANCH"
echo "📁 Répertoire: $PROJECT_DIR"
echo ""

print_warning "ÉTAPES MANUELLES REQUISES:"
echo "================================"
echo ""
echo "1. 📋 CONFIGURATION DU REPOSITORY GIT"
echo "   ================================="
echo "   - Allez sur https://forge.laravel.com"
echo "   - Connectez-vous à votre compte"
echo "   - Sélectionnez le serveur: $SERVER_NAME"
echo "   - Cliquez sur le site: $SITE_NAME"
echo "   - Allez dans 'Git Repository'"
echo "   - Configurez:"
echo "     * Repository: $GIT_REPO"
echo "     * Branche: $GIT_BRANCH"
echo "     * Répertoire: $PROJECT_DIR"
echo "   - Cliquez sur 'Install Repository'"
echo ""

echo "2. ⚙️ CONFIGURATION DE L'ENVIRONNEMENT"
echo "   =================================="
echo "   - Dans votre site, allez dans 'Environment'"
echo "   - Copiez le contenu du fichier forge.env"
echo "   - Adaptez les variables selon votre configuration:"
echo "     * DB_PASSWORD: [Votre mot de passe Supabase]"
echo "     * FRONTEND_URL: [URL de votre frontend]"
echo "     * PAYDUNYA_*: [Vos clés de paiement]"
echo "     * MONEROO_*: [Vos clés de paiement]"
echo "   - Sauvegardez"
echo ""

echo "3. 🔧 CONFIGURATION DU SCRIPT DE DÉPLOIEMENT"
echo "   ========================================"
echo "   - Dans votre site, allez dans 'Deployment Script'"
echo "   - Copiez le contenu du fichier forge-deploy-script.sh"
echo "   - Sauvegardez"
echo ""

echo "4. 🌐 CONFIGURATION NGINX (optionnel)"
echo "   =================================="
echo "   - Dans votre site, allez dans 'Files' > 'Edit Nginx Configuration'"
echo "   - Copiez le contenu du fichier nginx-forge-simple.conf"
echo "   - Sauvegardez"
echo ""

echo "5. 🔒 CONFIGURATION SSL"
echo "   ==================="
echo "   - Dans votre site, cliquez sur 'SSL'"
echo "   - Cliquez sur 'LetsEncrypt'"
echo "   - Domaine: $SITE_NAME"
echo "   - Cliquez sur 'Obtain Certificate'"
echo ""

echo "6. ⚡ CONFIGURATION DES DAEMONS"
echo "   ==========================="
echo "   - Dans votre site, allez dans 'Daemons'"
echo "   - Ajoutez un daemon pour les queues:"
echo "     * Command: php /home/forge/$SITE_NAME/artisan queue:work --sleep=3 --tries=3 --max-time=3600"
echo "     * User: forge"
echo "   - Ajoutez un daemon pour les tâches planifiées:"
echo "     * Command: php /home/forge/$SITE_NAME/artisan schedule:run"
echo "     * User: forge"
echo ""

echo "7. 🚀 DÉPLOIEMENT"
echo "   =============="
echo "   - Dans votre site, cliquez sur 'Deploy Now'"
echo "   - Attendez que le déploiement se termine"
echo "   - Vérifiez les logs de déploiement"
echo ""

print_info "FICHIERS DE CONFIGURATION DISPONIBLES:"
echo "=========================================="
echo "📄 forge.env - Variables d'environnement"
echo "📄 forge-deploy-script.sh - Script de déploiement"
echo "📄 nginx-forge-simple.conf - Configuration Nginx"
echo ""

print_info "COMMANDES UTILES APRÈS DÉPLOIEMENT:"
echo "========================================"
echo "forge site:logs $SITE_NAME         # Voir les logs du site"
echo "forge deploy:logs $SITE_NAME       # Voir les logs de déploiement"
echo "forge ssh                          # Se connecter en SSH"
echo ""

print_warning "AVERTISSEMENTS IMPORTANTS:"
echo "================================="
echo "⚠️ Assurez-vous que votre repository Git est public ou accessible"
echo "⚠️ Vérifiez que toutes les variables d'environnement sont correctes"
echo "⚠️ Testez l'application après le déploiement"
echo "⚠️ Configurez les sauvegardes automatiques"
echo ""

print_success "Une fois ces étapes terminées, votre backend sera déployé sur Forge !"
echo ""
print_info "URL finale: https://$SITE_NAME"
echo ""
print_info "Besoin d'aide ? Consultez la documentation dans FORGE_DEPLOYMENT_GUIDE.md"
