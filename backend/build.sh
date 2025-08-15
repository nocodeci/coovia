#!/bin/bash

echo "🚀 Démarrage du build Railway pour Coovia Backend..."

# Afficher la version de PHP
echo "📋 Version PHP:"
php --version

# Installer les dépendances Composer
echo "📦 Installation des dépendances Composer..."
composer install --no-dev --optimize-autoloader --no-interaction

# Vérifier si APP_KEY existe, sinon la générer
if [ -z "$APP_KEY" ]; then
    echo "🔑 Génération de la clé d'application..."
    php artisan key:generate --force
else
    echo "✅ Clé d'application déjà configurée"
fi

# Vider tous les caches
echo "🧹 Nettoyage des caches..."
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

# Optimiser l'application pour la production
echo "⚡ Optimisation pour la production..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Créer les dossiers nécessaires avec les bonnes permissions
echo "📁 Configuration des permissions..."
mkdir -p storage/framework/cache
mkdir -p storage/framework/sessions
mkdir -p storage/framework/views
mkdir -p storage/logs
mkdir -p bootstrap/cache

# Définir les permissions appropriées
chmod -R 775 storage
chmod -R 775 bootstrap/cache

# Exécuter les migrations si la base de données est configurée
if [ ! -z "$DB_HOST" ]; then
    echo "🗄️ Exécution des migrations..."
    php artisan migrate --force
else
    echo "⚠️ Base de données non configurée, migrations ignorées"
fi

# Vérifier la configuration
echo "🔍 Vérification de la configuration..."
php artisan config:show app.name
php artisan config:show app.env

echo "✅ Build terminé avec succès!"
echo "🌐 Application prête pour le déploiement sur Railway"

