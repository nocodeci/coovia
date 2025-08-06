#!/bin/bash

echo "🧹 Nettoyage des doublons dans les formulaires..."

FILES=(
  "src/components/paydunya/FreeMoneySenegalForm.tsx"
  "src/components/paydunya/OrangeMoneyBurkinaForm.tsx"
  "src/components/paydunya/TMoneyTogoForm.tsx"
  "src/components/paydunya/MoovBeninForm.tsx"
  "src/components/paydunya/WaveSenegalForm.tsx"
  "src/components/paydunya/OrangeMoneyMaliForm.tsx"
  "src/components/paydunya/MoovMaliForm.tsx"
  "src/components/paydunya/OrangeMoneySenegalForm.tsx"
)

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "🧹 Nettoyage de $file"
    
    # Supprimer les doublons du message "Numéro pré-rempli depuis le checkout"
    # Garder seulement la première occurrence
    awk '
    BEGIN { message_count = 0 }
    /Numéro pré-rempli depuis le checkout/ {
      message_count++
      if (message_count == 1) {
        print
      }
      next
    }
    { print }
    ' "$file" > "${file}.tmp" && mv "${file}.tmp" "$file"
    
    echo "✅ $file nettoyé"
  else
    echo "⚠️  Fichier $file non trouvé"
  fi
done

echo "🎉 Nettoyage terminé !"
