#!/bin/bash

echo "🚀 Démarrage du serveur boutique-client-next..."

# Aller dans le dossier boutique-client-next
cd boutique-client-next

# Vérifier si node_modules existe
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm install
fi

# Copier la configuration d'environnement si elle n'existe pas
if [ ! -f ".env.local" ]; then
    echo "⚙️ Configuration de l'environnement..."
    cp env.development .env.local
    echo "✅ Configuration copiée: .env.local"
fi

# Démarrer le serveur de développement
echo "🌐 Démarrage sur http://localhost:3000"
echo "📁 Dossier: boutique-client-next"
echo "🔧 Configuration: Next.js avec sous-domaines dynamiques"
echo "🔗 API: http://localhost:8000/api"
echo ""
echo "💡 Pour tester le bouton 'Voir la boutique':"
echo "   1. Créez une boutique via le frontend principal"
echo "   2. Cliquez sur 'Voir la boutique'"
echo "   3. Cela devrait ouvrir: http://localhost:3000/{slug}"
echo ""

npm run dev
