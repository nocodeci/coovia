#!/bin/bash

echo "🔄 Renommage du projet de Coovia vers Wozif..."
echo "=============================================="

# Fonction pour remplacer Coovia par Wozif dans un fichier
replace_coovia() {
    local file="$1"
    if [ -f "$file" ]; then
        sed -i '' 's/Coovia/Wozif/g' "$file" 2>/dev/null
        echo "✅ Mis à jour: $file"
    fi
}

# Fonction pour remplacer coovia par wozif (minuscules)
replace_coovia_lower() {
    local file="$1"
    if [ -f "$file" ]; then
        sed -i '' 's/coovia/wozif/g' "$file" 2>/dev/null
        echo "✅ Mis à jour (minuscules): $file"
    fi
}

# Parcourir tous les fichiers du projet
find . -type f \( -name "*.php" -o -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.json" -o -name "*.md" -o -name "*.sh" -o -name "*.yaml" -o -name "*.yml" -o -name "*.env*" -o -name "*.txt" -o -name "*.html" -o -name "*.css" -o -name "*.scss" \) \
    -not -path "./node_modules/*" \
    -not -path "./vendor/*" \
    -not -path "./.git/*" \
    -not -path "./storage/*" \
    -not -path "./bootstrap/cache/*" | while read -r file; do
    
    # Vérifier si le fichier contient "Coovia"
    if grep -q "Coovia" "$file" 2>/dev/null; then
        replace_coovia "$file"
    fi
    
    # Vérifier si le fichier contient "coovia" (minuscules)
    if grep -q "coovia" "$file" 2>/dev/null; then
        replace_coovia_lower "$file"
    fi
done

echo ""
echo "🎉 Renommage terminé !"
echo "======================"
echo ""
echo "📋 Fichiers mis à jour :"
echo "- Configuration Laravel (app.php, mail.php, etc.)"
echo "- Templates d'email (otp.blade.php)"
echo "- Configuration frontend (.env, environment.ts, etc.)"
echo "- Composants React (sign-in, sign-up, etc.)"
echo "- Documentation (.md files)"
echo "- Scripts de déploiement (.sh files)"
echo "- Configuration Docker et déploiement"
echo "- Application mobile (app.json, package.json)"
echo "- Boutique client (package.json)"
echo ""
echo "🚀 Prochaines étapes :"
echo "1. Redémarrez le serveur Laravel : php artisan serve"
echo "2. Redémarrez le frontend : npm run dev"
echo "3. Testez l'authentification à 3 étapes"
echo "4. Vérifiez que les emails OTP sont envoyés avec le nouveau nom"
echo ""
echo "✅ Le projet est maintenant renommé en 'Wozif' !"
