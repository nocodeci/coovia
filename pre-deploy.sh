#!/bin/bash

# Script de pré-déploiement pour Render
echo "🚀 Démarrage du pré-déploiement..."

# Vérifier que nous sommes en production
if [ "$APP_ENV" != "production" ]; then
    echo "⚠️  Environnement non-production détecté"
fi

# Générer la clé d'application si elle n'existe pas
if [ -z "$APP_KEY" ]; then
    echo "🔑 Génération de la clé d'application..."
    php artisan key:generate
fi

# Nettoyer le cache
echo "🧹 Nettoyage du cache..."
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear

# Optimiser l'application
echo "⚡ Optimisation de l'application..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Tester la connexion Supabase
echo "🗄️  Test de connexion Supabase..."
if php artisan tinker --execute="try { DB::connection()->getPdo(); echo '✅ Connexion Supabase OK'; } catch(Exception \$e) { echo '❌ Erreur Supabase: ' . \$e->getMessage(); }"; then
    echo "✅ Connexion Supabase réussie"
else
    echo "⚠️  Erreur de connexion Supabase - vérifier les variables d'environnement"
fi

# Exécuter les migrations
echo "🗄️  Exécution des migrations..."
php artisan migrate --force

# Créer les dossiers nécessaires
echo "📁 Création des dossiers..."
mkdir -p storage/framework/cache
mkdir -p storage/framework/sessions
mkdir -p storage/framework/views
mkdir -p storage/logs
mkdir -p bootstrap/cache

# Définir les permissions
echo "🔐 Configuration des permissions..."
chmod -R 775 storage
chmod -R 775 bootstrap/cache

echo "✅ Pré-déploiement terminé!"
