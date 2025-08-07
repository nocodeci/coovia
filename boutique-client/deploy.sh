#!/bin/bash

# Script de déploiement automatisé pour boutique-client
# Déploiement sur Vercel avec le domaine my.wozif.com

echo "🚀 Démarrage du déploiement boutique-client..."

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "package.json" ]; then
    echo "❌ Erreur: package.json non trouvé. Assurez-vous d'être dans le répertoire boutique-client"
    exit 1
fi

# Vérifier que Vercel CLI est installé
if ! command -v vercel &> /dev/null; then
    echo "❌ Erreur: Vercel CLI n'est pas installé"
    echo "Installez-le avec: npm install -g vercel"
    exit 1
fi

# Nettoyer le cache si nécessaire
echo "🧹 Nettoyage du cache..."
rm -rf node_modules/.cache
rm -rf build

# Installer les dépendances
echo "📦 Installation des dépendances..."
npm install

# Vérifier les vulnérabilités
echo "🔍 Vérification des vulnérabilités..."
npm audit --audit-level=high || echo "⚠️  Vulnérabilités détectées mais déploiement continué"

# Build local pour vérifier
echo "🔨 Build local..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build local réussi"
else
    echo "❌ Erreur lors du build local"
    exit 1
fi

# Déploiement sur Vercel
echo "🚀 Déploiement sur Vercel..."
vercel --prod --yes

if [ $? -eq 0 ]; then
    echo "✅ Déploiement réussi !"
    echo "🌐 Votre application est accessible sur: https://my.wozif.com"
    echo "🔗 URL Vercel: https://coovia-*.vercel.app"
else
    echo "❌ Erreur lors du déploiement"
    exit 1
fi

echo "🎉 Déploiement terminé avec succès !"
