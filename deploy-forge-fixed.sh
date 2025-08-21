#!/bin/bash

echo "🚀 Déploiement Forge pour Coovia Backend - Version Corrigée"
echo ""

# Variables
REPO_URL="https://github.com/nocodeci/coovia.git"
BRANCH="backend-laravel-clean"
SITE_PATH="/home/forge/default"

echo "📋 Étapes du déploiement :"
echo "1. Pull du code depuis GitHub"
echo "2. Installation des dépendances Composer"
echo "3. Configuration de l'environnement"
echo "4. Exécution des migrations (avec corrections)"
echo "5. Optimisation de l'application"
echo "6. Redémarrage des services"
echo ""

# 1. Pull du code
echo "🔄 Pull du code depuis GitHub..."
cd $SITE_PATH
git fetch origin
git reset --hard origin/$BRANCH

# 2. Installation des dépendances Composer
echo "📦 Installation des dépendances Composer..."
composer install --no-dev --optimize-autoloader

# 3. Configuration de l'environnement
echo "⚙️ Configuration de l'environnement..."
if [ ! -f ".env" ]; then
    cp .env.example .env
    php artisan key:generate
fi

# 4. Création des dossiers de cache si nécessaire
echo "📁 Création des dossiers de cache..."
mkdir -p storage/framework/cache
mkdir -p storage/framework/sessions
mkdir -p storage/framework/views
mkdir -p bootstrap/cache
chmod -R 775 storage bootstrap/cache

# 5. Exécution des migrations avec gestion d'erreurs
echo "🗄️ Exécution des migrations..."
php artisan migrate --force

# 6. Optimisation de l'application
echo "⚡ Optimisation de l'application..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# 7. Redémarrage des services
echo "🔄 Redémarrage des services..."
sudo systemctl reload php8.2-fpm
sudo systemctl reload nginx

echo ""
echo "✅ Déploiement terminé avec succès !"
echo "🌐 Votre application est accessible sur votre domaine"
echo ""
echo "📊 Statut des services :"
sudo systemctl status php8.2-fpm --no-pager -l
echo ""
sudo systemctl status nginx --no-pager -l
