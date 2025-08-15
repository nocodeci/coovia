#!/bin/bash

# Script de préparation pour le déploiement Vapor
echo "🔧 Préparation du projet Coovia Backend pour Vapor..."

# Vérification des prérequis
echo "📋 Vérification des prérequis..."

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "artisan" ]; then
    echo "❌ Ce script doit être exécuté depuis le répertoire racine de Laravel."
    exit 1
fi

# Vérifier que Composer est installé
if ! command -v composer &> /dev/null; then
    echo "❌ Composer n'est pas installé."
    exit 1
fi

# Vérifier que PHP est installé
if ! command -v php &> /dev/null; then
    echo "❌ PHP n'est pas installé."
    exit 1
fi

echo "✅ Prérequis vérifiés."

# Nettoyage et optimisation
echo "🧹 Nettoyage et optimisation..."

# Installer les dépendances de production
echo "📦 Installation des dépendances de production..."
composer install --no-dev --optimize-autoloader

# Nettoyer le cache
echo "🗑️ Nettoyage du cache..."
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Optimiser pour la production
echo "⚡ Optimisation pour la production..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Vérifier la clé d'application
echo "🔐 Vérification de la clé d'application..."
if [ ! -f ".env" ]; then
    echo "📝 Copie du fichier .env.example..."
    cp .env.example .env
fi

# Générer la clé si elle n'existe pas
if ! grep -q "APP_KEY=base64:" .env; then
    echo "🔑 Génération de la clé d'application..."
    php artisan key:generate
fi

# Vérifier les permissions
echo "🔒 Vérification des permissions..."
chmod -R 755 storage bootstrap/cache
chmod -R 775 storage/logs storage/framework/cache storage/framework/sessions storage/framework/views

# Créer les répertoires nécessaires
echo "📁 Création des répertoires nécessaires..."
mkdir -p storage/framework/cache
mkdir -p storage/framework/sessions
mkdir -p storage/framework/views
mkdir -p storage/logs

# Vérifier la configuration Vapor
echo "📋 Vérification de la configuration Vapor..."
if [ ! -f "vapor.yml" ]; then
    echo "❌ Le fichier vapor.yml n'existe pas."
    echo "💡 Créez-le manuellement ou utilisez le fichier fourni."
else
    echo "✅ Fichier vapor.yml trouvé."
fi

# Vérifier .vaporignore
if [ ! -f ".vaporignore" ]; then
    echo "❌ Le fichier .vaporignore n'existe pas."
    echo "💡 Créez-le manuellement ou utilisez le fichier fourni."
else
    echo "✅ Fichier .vaporignore trouvé."
fi

# Test de l'application
echo "🧪 Test de l'application..."
if php artisan --version > /dev/null 2>&1; then
    echo "✅ Laravel fonctionne correctement."
else
    echo "❌ Problème avec Laravel."
    exit 1
fi

# Résumé
echo ""
echo "🎉 Préparation terminée !"
echo ""
echo "📋 Prochaines étapes :"
echo "1. Créez un projet sur https://vapor.laravel.com"
echo "2. Configurez vos variables d'environnement dans Vapor"
echo "3. Déployez avec : vapor deploy production"
echo ""
echo "📁 Fichiers créés/modifiés :"
echo "- vapor.yml (configuration Vapor)"
echo "- .vaporignore (fichiers à ignorer)"
echo "- deploy-vapor.sh (script de déploiement)"
echo ""
echo "🔗 Documentation : https://docs.vapor.build"
