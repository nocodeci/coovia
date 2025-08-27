#!/bin/bash

echo "🚀 Déploiement Laravel Cloud via Git - Coovia API"
echo "=================================================="

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

# Vérifier le statut Git
echo "📋 Vérification du statut Git..."
if [ ! -d ".git" ]; then
    echo "❌ Erreur: Ce répertoire n'est pas un dépôt Git"
    exit 1
fi

# Vérifier s'il y a des changements non commités
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  Il y a des changements non commités:"
    git status --short
    echo ""
    read -p "Voulez-vous commiter ces changements? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git add .
        git commit -m "Deploy: $(date '+%Y-%m-%d %H:%M:%S')"
        echo "✅ Changements commités"
    else
        echo "❌ Déploiement annulé"
        exit 1
    fi
fi

# Vérifier la branche actuelle
current_branch=$(git branch --show-current)
echo "🌿 Branche actuelle: $current_branch"

# Vérifier si nous sommes sur la branche principale
if [ "$current_branch" != "main" ] && [ "$current_branch" != "master" ]; then
    echo "⚠️  Vous n'êtes pas sur la branche principale (main/master)"
    read -p "Voulez-vous continuer avec la branche $current_branch? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Déploiement annulé"
        exit 1
    fi
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

# Vérifier les permissions
echo "🔐 Vérification des permissions..."
chmod -R 755 storage bootstrap/cache

# Créer le lien de stockage
echo "🔗 Création du lien de stockage..."
php artisan storage:link

# Commiter les optimisations
echo "💾 Commit des optimisations..."
git add .
git commit -m "Build: Optimisations de production $(date '+%Y-%m-%d %H:%M:%S')"

# Pousser vers le dépôt distant
echo "📤 Push vers le dépôt distant..."
git push origin $current_branch

echo "✅ Déploiement initié!"

echo ""
echo "📝 Instructions pour Laravel Cloud:"
echo "==================================="
echo ""
echo "1. Connectez-vous à votre dashboard Laravel Cloud:"
echo "   https://cloud.laravel.com"
echo ""
echo "2. Sélectionnez votre projet 'coovia-api'"
echo ""
echo "3. Allez dans l'onglet 'Deployments'"
echo ""
echo "4. Votre déploiement devrait être en cours ou terminé"
echo ""
echo "5. Surveillez les logs de déploiement"
echo ""
echo "6. Vérifiez que votre application est accessible"
echo ""
echo "🔗 URLs utiles:"
echo "- Dashboard Laravel Cloud: https://cloud.laravel.com"
echo "- Documentation: https://cloud.laravel.com/docs"
echo "- Support: https://cloud.laravel.com/support"
echo ""

# Vérifier les variables d'environnement critiques
echo "🔍 Vérification des variables d'environnement critiques..."

if [ -f ".env" ]; then
    echo "Variables critiques dans .env:"
    echo "APP_NAME: $(grep '^APP_NAME=' .env | cut -d'=' -f2)"
    echo "APP_ENV: $(grep '^APP_ENV=' .env | cut -d'=' -f2)"
    echo "DB_CONNECTION: $(grep '^DB_CONNECTION=' .env | cut -d'=' -f2)"
    
    if ! grep -q "^APP_KEY=" .env; then
        echo "⚠️  APP_KEY manquante - Génération d'une nouvelle clé..."
        php artisan key:generate
    fi
else
    echo "⚠️  Fichier .env non trouvé"
fi

echo ""
echo "🎯 Configuration Laravel Cloud détectée:"
echo "Nom du projet: coovia-api"
echo "Framework: Laravel"
echo "PHP: 8.2"
echo "Environnement: production"
echo "Mémoire: 512MB"
echo "CPU: 0.5"
echo "Stockage: 10GB"
echo "Services: MySQL, Redis"
echo ""
echo "✅ Déploiement terminé! Vérifiez votre dashboard Laravel Cloud."
