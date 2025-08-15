#!/bin/bash

# ---------------------------------
# Script de construction Laravel Cloud pour Monorepo
# Déploie le dossier "backend" depuis la racine du repository
# ---------------------------------

echo "🚀 Démarrage du déploiement Laravel Cloud pour monorepo..."

# Étape 1: Créer un répertoire temporaire
echo "📁 Création du répertoire temporaire..."
mkdir -p /tmp/monorepo_tmp

# Étape 2: Définir les sous-répertoires du monorepo
echo "📋 Identification des sous-répertoires..."
repos=("backend" "frontend" "boutique-client" "boutique-client-next" "mobile-app" "full-version" "wozif")

# Étape 3: Déplacer tous les sous-répertoires vers le répertoire temporaire
echo "🔄 Déplacement des sous-répertoires..."
for item in "${repos[@]}"; do
    if [ -d "$item" ]; then
        echo "  📦 Déplacement de $item..."
        mv "$item" /tmp/monorepo_tmp/
    else
        echo "  ⚠️  Répertoire $item non trouvé, ignoré"
    fi
done

# Étape 4: Déplacer le dossier backend (application Laravel) à la racine
echo "🎯 Déplacement de l'application Laravel (backend) à la racine..."
if [ -d "/tmp/monorepo_tmp/backend" ]; then
    cp -Rf /tmp/monorepo_tmp/backend/{.,}* . 2>/dev/null || true
    echo "  ✅ Application Laravel déplacée avec succès"
else
    echo "  ❌ Erreur: Le dossier backend n'a pas été trouvé"
    exit 1
fi

# Étape 5: Nettoyer le répertoire temporaire
echo "🧹 Nettoyage du répertoire temporaire..."
rm -rf /tmp/monorepo_tmp

# Étape 6: Vérifier la structure
echo "🔍 Vérification de la structure..."
if [ -f "artisan" ]; then
    echo "  ✅ Laravel Artisan trouvé - Structure correcte"
else
    echo "  ❌ Erreur: Laravel Artisan non trouvé"
    exit 1
fi

# Étape 7: Procéder avec les étapes de construction Laravel
echo "📦 Installation des dépendances Composer..."
composer install --no-dev --optimize-autoloader

echo "🔧 Optimisation de Laravel..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "📊 Vérification de la base de données..."
php artisan migrate --force

echo "🎉 Construction terminée avec succès!"
