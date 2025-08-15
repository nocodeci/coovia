#!/bin/bash
set -e

echo "🚀 Démarrage de Laravel Octane avec FrankenPHP..."

# Créer les dossiers nécessaires
mkdir -p storage/framework/cache
mkdir -p storage/framework/sessions
mkdir -p storage/framework/views
mkdir -p bootstrap/cache

# Corriger les permissions
chmod -R 755 storage
chmod -R 755 bootstrap/cache

# Générer la clé d'application si elle n'existe pas
if [ -z "$APP_KEY" ]; then
    echo "⚠️  APP_KEY non définie, génération d'une clé temporaire..."
    php artisan key:generate --no-interaction
fi

# Nettoyer le cache
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Démarrer Laravel Octane avec FrankenPHP
echo "✅ Démarrage du serveur sur le port 9000..."
php artisan octane:start --server=frankenphp --host=0.0.0.0 --port=9000
