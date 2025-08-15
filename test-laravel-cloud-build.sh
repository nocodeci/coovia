#!/bin/bash

# ---------------------------------
# Script de test pour Laravel Cloud Monorepo
# Teste la configuration sans affecter le repository
# ---------------------------------

echo "🧪 Test de la configuration Laravel Cloud Monorepo..."

# Créer un répertoire de test
TEST_DIR="/tmp/laravel-cloud-test"
echo "📁 Création du répertoire de test: $TEST_DIR"
rm -rf "$TEST_DIR"
mkdir -p "$TEST_DIR"

# Copier les fichiers nécessaires
echo "📋 Copie des fichiers de test..."
cp composer.json "$TEST_DIR/"
cp composer.lock "$TEST_DIR/"
cp laravel-cloud-build.sh "$TEST_DIR/"

# Créer une structure de monorepo de test
echo "🏗️  Création de la structure de monorepo de test..."
mkdir -p "$TEST_DIR/backend"
mkdir -p "$TEST_DIR/frontend"
mkdir -p "$TEST_DIR/boutique-client"

# Copier le contenu du backend
echo "📦 Copie du contenu backend..."
cp -r backend/* "$TEST_DIR/backend/"

# Aller dans le répertoire de test
cd "$TEST_DIR"

# Rendre le script exécutable
chmod +x laravel-cloud-build.sh

# Exécuter le script de construction
echo "🚀 Exécution du script de construction..."
./laravel-cloud-build.sh

# Vérifier le résultat
echo "🔍 Vérification du résultat..."
if [ -f "artisan" ]; then
    echo "✅ SUCCÈS: Laravel Artisan trouvé"
    echo "✅ La configuration monorepo fonctionne correctement"
    
    # Vérifier la structure
    echo "📊 Structure finale:"
    ls -la | head -10
    
    # Vérifier les fichiers Laravel
    echo "🔧 Fichiers Laravel présents:"
    ls -la artisan composer.* .env* 2>/dev/null || echo "⚠️  Certains fichiers Laravel manquent (normal pour un test)"
    
else
    echo "❌ ÉCHEC: Laravel Artisan non trouvé"
    echo "❌ La configuration monorepo ne fonctionne pas"
fi

# Nettoyer
echo "🧹 Nettoyage..."
cd /tmp
rm -rf "$TEST_DIR"

echo "🎯 Test terminé!"
