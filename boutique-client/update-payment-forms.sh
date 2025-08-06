#!/bin/bash

# Script pour mettre à jour automatiquement tous les formulaires de paiement
# avec le numéro de téléphone pré-rempli depuis le checkout

echo "🔄 Mise à jour des formulaires de paiement..."

# Liste des fichiers à modifier
FILES=(
  "src/components/paydunya/MoovCIForm.tsx"
  "src/components/paydunya/OrangeMoneyBurkinaForm.tsx"
  "src/components/paydunya/OrangeMoneySenegalForm.tsx"
  "src/components/paydunya/FreeMoneySenegalForm.tsx"
  "src/components/paydunya/ExpressoSenegalForm.tsx"
  "src/components/paydunya/WaveSenegalForm.tsx"
  "src/components/paydunya/MoovBeninForm.tsx"
  "src/components/paydunya/MTNBeninForm.tsx"
  "src/components/paydunya/TMoneyTogoForm.tsx"
  "src/components/paydunya/OrangeMoneyMaliForm.tsx"
  "src/components/paydunya/MoovMaliForm.tsx"
)

# Fonction pour mettre à jour un fichier
update_file() {
  local file=$1
  echo "📝 Mise à jour de $file"
  
  # 1. Ajouter customerPhone à l'interface
  sed -i '' 's/interface [A-Za-z]*FormProps {/interface \0\n  customerPhone: string;/' "$file"
  
  # 2. Ajouter customerPhone aux props du composant
  sed -i '' 's/customerEmail,/customerEmail,\n  customerPhone,/' "$file"
  
  # 3. Initialiser useState avec customerPhone
  sed -i '' 's/const \[phone, setPhone\] = useState('\''\'');/const [phone, setPhone] = useState(customerPhone);/' "$file"
  
  # 4. Ajouter le message informatif (à faire manuellement car plus complexe)
  echo "✅ $file mis à jour"
}

# Mettre à jour tous les fichiers
for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    update_file "$file"
  else
    echo "⚠️  Fichier $file non trouvé"
  fi
done

echo "🎉 Mise à jour terminée !"
echo "📋 N'oubliez pas d'ajouter manuellement le message informatif :"
echo "   <p className=\"text-xs text-gray-500 mt-1\">"
echo "     Numéro pré-rempli depuis le checkout"
echo "   </p>" 