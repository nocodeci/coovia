#!/bin/bash

echo "🚀 Démarrage des applications Coovia..."

# Fonction pour démarrer le serveur Laravel
start_laravel() {
    echo "📦 Démarrage du serveur Laravel..."
    cd backend
    php artisan serve --host=0.0.0.0 --port=8000
}

# Fonction pour démarrer l'application React boutique-client
start_boutique_client() {
    echo "🛍️ Démarrage de l'application boutique-client..."
    cd boutique-client
    npm start
}

# Démarrer les deux applications en arrière-plan
start_laravel &
LARAVEL_PID=$!

# Attendre un peu que Laravel démarre
sleep 3

start_boutique_client &
BOUTIQUE_CLIENT_PID=$!

echo "✅ Applications démarrées !"
echo "📊 Laravel API: http://localhost:8000"
echo "🛍️ Boutique Client: http://localhost:3000"
echo ""
echo "🔗 Pour tester la redirection depuis le frontend:"
echo "   1. Allez sur http://localhost:5173"
echo "   2. Connectez-vous"
echo "   3. Cliquez sur 'Voir la boutique' dans le dashboard"
echo "   4. Cela ouvrira http://localhost:3000/store-123"
echo ""
echo "🛑 Pour arrêter: Ctrl+C"

# Attendre que les processus se terminent
wait $LARAVEL_PID $BOUTIQUE_CLIENT_PID 