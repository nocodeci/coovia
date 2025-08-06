#!/bin/bash

echo "🔧 Correction des formulaires de paiement endommagés..."

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

fix_file() {
  local file=$1
  local form_name=$(basename "$file" .tsx)
  
  echo "🔧 Correction de $file"
  
  # Créer un fichier temporaire
  local temp_file="${file}.tmp"
  
  # Utiliser awk pour traiter le fichier
  awk -v form_name="$form_name" '
  BEGIN { 
    interface_fixed = 0
    customer_phone_added = 0
    useState_fixed = 0
  }
  
  # Corriger l'interface
  /^interface 0$/ {
    print "interface " form_name "Props {"
    interface_fixed = 1
    next
  }
  
  # Ajouter customerPhone après paymentToken
  /paymentToken: string;/ && !customer_phone_added {
    print $0
    print "  customerPhone: string;"
    customer_phone_added = 1
    next
  }
  
  # Supprimer customerPhone s'il est mal placé
  /customerPhone: string;/ && customer_phone_added {
    next
  }
  
  # Corriger useState
  /const \[phone, setPhone\] = useState\('\''\''\);/ {
    print "  const [phone, setPhone] = useState(customerPhone);"
    useState_fixed = 1
    next
  }
  
  # Ajouter le message informatif après l'input
  /disabled:cursor-not-allowed"/ && !message_added {
    print $0
    print "            <p className=\"text-xs text-gray-500 mt-1\">"
    print "              Numéro pré-rempli depuis le checkout"
    print "            </p>"
    message_added = 1
    next
  }
  
  # Imprimer toutes les autres lignes
  { print }
  ' "$file" > "$temp_file"
  
  # Remplacer le fichier original
  mv "$temp_file" "$file"
  
  echo "✅ $file corrigé"
}

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    fix_file "$file"
  else
    echo "⚠️  Fichier $file non trouvé"
  fi
done

echo "🎉 Correction terminée !"
