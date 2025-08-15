#!/bin/bash

# ---------------------------------
# Script de diagnostic Laravel Cloud
# Vérifie et résout les problèmes courants
# ---------------------------------

echo "🔍 Diagnostic Laravel Cloud"
echo "============================"
echo ""

# Vérifier que nous sommes dans un environnement Laravel Cloud
if [ ! -f "/opt/cloud/.env" ]; then
    echo "⚠️  Ce script est conçu pour Laravel Cloud"
    echo "   Exécution en environnement local détectée"
fi

echo "📋 Vérification de la structure..."
echo ""

# Vérifier la structure Laravel
if [ -f "artisan" ]; then
    echo "✅ Laravel Artisan trouvé"
else
    echo "❌ Laravel Artisan manquant"
    echo "   Vérifiez que le script de construction a fonctionné"
    exit 1
fi

if [ -d "public" ]; then
    echo "✅ Dossier public trouvé"
else
    echo "❌ Dossier public manquant"
    exit 1
fi

if [ -f "public/index.php" ]; then
    echo "✅ public/index.php trouvé"
else
    echo "❌ public/index.php manquant"
    exit 1
fi

echo ""
echo "🔧 Vérification des permissions..."
echo ""

# Vérifier et corriger les permissions
echo "📁 Permissions des dossiers critiques..."
chmod -R 755 storage 2>/dev/null || echo "⚠️  Impossible de modifier storage"
chmod -R 755 bootstrap/cache 2>/dev/null || echo "⚠️  Impossible de modifier bootstrap/cache"
chmod 644 public/.htaccess 2>/dev/null || echo "⚠️  Impossible de modifier public/.htaccess"

echo ""
echo "🔗 Vérification des liens symboliques..."
echo ""

# Créer le lien de stockage
if [ ! -L "public/storage" ]; then
    echo "🔗 Création du lien de stockage..."
    php artisan storage:link 2>/dev/null || echo "⚠️  Impossible de créer le lien de stockage"
else
    echo "✅ Lien de stockage existant"
fi

echo ""
echo "📊 Vérification de la base de données..."
echo ""

# Tester la connexion à la base de données
if php artisan migrate:status > /dev/null 2>&1; then
    echo "✅ Connexion à la base de données OK"
else
    echo "❌ Problème de connexion à la base de données"
    echo "   Vérifiez les variables d'environnement DB_*"
fi

echo ""
echo "🔍 Vérification des variables d'environnement..."
echo ""

# Vérifier les variables critiques
if [ -n "$APP_KEY" ]; then
    echo "✅ APP_KEY configurée"
else
    echo "❌ APP_KEY manquante"
    echo "   Exécutez: php artisan key:generate"
fi

if [ -n "$APP_ENV" ]; then
    echo "✅ APP_ENV configurée: $APP_ENV"
else
    echo "⚠️  APP_ENV non configurée"
fi

if [ -n "$DB_CONNECTION" ]; then
    echo "✅ DB_CONNECTION configurée: $DB_CONNECTION"
else
    echo "❌ DB_CONNECTION manquante"
fi

echo ""
echo "🌐 Test de l'application..."
echo ""

# Tester si l'application répond
if command -v curl > /dev/null 2>&1; then
    echo "🧪 Test de l'application avec curl..."
    if curl -s -o /dev/null -w "%{http_code}" http://localhost/ | grep -q "200\|404"; then
        echo "✅ L'application répond"
    else
        echo "❌ L'application ne répond pas"
        echo "   Vérifiez les logs Apache/Nginx"
    fi
else
    echo "⚠️  curl non disponible pour le test"
fi

echo ""
echo "📝 Logs utiles..."
echo ""

# Afficher les logs récents
if [ -f "storage/logs/laravel.log" ]; then
    echo "📋 Dernières erreurs Laravel:"
    tail -n 5 storage/logs/laravel.log 2>/dev/null || echo "   Impossible de lire les logs"
else
    echo "⚠️  Fichier de log Laravel non trouvé"
fi

echo ""
echo "🔧 Solutions recommandées..."
echo ""

echo "Si vous avez des problèmes:"
echo "1. Vérifiez les variables d'environnement dans Laravel Cloud"
echo "2. Assurez-vous que APP_KEY est configurée"
echo "3. Vérifiez la connexion à la base de données"
echo "4. Consultez les logs dans l'interface Laravel Cloud"
echo "5. Redéployez si nécessaire"

echo ""
echo "🎯 Diagnostic terminé!"
