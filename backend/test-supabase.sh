#!/bin/bash

# Script de test pour la connexion Supabase
echo "🧪 Test de connexion Supabase..."

# Vérifier les variables d'environnement
echo "📋 Vérification des variables d'environnement..."

required_vars=(
    "DB_HOST"
    "DB_PORT"
    "DB_DATABASE"
    "DB_USERNAME"
    "DB_PASSWORD"
)

for var in "${required_vars[@]}"; do
    if [ -n "${!var}" ]; then
        echo "✅ $var est défini"
    else
        echo "❌ $var n'est pas défini"
        exit 1
    fi
done

# Tester la connexion PostgreSQL
echo "🗄️  Test de connexion à Supabase..."
if php artisan tinker --execute="try { DB::connection()->getPdo(); echo '✅ Connexion Supabase OK'; } catch(Exception \$e) { echo '❌ Erreur Supabase: ' . \$e->getMessage(); }"; then
    echo "✅ Connexion Supabase réussie"
else
    echo "❌ Erreur de connexion Supabase"
    exit 1
fi

# Tester les migrations
echo "🔄 Test des migrations..."
if php artisan migrate:status; then
    echo "✅ Migrations OK"
else
    echo "❌ Erreur des migrations"
fi

# Tester les endpoints
echo "🌐 Test des endpoints..."
if curl -s https://coovia-backend.onrender.com/api/health > /dev/null; then
    echo "✅ Endpoint /api/health accessible"
else
    echo "❌ Endpoint /api/health inaccessible"
fi

echo "✅ Tests Supabase terminés!"
