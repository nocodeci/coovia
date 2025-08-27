#!/bin/bash

echo "🚀 Déploiement Laravel Cloud - Coovia API"
echo "=========================================="

# Vérifier si nous sommes dans le bon répertoire
if [ ! -f "artisan" ]; then
    echo "❌ Erreur: Ce script doit être exécuté depuis le répertoire racine du projet Laravel"
    exit 1
fi

# Vérifier si .laravel-cloud/project.yaml existe
if [ ! -f ".laravel-cloud/project.yaml" ]; then
    echo "❌ Erreur: Configuration Laravel Cloud non trouvée (.laravel-cloud/project.yaml)"
    exit 1
fi

echo "✅ Configuration Laravel Cloud trouvée"

# Vérifier les variables d'environnement
echo "📋 Vérification des variables d'environnement..."

# Vérifier si .env existe
if [ ! -f ".env" ]; then
    echo "❌ Erreur: Fichier .env non trouvé"
    exit 1
fi

# Vérifier les variables critiques
required_vars=("APP_KEY" "APP_NAME" "APP_ENV" "DB_CONNECTION" "DB_HOST" "DB_PORT" "DB_DATABASE" "DB_USERNAME" "DB_PASSWORD")
missing_vars=()

for var in "${required_vars[@]}"; do
    if ! grep -q "^${var}=" .env; then
        missing_vars+=("$var")
    fi
done

if [ ${#missing_vars[@]} -ne 0 ]; then
    echo "⚠️  Variables manquantes dans .env:"
    printf '%s\n' "${missing_vars[@]}"
    echo "Veuillez les configurer avant le déploiement"
fi

# Préparation du déploiement
echo "🔧 Préparation du déploiement..."

# Nettoyer le cache
echo "🧹 Nettoyage du cache..."
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

# Optimiser pour la production
echo "⚡ Optimisation pour la production..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Vérifier les migrations
echo "📊 Vérification des migrations..."
php artisan migrate:status

# Vérifier les permissions
echo "🔐 Vérification des permissions..."
chmod -R 755 storage bootstrap/cache

# Créer le lien de stockage
echo "🔗 Création du lien de stockage..."
php artisan storage:link

echo "✅ Préparation terminée!"

# Instructions pour le déploiement
echo ""
echo "📝 Instructions pour le déploiement Laravel Cloud:"
echo "=================================================="
echo ""
echo "1. Assurez-vous d'avoir un compte Laravel Cloud (https://cloud.laravel.com)"
echo "2. Installez Laravel Cloud CLI:"
echo "   - Visitez: https://cloud.laravel.com/docs/cli"
echo "   - Ou utilisez: curl -s \"https://laravel.build/cloud-cli\" | bash"
echo ""
echo "3. Authentifiez-vous:"
echo "   laravel-cloud login"
echo ""
echo "4. Déployez votre application:"
echo "   laravel-cloud deploy"
echo ""
echo "5. Ou déployez vers un environnement spécifique:"
echo "   laravel-cloud deploy production"
echo ""
echo "6. Surveillez les logs:"
echo "   laravel-cloud logs"
echo ""
echo "7. Vérifiez le statut:"
echo "   laravel-cloud status"
echo ""

# Vérifier si Laravel Cloud CLI est disponible
if command -v laravel-cloud &> /dev/null; then
    echo "✅ Laravel Cloud CLI est installé!"
    echo "Vous pouvez maintenant exécuter: laravel-cloud deploy"
else
    echo "❌ Laravel Cloud CLI n'est pas installé"
    echo "Veuillez l'installer depuis: https://cloud.laravel.com/docs/cli"
fi

echo ""
echo "🎯 Configuration actuelle détectée:"
echo "Nom du projet: coovia-api"
echo "Framework: Laravel"
echo "PHP: 8.2"
echo "Environnement: production"
echo "Mémoire: 512MB"
echo "CPU: 0.5"
echo "Stockage: 10GB"
echo "Services: MySQL, Redis"
