#!/bin/bash

echo "🚀 Configuration du repository GitHub pour Coovia Backend"
echo ""

# Vérifier si on est dans le bon répertoire
if [ ! -f "composer.json" ]; then
    echo "❌ Erreur: Ce script doit être exécuté dans le répertoire du backend Laravel"
    exit 1
fi

echo "📋 Étapes pour créer le repository GitHub:"
echo ""
echo "1. Allez sur https://github.com/new"
echo "2. Nom du repository: coovia-backend"
echo "3. Description: Backend Laravel pour l'application Coovia - Plateforme de création de boutiques en ligne"
echo "4. Visibilité: Public"
echo "5. Ne pas initialiser avec README (nous avons déjà le code)"
echo ""
echo "6. Une fois créé, exécutez:"
echo "   git remote set-url origin https://github.com/VOTRE_USERNAME/coovia-backend.git"
echo "   git push -u origin main"
echo ""

echo "🔧 Configuration actuelle:"
echo "Repository local: $(pwd)"
echo "Remote actuel: $(git remote get-url origin 2>/dev/null || echo 'Aucun remote configuré')"
echo ""

echo "✅ Le backend Laravel est prêt à être poussé vers GitHub!"
echo "📚 Documentation disponible dans README.md"
