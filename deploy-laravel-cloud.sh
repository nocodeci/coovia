#!/bin/bash

# 🚀 Script de Déploiement Laravel Cloud
# Usage: ./deploy-laravel-cloud.sh

set -e

echo "🚀 Démarrage du déploiement Laravel Cloud..."

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

# Vérifier que Laravel Cloud CLI est installé
if ! command -v laravel &> /dev/null; then
    log_error "Laravel Cloud CLI n'est pas installé. Installez-le avec: composer global require laravel/cloud"
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

# Étape 4: Déploiement Laravel Cloud
log_info "Étape 4: Déploiement Laravel Cloud..."

# Vérifier la connexion Laravel Cloud
if ! laravel cloud projects &> /dev/null; then
    log_error "Non connecté à Laravel Cloud. Connectez-vous avec: laravel cloud login"
    exit 1
fi

# Déployer l'application
log_info "Déploiement en cours..."
cd backend
laravel cloud deploy

# Étape 5: Post-déploiement
log_info "Étape 5: Configuration post-déploiement..."

# Exécuter les migrations
log_info "Exécution des migrations..."
laravel cloud ssh --command="php artisan migrate --force"

# Configurer les permissions
log_info "Configuration des permissions..."
laravel cloud ssh --command="chmod -R 755 storage bootstrap/cache"
laravel cloud ssh --command="chown -R www-data:www-data storage bootstrap/cache"

# Créer le lien symbolique storage
log_info "Création du lien symbolique storage..."
laravel cloud ssh --command="php artisan storage:link"

cd ..

# Étape 6: Vérification
log_info "Étape 6: Vérification du déploiement..."

# Récupérer l'URL de l'application
APP_URL=$(laravel cloud env | grep APP_URL | cut -d'=' -f2)
if [ -z "$APP_URL" ]; then
    log_warning "Impossible de récupérer l'URL de l'application"
else
    log_info "URL de l'application: $APP_URL"
    
    # Test de l'endpoint de santé
    log_info "Test de l'endpoint de santé..."
    if curl -s -f "$APP_URL/api/health" > /dev/null; then
        log_success "Endpoint de santé accessible"
    else
        log_warning "Endpoint de santé non accessible"
    fi
    
    # Test de l'endpoint public
    log_info "Test de l'endpoint public..."
    if curl -s -f "$APP_URL/api/boutique/boutique-test" > /dev/null; then
        log_success "Endpoint public accessible"
    else
        log_warning "Endpoint public non accessible"
    fi
fi

# Afficher les logs récents
log_info "Logs récents:"
laravel cloud logs --lines=10

log_success "🎉 Déploiement terminé avec succès !"
log_info "Vérifiez votre application à l'adresse: $APP_URL"
log_info "Pour voir les logs: laravel cloud logs"
log_info "Pour se connecter au serveur: laravel cloud ssh"
