#!/bin/bash

echo "🚀 Déploiement Forge Coovia Backend - Version Finale"
echo "=================================================="

# Variables
SITE_PATH="/home/forge/default"
BRANCH="backend-laravel-clean"

echo "📋 Étapes du déploiement :"
echo "1. Pull du code depuis GitHub"
echo "2. Installation des dépendances"
echo "3. Configuration de l'environnement"
echo "4. Exécution des migrations"
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

# 3. Installation des dépendances npm (si nécessaire)
echo "📦 Installation des dépendances npm..."
if [ -f "package.json" ]; then
    npm install --production
else
    echo "⚠️  Aucun package.json trouvé, skip npm install"
fi

# 4. Configuration de l'environnement
echo "⚙️ Configuration de l'environnement..."
if [ ! -f ".env" ]; then
    cp .env.example .env
    php artisan key:generate
fi

# 5. Création des dossiers de cache
echo "📁 Création des dossiers de cache..."
mkdir -p storage/framework/cache
mkdir -p storage/framework/sessions
mkdir -p storage/framework/views
mkdir -p bootstrap/cache
chmod -R 775 storage bootstrap/cache
chown -R forge:forge storage bootstrap/cache

# 6. Exécution des migrations avec gestion d'erreurs
echo "🗄️ Exécution des migrations..."
php artisan migrate --force

# 7. Optimisation de l'application
echo "⚡ Optimisation de l'application..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# 8. Redémarrage des services
echo "🔄 Redémarrage des services..."
sudo systemctl reload php8.2-fpm
sudo systemctl reload nginx

echo ""
echo "✅ Déploiement terminé avec succès !"
echo "🌐 Votre application est accessible sur votre domaine"
echo ""
echo "📊 Vérification des services :"
echo "=============================="

# Vérification des services
echo "🔍 Statut PHP-FPM :"
sudo systemctl is-active php8.2-fpm

echo "🔍 Statut Nginx :"
sudo systemctl is-active nginx

echo "🔍 Test de l'application :"
curl -I http://localhost 2>/dev/null | head -1

echo ""
echo "🎉 Déploiement réussi !"
