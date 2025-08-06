#!/bin/bash

echo "🔧 Correction simple des formulaires de paiement..."

FILES=(
  "src/components/paydunya/MTNBeninForm.tsx"
  "src/components/paydunya/MoovBeninForm.tsx"
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
    
    # 1. Corriger l'interface - remplacer "interface 0" par le bon nom
    form_name=$(basename "$file" .tsx)
    sed -i '' "s/interface 0/interface ${form_name}Props {/" "$file"
    
    # 2. Réorganiser l'interface - déplacer customerPhone après customerEmail
    sed -i '' '/customerPhone: string;/d' "$file"
    sed -i '' '/customerEmail: string;/a\
  customerPhone: string;' "$file"
    
    # 3. Corriger useState - utiliser customerPhone
    sed -i '' "s/const \[phone, setPhone\] = useState('');/const [phone, setPhone] = useState(customerPhone);/" "$file"
    
    echo "✅ $file corrigé"
  else
    echo "⚠️  Fichier $file non trouvé"
  fi
done

echo "🎉 Correction terminée !"
