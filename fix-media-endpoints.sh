#!/bin/bash

echo "🔧 Correction des Endpoints Médias dans le Frontend"
echo "=================================================="
echo ""

# Aller dans le dossier frontend
cd ../frontend/frontend

echo "📁 Dossier actuel: $(pwd)"
echo ""

# Créer une sauvegarde
echo "💾 Création de sauvegarde..."
cp -r src src.backup.$(date +%Y%m%d_%H%M%S)
echo "✅ Sauvegarde créée"
echo ""

# Chercher et remplacer les endpoints des médias
echo "🔍 Recherche des endpoints des médias..."

# Pattern 1: /api/stores/{id}/media
echo "📝 Remplacement de /api/stores/{id}/media vers /api/public/stores/{id}/media"
find src -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) -exec sed -i '' 's|/api/stores/\([^/]*\)/media|/api/public/stores/\1/media|g' {} \;

# Pattern 2: stores/{id}/media (sans /api)
echo "📝 Remplacement de stores/{id}/media vers public/stores/{id}/media"
find src -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) -exec sed -i '' 's|stores/\([^/]*\)/media|public/stores/\1/media|g' {} \;

echo "✅ Remplacements effectués"
echo ""

# Vérifier les changements
echo "🔍 Vérification des changements..."
echo "Fichiers modifiés contenant 'public/stores':"
grep -r "public/stores" src --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" | head -10

echo ""
echo "🔍 Vérification des endpoints restants:"
echo "Endpoints encore avec 'stores/{id}/media':"
grep -r "stores/.*media" src --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" | head -10

echo ""
echo "🎯 Résumé des Actions:"
echo "======================"
echo "✅ Sauvegarde créée"
echo "✅ Endpoints des médias mis à jour vers /api/public/stores/{id}/media"
echo "✅ Script de vérification exécuté"
echo ""

echo "💡 Prochaines étapes:"
echo "1. Vérifier que les changements sont corrects"
echo "2. Commiter les modifications: git add . && git commit -m 'Fix media endpoints to use public routes'"
echo "3. Pousser vers GitHub: git push origin cursor"
echo "4. Redéployer sur Vercel: vercel --prod"
echo ""

echo "🧪 Test de l'endpoint corrigé:"
echo "curl 'https://api.wozif.com/api/public/stores/9fbbeec1-6aab-4de3-a152-9cf8ae719f62/media'"
echo ""
