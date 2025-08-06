#!/bin/bash

echo "🔧 Correction finale de tous les formulaires..."

FILES=(
  "src/components/paydunya/OrangeMoneyBurkinaForm.tsx"
  "src/components/paydunya/OrangeMoneyMaliForm.tsx"
  "src/components/paydunya/OrangeMoneySenegalForm.tsx"
  "src/components/paydunya/TMoneyTogoForm.tsx"
  "src/components/paydunya/WaveSenegalForm.tsx"
)

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "🔧 Correction finale de $file"
    
    # Corriger les balises mal fermées
    sed -i '' 's/Numéro pré-rempli depuis le checkout/Numéro pré-rempli depuis le checkout\n            <\/p>/' "$file"
    
    # Supprimer les lignes problématiques
    sed -i '' '/<p className="text-xs text-gray-500 mt-1">$/,/^            <\/p>$/ {
      /<p className="text-xs text-gray-500 mt-1">$/!d
    }' "$file"
    
    echo "✅ $file corrigé"
  else
    echo "⚠️  Fichier $file non trouvé"
  fi
done

echo "🎉 Correction finale terminée !"
