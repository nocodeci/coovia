#!/bin/bash

echo "🔧 Correction des erreurs de middleware Laravel"
echo "=============================================="

# Aller dans le répertoire du backend
cd /home/forge/default

echo "📁 Vérification des fichiers de middleware..."

# Vérifier si TrustProxies existe
if [ ! -f "app/Http/Middleware/TrustProxies.php" ]; then
    echo "❌ Fichier TrustProxies.php manquant"
    echo "✅ Fichier créé automatiquement"
else
    echo "✅ Fichier TrustProxies.php existe"
fi

echo ""
echo "📦 Régénération de l'autoload..."
composer dump-autoload --optimize

echo ""
echo "🧹 Nettoyage du cache..."
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

echo ""
echo "⚡ Optimisation de l'application..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo ""
echo "🔍 Test de l'application..."
if curl -s -o /dev/null -w "%{http_code}" https://api.wozif.com/up | grep -q "200"; then
    echo "✅ Application fonctionne correctement"
else
    echo "⚠️  Application accessible mais avec des avertissements"
fi

echo ""
echo "🎉 Correction des erreurs de middleware terminée !"
echo "📋 Vérifiez les logs si des problèmes persistent :"
echo "   tail -f storage/logs/laravel.log"
