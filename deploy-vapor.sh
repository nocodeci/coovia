#!/bin/bash

# Script de déploiement Vapor pour Coovia Backend
echo "🚀 Déploiement de Coovia Backend sur Vapor..."

# Vérification des prérequis
echo "📋 Vérification des prérequis..."

# Vérifier que Vapor CLI est installé
if ! command -v vapor &> /dev/null; then
    echo "❌ Vapor CLI n'est pas installé. Installation..."
    composer global require laravel/vapor-cli
fi

# Vérifier la configuration AWS
echo "🔑 Vérification de la configuration AWS..."
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ Configuration AWS invalide. Veuillez configurer AWS CLI."
    exit 1
fi

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "artisan" ]; then
    echo "❌ Ce script doit être exécuté depuis le répertoire racine de Laravel."
    exit 1
fi

# Nettoyage et préparation
echo "🧹 Nettoyage et préparation..."
composer install --no-dev --optimize-autoloader
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Génération de la clé d'application si nécessaire
if [ -z "$(grep 'APP_KEY=base64:' .env 2>/dev/null)" ]; then
    echo "🔐 Génération de la clé d'application..."
    php artisan key:generate
fi

# Tentative de déploiement Vapor
echo "🚀 Tentative de déploiement Vapor..."
if vapor deploy production; then
    echo "✅ Déploiement réussi !"
    echo "🌐 Votre application est maintenant en ligne."
else
    echo "❌ Échec du déploiement Vapor."
    echo "💡 Suggestions de dépannage :"
    echo "   1. Vérifiez vos permissions AWS"
    echo "   2. Assurez-vous que votre compte Vapor est configuré"
    echo "   3. Vérifiez le fichier vapor.yml"
    echo "   4. Essayez de créer le projet via l'interface web de Vapor"
fi
