#!/bin/bash

# Script pour corriger les formulaires de paiement endommagés par le script précédent

echo "🔧 Correction des formulaires de paiement endommagés..."

# Liste des fichiers à corriger
FILES=(
  "src/components/paydunya/FreeMoneySenegalForm.tsx"
  "src/components/paydunya/MTNBeninForm.tsx"
  "src/components/paydunya/MoovBeninForm.tsx"
  "src/components/paydunya/MoovMaliForm.tsx"
  "src/components/paydunya/OrangeMoneyBurkinaForm.tsx"
  "src/components/paydunya/OrangeMoneyMaliForm.tsx"
  "src/components/paydunya/OrangeMoneySenegalForm.tsx"
  "src/components/paydunya/TMoneyTogoForm.tsx"
  "src/components/paydunya/WaveSenegalForm.tsx"
)

# Fonction pour corriger un fichier
fix_file() {
  local file=$1
  local form_name=$(basename "$file" .tsx)
  
  echo "🔧 Correction de $file"
  
  # 1. Corriger l'interface (remplacer "interface 0" par le bon nom)
  sed -i '' "s/interface 0/interface ${form_name}Props/" "$file"
  
  # 2. Réorganiser l'interface pour avoir customerPhone au bon endroit
  sed -i '' '/interface.*Props {/,/}/ {
    /customerPhone: string;/d
    /paymentToken: string;/a\
  customerPhone: string;
  }' "$file"
  
  # 3. Initialiser useState avec customerPhone (avec crochets échappés)
  sed -i '' 's/const \[phone, setPhone\] = useState('\''\'');/const [phone, setPhone] = useState(customerPhone);/' "$file"
  
  # 4. Ajouter le message informatif après l'input phone
  sed -i '' '/placeholder="[^"]*"/,/disabled:cursor-not-allowed"/ {
    /disabled:cursor-not-allowed"/a\
            <p className="text-xs text-gray-500 mt-1">\
              Numéro pré-rempli depuis le checkout\
            </p>
  }' "$file"
  
  echo "✅ $file corrigé"
}

# Corriger tous les fichiers
for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    fix_file "$file"
  else
    echo "⚠️  Fichier $file non trouvé"
  fi
done

echo "🎉 Correction terminée !"
