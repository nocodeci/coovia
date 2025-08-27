#!/bin/bash

# Script de test pour vérifier la configuration avant déploiement
echo "🧪 Test de configuration pour Render..."

# Vérifier les fichiers requis
echo "📁 Vérification des fichiers..."
required_files=(
    "render.yaml"
    "Procfile"
    "deploy.sh"
    "apache.conf"
    "extensions.txt"
    "env.example"
    "public/.htaccess"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file existe"
    else
        echo "❌ $file manquant"
        exit 1
    fi
done

# Vérifier composer.json
echo "📦 Vérification de composer.json..."
if grep -q "ext-pdo_pgsql" composer.json; then
    echo "✅ Extension PostgreSQL configurée"
else
    echo "❌ Extension PostgreSQL manquante"
fi

# Vérifier les permissions
echo "🔐 Vérification des permissions..."
chmod +x deploy.sh
chmod +x test-deployment.sh

# Test de syntaxe PHP
echo "🔍 Test de syntaxe PHP..."
find app -name "*.php" -exec php -l {} \; | grep -v "No syntax errors"

# Vérifier les routes
echo "🛣️  Vérification des routes..."
php artisan route:list --compact

# Test de connexion à la base de données (si configurée)
if [ -n "$DB_HOST" ]; then
    echo "🗄️  Test de connexion à la base de données..."
    php artisan tinker --execute="try { DB::connection()->getPdo(); echo '✅ Connexion DB OK'; } catch(Exception \$e) { echo '❌ Erreur DB: ' . \$e->getMessage(); }"
else
    echo "⚠️  Variables DB non configurées"
fi

echo "✅ Tests terminés!"
