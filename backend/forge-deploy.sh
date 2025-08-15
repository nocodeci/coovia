#!/bin/bash

# Script de déploiement personnalisé pour Laravel Forge
# Ce script sera exécuté automatiquement par Forge lors de chaque déploiement

echo "🚀 Début du déploiement..."

# Variables
SITE_DIR="/home/forge/api.coovia.com"
PHP_VERSION="8.2"

# Aller dans le répertoire du site
cd $SITE_DIR

echo "📁 Répertoire de travail: $(pwd)"

# Mettre à jour le code depuis Git
echo "📥 Mise à jour du code depuis Git..."
git pull origin main

# Installer les dépendances Composer
echo "📦 Installation des dépendances Composer..."
composer install --no-interaction --prefer-dist --optimize-autoloader --no-dev

# Nettoyer le cache Composer
echo "🧹 Nettoyage du cache Composer..."
composer dump-autoload --optimize

# Vérifier que le fichier .env existe
if [ ! -f ".env" ]; then
    echo "❌ Fichier .env manquant!"
    exit 1
fi

# Générer la clé d'application si elle n'existe pas
if ! grep -q "APP_KEY=base64:" .env; then
    echo "🔑 Génération de la clé d'application..."
    php artisan key:generate --force
fi

# Exécuter les migrations
echo "🗄️ Exécution des migrations..."
php artisan migrate --force

# Nettoyer et recréer les caches
echo "💾 Optimisation des caches..."
php artisan config:clear
php artisan config:cache
php artisan route:clear
php artisan route:cache
php artisan view:clear
php artisan view:cache

# Créer le lien symbolique pour le stockage
echo "🔗 Création du lien symbolique de stockage..."
php artisan storage:link

# Nettoyer les anciens fichiers
echo "🧹 Nettoyage des anciens fichiers..."
php artisan cache:clear
php artisan queue:clear

# Optimiser l'application
echo "⚡ Optimisation de l'application..."
php artisan optimize

# Vérifier les permissions
echo "🔐 Vérification des permissions..."
chmod -R 755 storage bootstrap/cache
chown -R forge:forge storage bootstrap/cache

# Vérifier la configuration de la base de données
echo "🔍 Vérification de la configuration de la base de données..."
php artisan migrate:status

# Vérifier la configuration CORS
echo "🌐 Vérification de la configuration CORS..."
if [ -f "config/cors.php" ]; then
    echo "✅ Configuration CORS trouvée"
else
    echo "⚠️ Configuration CORS manquante"
fi

# Vérifier la configuration Cloudflare R2
echo "☁️ Vérification de la configuration Cloudflare R2..."
if grep -q "CLOUDFLARE_R2" .env; then
    echo "✅ Configuration Cloudflare R2 trouvée"
else
    echo "⚠️ Configuration Cloudflare R2 manquante"
fi

# Vérifier les services de paiement
echo "💳 Vérification des services de paiement..."
if grep -q "PAYDUNYA\|MONEROO" .env; then
    echo "✅ Configuration des services de paiement trouvée"
else
    echo "⚠️ Configuration des services de paiement manquante"
fi

# Redémarrer les services si nécessaire
echo "🔄 Redémarrage des services..."
sudo systemctl reload php$PHP_VERSION-fpm
sudo systemctl reload nginx

# Vérifier que l'application fonctionne
echo "✅ Test de l'application..."
if curl -s -o /dev/null -w "%{http_code}" https://api.coovia.com/api/health | grep -q "200"; then
    echo "✅ Application accessible"
else
    echo "⚠️ Application non accessible - vérifiez les logs"
fi

echo "🎉 Déploiement terminé avec succès!"
echo "📊 Informations système:"
echo "   - Mémoire utilisée: $(free -h | grep Mem | awk '{print $3"/"$2}')"
echo "   - Espace disque: $(df -h . | tail -1 | awk '{print $5}') utilisé"
echo "   - PHP version: $(php -v | head -1)"

# Log du déploiement
echo "$(date): Déploiement terminé avec succès" >> storage/logs/deploy.log
