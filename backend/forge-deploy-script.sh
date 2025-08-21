#!/bin/bash

# Script de déploiement Forge pour Coovia
# Ce script sera exécuté automatiquement par Forge

echo "🚀 Déploiement Coovia en cours..."

# Variables
SITE_DIR="/home/forge/api.coovia.com"
PHP_VERSION="8.2"

# Couleurs pour l'affichage
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Fonction pour afficher les messages
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Aller dans le répertoire du site
cd "$SITE_DIR"

# 1. Installer les dépendances Composer
print_success "Installation des dépendances..."
composer install --no-interaction --prefer-dist --optimize-autoloader --no-dev

# 2. Copier le fichier .env si nécessaire
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env
        print_success "Fichier .env créé"
    fi
fi

# 3. Générer la clé d'application si nécessaire
if ! grep -q "APP_KEY=base64:" .env; then
    php artisan key:generate --force
    print_success "Clé d'application générée"
fi

# 4. Configurer les permissions
chmod -R 755 storage bootstrap/cache
chown -R forge:forge storage bootstrap/cache
print_success "Permissions configurées"

# 5. Exécuter les migrations
print_success "Exécution des migrations..."
php artisan migrate --force

# 6. Nettoyer et recréer les caches
print_success "Optimisation de l'application..."
php artisan config:clear
php artisan config:cache
php artisan route:clear
php artisan route:cache
php artisan view:clear
php artisan view:cache

# 7. Créer le lien symbolique pour le stockage
php artisan storage:link

# 8. Optimiser l'application
php artisan optimize

# 9. Vérifier la santé de l'application
print_success "Vérification de la santé..."
if php artisan migrate:status > /dev/null 2>&1; then
    print_success "Base de données connectée"
else
    print_warning "Problème de connexion à la base de données"
fi

print_success "🎉 Déploiement terminé avec succès!"
