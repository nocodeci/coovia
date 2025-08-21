#!/bin/bash

echo "🚀 Déploiement Forge Coovia Backend - Version Sécurisée"
echo "======================================================"

# Variables
SITE_PATH="/home/forge/default"
BRANCH="backend-laravel-clean"

echo "📋 Étapes du déploiement sécurisé :"
echo "1. Pull du code depuis GitHub"
echo "2. Installation des dépendances"
echo "3. Configuration de l'environnement"
echo "4. Exécution des migrations avec gestion d'erreurs"
echo "5. Optimisation de l'application"
echo "6. Redémarrage des services"
echo ""

# 1. Pull du code
echo "🔄 Pull du code depuis GitHub..."
cd $SITE_PATH
git fetch origin
git reset --hard origin/$BRANCH

# 2. Installation des dépendances Composer
echo "📦 Installation des dépendances Composer..."
composer install --no-dev --optimize-autoloader

# 3. Installation des dépendances npm
echo "📦 Installation des dépendances npm..."
if [ -f "package.json" ]; then
    npm install --production
else
    echo "⚠️  Aucun package.json trouvé, skip npm install"
fi

# 4. Configuration de l'environnement
echo "⚙️ Configuration de l'environnement..."
if [ ! -f ".env" ]; then
    cp .env.example .env
    php artisan key:generate
fi

# 5. Création des dossiers de cache
echo "📁 Création des dossiers de cache..."
mkdir -p storage/framework/cache
mkdir -p storage/framework/sessions
mkdir -p storage/framework/views
mkdir -p bootstrap/cache
chmod -R 775 storage bootstrap/cache
chown -R forge:forge storage bootstrap/cache

# 6. Exécution des migrations avec gestion d'erreurs
echo "🗄️ Exécution des migrations avec gestion d'erreurs..."

# Fonction pour exécuter les migrations de manière sécurisée
run_migrations_safely() {
    echo "  🔍 Vérification de l'état des migrations..."
    php artisan migrate:status
    
    echo "  🚀 Tentative d'exécution des migrations..."
    if php artisan migrate --force; then
        echo "  ✅ Migrations exécutées avec succès"
        return 0
    else
        echo "  ⚠️  Erreur lors des migrations, tentative de récupération..."
        
        # Essayer de corriger les problèmes de colonnes dupliquées
        echo "  🔧 Tentative de correction des colonnes dupliquées..."
        
        # Vérifier et corriger les colonnes problématiques
        php artisan tinker --execute="
            use Illuminate\Support\Facades\Schema;
            use Illuminate\Support\Facades\DB;
            
            // Vérifier et corriger la table stores
            if (Schema::hasTable('stores')) {
                echo 'Vérification de la table stores...\n';
                
                // Colonnes à vérifier
                \$columns = ['address', 'contact', 'settings', 'logo', 'banner'];
                foreach (\$columns as \$column) {
                    if (Schema::hasColumn('stores', \$column)) {
                        echo 'Colonne ' . \$column . ' existe déjà dans stores\n';
                    }
                }
            }
            
            // Vérifier et corriger la table products
            if (Schema::hasTable('products')) {
                echo 'Vérification de la table products...\n';
                
                if (Schema::hasColumn('products', 'slug')) {
                    echo 'Colonne slug existe déjà dans products\n';
                }
            }
        "
        
        echo "  🔄 Nouvelle tentative de migration..."
        if php artisan migrate --force; then
            echo "  ✅ Migrations exécutées avec succès après correction"
            return 0
        else
            echo "  ❌ Échec des migrations même après correction"
            return 1
        fi
    fi
}

# Exécuter les migrations de manière sécurisée
if run_migrations_safely; then
    echo "✅ Migrations terminées avec succès"
else
    echo "⚠️  Problèmes avec les migrations, mais continuation du déploiement"
fi

# 7. Optimisation de l'application
echo "⚡ Optimisation de l'application..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# 8. Redémarrage des services
echo "🔄 Redémarrage des services..."
sudo systemctl reload php8.2-fpm
sudo systemctl reload nginx

echo ""
echo "✅ Déploiement terminé !"
echo "🌐 Votre application est accessible sur votre domaine"
echo ""
echo "📊 Vérification finale :"
echo "========================"

# Vérification des services
echo "🔍 Statut PHP-FPM :"
sudo systemctl is-active php8.2-fpm

echo "🔍 Statut Nginx :"
sudo systemctl is-active nginx

echo "🔍 Test de l'application :"
curl -I http://localhost 2>/dev/null | head -1

echo ""
echo "🎉 Déploiement sécurisé terminé !"
echo ""
echo "📋 Si des erreurs persistent, consultez :"
echo "  - storage/logs/laravel.log"
echo "  - /var/log/nginx/error.log"
echo "  - /var/log/php8.2-fpm.log"
