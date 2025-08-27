#!/bin/bash

# Script de démarrage pour Backend Laravel

echo "🚀 Démarrage du Backend Laravel..."

# Attendre que la base de données soit prête
echo "⏳ Attente de la base de données..."
sleep 10

# Générer la clé d'application si elle n'existe pas
if [ ! -f .env ]; then
    echo "📝 Création du fichier .env..."
    cp .env.example .env
fi

# Générer la clé d'application
php artisan key:generate --force

# Exécuter les migrations
echo "🗄️ Exécution des migrations..."
php artisan migrate --force

# Optimiser Laravel pour la production
echo "⚡ Optimisation de Laravel..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Démarrer PHP-FPM
echo "🐘 Démarrage de PHP-FPM..."
php-fpm -D

# Démarrer Nginx
echo "🌐 Démarrage de Nginx..."
nginx -g "daemon off;"
