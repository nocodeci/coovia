#!/bin/bash

# 🚀 Script de Déploiement Laravel Cloud via Git
# Usage: ./deploy-laravel-cloud-git.sh

set -e

echo "🚀 Démarrage du déploiement Laravel Cloud via Git..."

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Vérifier que nous sommes dans le bon répertoire
if [ ! -d "backend" ]; then
    log_error "Le répertoire 'backend' n'existe pas. Exécutez ce script depuis la racine du projet."
    exit 1
fi

# Étape 1: Préparation du code
log_info "Étape 1: Préparation du code..."
cd backend

# Nettoyer les caches existants
log_info "Nettoyage des caches..."
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear

# Installer les dépendances de production
log_info "Installation des dépendances de production..."
composer install --optimize-autoloader --no-dev

# Cacher les configurations
log_info "Mise en cache des configurations..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Vérifier que la clé d'application existe
if [ ! -f ".env" ] || ! grep -q "APP_KEY=base64:" .env; then
    log_warning "Génération de la clé d'application..."
    php artisan key:generate
fi

cd ..

# Étape 2: Vérification Git
log_info "Étape 2: Vérification Git..."
if [ -n "$(git status --porcelain)" ]; then
    log_warning "Il y a des modifications non commitées. Voulez-vous les committer ? (y/n)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        git add .
        git commit -m "feat: prepare for Laravel Cloud deployment"
        log_success "Modifications commitées"
    else
        log_warning "Déploiement avec modifications non commitées"
    fi
fi

# Étape 3: Push vers GitHub
log_info "Étape 3: Push vers GitHub..."
git push origin cursor
log_success "Code poussé vers GitHub"

# Étape 4: Instructions pour Laravel Cloud
log_info "Étape 4: Instructions pour Laravel Cloud..."
echo ""
log_warning "Laravel Cloud CLI n'est pas installé. Voici les étapes manuelles :"
echo ""
echo "1. Allez sur https://cloud.laravel.com"
echo "2. Connectez-vous à votre compte"
echo "3. Créez un nouveau projet ou utilisez un projet existant"
echo "4. Connectez votre dépôt GitHub : https://github.com/nocodeci/coovia"
echo "5. Configurez le répertoire de déploiement : backend"
echo "6. Configurez les variables d'environnement :"
echo "   - APP_NAME=Coovia API"
echo "   - APP_ENV=production"
echo "   - APP_DEBUG=false"
echo "   - DB_CONNECTION=mysql"
echo "   - (et toutes vos autres variables)"
echo ""
echo "7. Déployez l'application"
echo "8. Exécutez les migrations : php artisan migrate --force"
echo "9. Configurez les permissions :"
echo "   chmod -R 755 storage bootstrap/cache"
echo "   chown -R www-data:www-data storage bootstrap/cache"
echo "10. Créez le lien symbolique : php artisan storage:link"
echo ""

log_success "🎉 Code préparé et poussé vers GitHub !"
log_info "Suivez les instructions ci-dessus pour finaliser le déploiement sur Laravel Cloud."
log_info "Votre code est maintenant prêt pour le déploiement."
