#!/bin/bash

echo "🔄 Mise à jour des URLs localhost vers api.wozif.com"
echo "=================================================="
echo ""

# Configuration
OLD_URL="localhost:8000"
NEW_URL="api.wozif.com"
FRONTEND_DIR="../frontend"

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🔍 Recherche des fichiers contenant '$OLD_URL'..."
echo ""

# Rechercher tous les fichiers contenant localhost:8000
FILES=$(grep -r "$OLD_URL" "$FRONTEND_DIR" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" --include="*.html" --include="*.env*" -l 2>/dev/null)

if [ -z "$FILES" ]; then
    echo -e "${GREEN}✅ Aucun fichier trouvé contenant '$OLD_URL'${NC}"
    exit 0
fi

echo "📁 Fichiers trouvés:"
echo "$FILES" | while read -r file; do
    echo "   - $file"
done

echo ""
echo "🔄 Remplacement en cours..."

# Compter les remplacements
TOTAL_REPLACEMENTS=0

# Remplacer dans chaque fichier
echo "$FILES" | while read -r file; do
    if [ -f "$file" ]; then
        # Sauvegarder le fichier original
        cp "$file" "$file.backup"
        
        # Effectuer le remplacement
        REPLACEMENTS=$(sed -i.bak "s|$OLD_URL|$NEW_URL|g" "$file" && echo "OK" || echo "FAILED")
        
        if [ "$REPLACEMENTS" = "OK" ]; then
            # Compter les remplacements
            COUNT=$(grep -o "$NEW_URL" "$file" | wc -l)
            TOTAL_REPLACEMENTS=$((TOTAL_REPLACEMENTS + COUNT))
            
            echo -e "${GREEN}✅ $file - $COUNT remplacement(s)${NC}"
        else
            echo -e "${RED}❌ $file - Échec du remplacement${NC}"
        fi
        
        # Supprimer le fichier de sauvegarde
        rm -f "$file.bak"
    fi
done

echo ""
echo "📊 Résumé des remplacements:"
echo "============================"
echo -e "${GREEN}Total des remplacements: $TOTAL_REPLACEMENTS${NC}"
echo ""

# Vérifier les fichiers modifiés
echo "🔍 Vérification des remplacements..."
echo ""

echo "$FILES" | while read -r file; do
    if [ -f "$file" ]; then
        # Vérifier s'il reste des références à localhost:8000
        REMAINING=$(grep -c "$OLD_URL" "$file" 2>/dev/null || echo "0")
        
        if [ "$REMAINING" -eq 0 ]; then
            echo -e "${GREEN}✅ $file - Toutes les références mises à jour${NC}"
        else
            echo -e "${YELLOW}⚠️  $file - $REMAINING référence(s) restante(s)${NC}"
        fi
    fi
done

echo ""
echo "🚀 Prochaines étapes:"
echo "====================="
echo "1. Vérifiez que tous les remplacements ont été effectués"
echo "2. Testez votre application frontend"
echo "3. Déployez les modifications sur Vercel"
echo "4. Testez l'API depuis le frontend déployé"
echo ""

echo "📝 Note: Des sauvegardes ont été créées avec l'extension .backup"
echo "Vous pouvez les supprimer après vérification:"
echo "find $FRONTEND_DIR -name '*.backup' -delete"
echo ""

echo -e "${GREEN}🎉 Mise à jour terminée !${NC}"
