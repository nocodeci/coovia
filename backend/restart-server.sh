#!/bin/bash

# Script pour redémarrer le serveur backend avec la nouvelle configuration CORS

echo "🔄 Redémarrage du serveur backend avec la nouvelle configuration CORS..."
echo ""

# Arrêter tous les processus PHP sur le port 8000
echo "🛑 Arrêt des processus existants..."
pkill -f "php artisan serve" || true
sleep 2

# Vérifier si le fichier .env existe
if [ ! -f ".env" ]; then
    echo "⚙️  Création du fichier .env..."
    cp env.example .env
    php artisan key:generate
fi

# Vider le cache de configuration
echo "🧹 Nettoyage du cache..."
php artisan config:clear
php artisan cache:clear
php artisan route:clear

# Redémarrer le serveur
echo "🚀 Redémarrage du serveur sur http://localhost:8000..."
echo "   Appuyez sur Ctrl+C pour arrêter le serveur"
echo ""

# Démarrer le serveur avec la nouvelle configuration
php artisan serve --host=0.0.0.0 --port=8000
