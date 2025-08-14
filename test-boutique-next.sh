#!/bin/bash

echo "🧪 Test du projet boutique-client-next..."

# Vérifier que le serveur Next.js est démarré
echo "🔍 Vérification du serveur Next.js..."
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Serveur Next.js démarré sur localhost:3000"
else
    echo "❌ Serveur Next.js non accessible sur localhost:3000"
    echo "💡 Démarrez le serveur avec: cd boutique-client-next && npm run dev"
    exit 1
fi

# Vérifier que l'API backend est accessible
echo "🔍 Vérification de l'API backend..."
if curl -s http://localhost:8000/api/stores/boutique-test > /dev/null; then
    echo "✅ API backend accessible sur localhost:8000"
else
    echo "❌ API backend non accessible sur localhost:8000"
    echo "💡 Démarrez le backend avec: cd backend && php artisan serve"
    exit 1
fi

# Tester l'endpoint API spécifique
echo "🔍 Test de l'endpoint API..."
response=$(curl -s http://localhost:8000/api/stores/boutique-test)
if echo "$response" | grep -q "success.*true"; then
    echo "✅ Endpoint API fonctionne correctement"
    echo "📊 Réponse: $(echo "$response" | jq -r '.data.name // "N/A"')"
else
    echo "❌ Endpoint API ne fonctionne pas"
    echo "📊 Réponse: $response"
fi

# Tester l'URL de la boutique
echo "🔍 Test de l'URL de la boutique..."
if curl -s http://localhost:3000/boutique-test > /dev/null; then
    echo "✅ URL de la boutique accessible"
else
    echo "⚠️ URL de la boutique non accessible (peut être normal si pas de données)"
fi

echo ""
echo "🎯 Configuration actuelle:"
echo "- Frontend: http://localhost:3000"
echo "- Backend: http://localhost:8000"
echo "- API: http://localhost:8000/api"
echo "- Boutique test: http://localhost:3000/boutique-test"

echo ""
echo "💡 Pour tester le bouton 'Voir la boutique':"
echo "1. Allez sur le frontend principal"
echo "2. Créez une boutique ou sélectionnez une existante"
echo "3. Cliquez sur 'Voir la boutique'"
echo "4. Cela devrait ouvrir: http://localhost:3000/{slug}"

echo ""
echo "🎉 Test terminé !"
