#!/bin/bash

echo "🔧 Correction du déploiement Laravel Cloud - Problème composer.lock"
echo "=================================================================="

# Vérifier si nous sommes dans le bon répertoire
if [ ! -f "artisan" ]; then
    echo "❌ Erreur: Ce script doit être exécuté depuis le répertoire backend"
    exit 1
fi

echo "✅ Répertoire backend détecté"

# Vérifier l'existence de composer.lock
if [ ! -f "composer.lock" ]; then
    echo "❌ Erreur: composer.lock non trouvé"
    exit 1
fi

echo "✅ composer.lock trouvé"

# Vérifier l'existence de composer.json
if [ ! -f "composer.json" ]; then
    echo "❌ Erreur: composer.json non trouvé"
    exit 1
fi

echo "✅ composer.json trouvé"

# Vérifier la taille de composer.lock
lock_size=$(stat -f%z composer.lock 2>/dev/null || stat -c%s composer.lock 2>/dev/null)
echo "📊 Taille de composer.lock: $lock_size bytes"

if [ "$lock_size" -lt 1000 ]; then
    echo "⚠️  Attention: composer.lock semble trop petit"
fi

# Vérifier le contenu de composer.lock
echo "🔍 Vérification du contenu de composer.lock..."
if head -5 composer.lock | grep -q "lockfile-version"; then
    echo "✅ Format de composer.lock valide"
else
    echo "❌ Format de composer.lock invalide"
fi

# Vérifier les dépendances
echo "📦 Vérification des dépendances..."
if [ -d "vendor" ]; then
    echo "✅ Répertoire vendor trouvé"
else
    echo "⚠️  Répertoire vendor manquant - Installation des dépendances..."
    composer install --no-dev --optimize-autoloader
fi

# Vérifier la configuration Laravel Cloud
echo "☁️  Vérification de la configuration Laravel Cloud..."
if [ -f ".laravel-cloud/project.yaml" ]; then
    echo "✅ Configuration Laravel Cloud trouvée"
    
    # Vérifier le répertoire de travail
    echo "📁 Répertoire de travail: $(pwd)"
    echo "📁 Contenu du répertoire:"
    ls -la | head -10
else
    echo "❌ Configuration Laravel Cloud manquante"
    exit 1
fi

# Nettoyer et optimiser
echo "🧹 Nettoyage et optimisation..."
composer dump-autoload --optimize
php artisan config:clear
php artisan cache:clear

# Vérifier les permissions
echo "🔐 Vérification des permissions..."
chmod -R 755 storage bootstrap/cache

# Créer un fichier de test pour Laravel Cloud
echo "📝 Création d'un fichier de test..."
cat > .laravel-cloud-test << EOF
# Test Laravel Cloud
# Date: $(date)
# Répertoire: $(pwd)
# Composer.lock existe: $(test -f composer.lock && echo "OUI" || echo "NON")
# Composer.json existe: $(test -f composer.json && echo "OUI" || echo "NON")
# Taille composer.lock: $lock_size bytes
EOF

echo "✅ Fichier de test créé: .laravel-cloud-test"

# Vérifier le statut Git
echo "📋 Vérification du statut Git..."
if [ -d ".git" ]; then
    echo "✅ Répertoire Git trouvé"
    git status --porcelain
else
    echo "⚠️  Pas de répertoire Git dans backend"
    echo "Vérification depuis le répertoire parent..."
    cd ..
    if [ -d ".git" ]; then
        echo "✅ Répertoire Git trouvé dans le parent"
        git status --porcelain backend/composer.lock
    else
        echo "❌ Aucun répertoire Git trouvé"
    fi
    cd backend
fi

echo ""
echo "🔧 Solutions possibles:"
echo "======================"
echo ""
echo "1. Vérifiez que le répertoire de travail de Laravel Cloud est correct"
echo "2. Assurez-vous que composer.lock est dans le répertoire racine du projet"
echo "3. Vérifiez les permissions du fichier composer.lock"
echo "4. Essayez de régénérer composer.lock:"
echo "   composer update --lock"
echo ""
echo "5. Vérifiez la configuration dans Laravel Cloud Dashboard"
echo "6. Assurez-vous que le répertoire de déploiement est correct"
echo ""

echo "📊 Informations de diagnostic:"
echo "=============================="
echo "Répertoire actuel: $(pwd)"
echo "Composer.lock: $(test -f composer.lock && echo "EXISTE" || echo "MANQUANT")"
echo "Composer.json: $(test -f composer.json && echo "EXISTE" || echo "MANQUANT")"
echo "Taille composer.lock: $lock_size bytes"
echo "Permissions composer.lock: $(ls -la composer.lock | awk '{print $1}')"
echo ""

echo "✅ Diagnostic terminé. Vérifiez les informations ci-dessus."
