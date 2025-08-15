#!/bin/bash

# ---------------------------------
# Script de déploiement Laravel Cloud - Monorepo
# Guide interactif pour déployer sur Laravel Cloud
# ---------------------------------

echo "🚀 Déploiement Laravel Cloud - Monorepo"
echo "========================================"
echo ""

# Vérifier que nous sommes à la racine du repository
if [ ! -f "laravel-cloud-build.sh" ]; then
    echo "❌ Erreur: Ce script doit être exécuté à la racine du repository"
    echo "   Assurez-vous d'être dans le dossier principal du projet"
    exit 1
fi

echo "✅ Configuration monorepo détectée"
echo ""

# Vérifier les fichiers nécessaires
echo "🔍 Vérification des fichiers nécessaires..."
required_files=("composer.json" "composer.lock" "laravel-cloud-build.sh" "backend/artisan")
missing_files=()

for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        missing_files+=("$file")
    fi
done

if [ ${#missing_files[@]} -gt 0 ]; then
    echo "❌ Fichiers manquants:"
    for file in "${missing_files[@]}"; do
        echo "   - $file"
    done
    echo ""
    echo "🔧 Exécutez d'abord: ./fix-composer-lock.sh"
    exit 1
fi

echo "✅ Tous les fichiers nécessaires sont présents"
echo ""

# Générer la clé d'application
echo "🔑 Génération de la clé d'application Laravel..."
cd backend
APP_KEY=$(php artisan key:generate --show 2>/dev/null)
cd ..

if [ -z "$APP_KEY" ]; then
    echo "⚠️  Impossible de générer la clé automatiquement"
    echo "   Vous devrez la générer manuellement dans Laravel Cloud"
else
    echo "✅ Clé d'application générée: $APP_KEY"
    echo "   Copiez cette clé dans la variable APP_KEY de Laravel Cloud"
fi

echo ""

# Instructions de déploiement
echo "📋 Instructions de déploiement:"
echo "================================"
echo ""
echo "1. 🌐 Connectez-vous à Laravel Cloud:"
echo "   https://cloud.laravel.com"
echo ""
echo "2. 🆕 Créez un nouveau projet:"
echo "   - Cliquez sur 'New Project'"
echo "   - Sélectionnez 'Git Repository'"
echo "   - Choisissez votre repository: coovia"
echo "   - Sélectionnez la branche: cursor"
echo ""
echo "3. ⚙️  Configurez l'environnement:"
echo "   - Nom du projet: coovia-backend"
echo "   - PHP Version: 8.3"
echo "   - Script de construction: ./laravel-cloud-build.sh"
echo ""
echo "4. 🔧 Variables d'environnement:"
echo "   Copiez les variables depuis le fichier:"
echo "   backend/production.env"
echo ""
echo "5. 🔑 Clé d'application:"
if [ -n "$APP_KEY" ]; then
    echo "   APP_KEY=$APP_KEY"
else
    echo "   Générez une clé avec: cd backend && php artisan key:generate --show"
fi
echo ""
echo "6. 🚀 Déployez:"
echo "   - Cliquez sur 'Deploy' dans Laravel Cloud"
echo "   - Surveillez les logs de construction"
echo ""
echo "7. ✅ Vérification:"
echo "   - L'application répond sur l'URL fournie"
echo "   - Les migrations ont été exécutées"
echo "   - Les caches sont optimisés"
echo ""

# Test optionnel
echo "🧪 Voulez-vous tester la configuration localement ? (y/n)"
read -r test_response

if [[ $test_response =~ ^[Yy]$ ]]; then
    echo ""
    echo "🧪 Exécution du test local..."
    ./test-laravel-cloud-build.sh
    echo ""
    echo "✅ Test terminé !"
fi

echo ""
echo "🎯 Prêt pour le déploiement !"
echo "📖 Consultez le guide complet: LARAVEL_CLOUD_MONOREPO_GUIDE.md"
