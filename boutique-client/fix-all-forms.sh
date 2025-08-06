#!/bin/bash

echo "🔧 Correction complète de tous les formulaires..."

FILES=(
  "src/components/paydunya/MoovMaliForm.tsx"
  "src/components/paydunya/OrangeMoneyBurkinaForm.tsx"
  "src/components/paydunya/OrangeMoneyMaliForm.tsx"
  "src/components/paydunya/OrangeMoneySenegalForm.tsx"
  "src/components/paydunya/TMoneyTogoForm.tsx"
  "src/components/paydunya/WaveSenegalForm.tsx"
)

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "🔧 Correction de $file"
    
    # 1. Corriger l'interface - ajouter l'accolade ouvrante
    sed -i '' 's/interface [A-Za-z]*FormProps$/& {/' "$file"
    
    # 2. Corriger le formatage de customerPhone et amount
    sed -i '' 's/customerPhone: string;  amount: number;/customerPhone: string;\n  amount: number;/' "$file"
    
    # 3. Corriger l'input - ajouter la fermeture />
    sed -i '' 's/className="[^"]*disabled:cursor-not-allowed"/&\/>/' "$file"
    
    # 4. Supprimer les doublons du message
    sed -i '' '/Numéro pré-rempli depuis le checkout/,/<\/p>/ {
      /Numéro pré-rempli depuis le checkout/!d
    }' "$file"
    
    echo "✅ $file corrigé"
  else
    echo "⚠️  Fichier $file non trouvé"
  fi
done

echo "🎉 Correction terminée !"
