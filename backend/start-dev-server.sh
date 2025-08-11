#!/bin/bash

# Script pour démarrer le serveur de développement Laravel
# Port: 8001 (configuré dans le frontend)

echo "🚀 Démarrage du serveur de développement Laravel..."
echo "📍 Port: 8001"
echo "🌐 URL: http://localhost:8000"
echo "🔗 API: http://localhost:8000/api"
echo ""

# Vérifier si PHP est installé
if ! command -v php &> /dev/null; then
    echo "❌ PHP n'est pas installé ou n'est pas dans le PATH"
    exit 1
fi

# Vérifier si Composer est installé
if ! command -v composer &> /dev/null; then
    echo "❌ Composer n'est pas installé ou n'est pas dans le PATH"
    exit 1
fi

# Vérifier si les dépendances sont installées
if [ ! -d "vendor" ]; then
    echo "📦 Installation des dépendances Composer..."
    composer install
fi

# Vérifier si la clé d'application est générée
if [ ! -f ".env" ]; then
    echo "⚙️  Création du fichier .env..."
    cp env.example .env
    php artisan key:generate
fi

# Vérifier si la base de données est configurée
echo "🗄️  Vérification de la base de données..."
php artisan migrate:status > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "⚠️  La base de données n'est pas accessible. Vérifiez votre configuration."
    echo "   Vous pouvez continuer sans base de données pour tester l'API."
fi

# Démarrer le serveur
echo "🔥 Démarrage du serveur sur http://localhost:8001..."
echo "   Appuyez sur Ctrl+C pour arrêter le serveur"
echo ""

# Démarrer le serveur avec CORS activé
php artisan serve --host=0.0.0.0 --port=8001
