#!/bin/bash

echo "🔍 Diagnostic du problème composer.lock..."

# Vérifier si le fichier existe
if [ ! -f "composer.lock" ]; then
    echo "❌ Le fichier composer.lock n'existe pas"
    echo "📦 Génération du fichier composer.lock..."
    composer install --no-dev
else
    echo "✅ Le fichier composer.lock existe"
    echo "📊 Taille du fichier: $(ls -lh composer.lock | awk '{print $5}')"
fi

# Vérifier le statut Git
echo ""
echo "🔍 Vérification du statut Git..."
if git ls-files composer.lock > /dev/null 2>&1; then
    echo "✅ Le fichier composer.lock est tracké par Git"
else
    echo "❌ Le fichier composer.lock n'est pas tracké par Git"
    echo "📝 Ajout du fichier au repository..."
    git add composer.lock
    git commit -m "Add composer.lock for deployment"
    git push
fi

# Vérifier les permissions
echo ""
echo "🔍 Vérification des permissions..."
ls -la composer.lock

# Vérifier la validité du fichier
echo ""
echo "🔍 Vérification de la validité du fichier composer.lock..."
if composer validate --no-check-all > /dev/null 2>&1; then
    echo "✅ Le fichier composer.lock est valide"
else
    echo "❌ Le fichier composer.lock n'est pas valide"
    echo "🔄 Régénération du fichier..."
    rm composer.lock
    composer install --no-dev
fi

echo ""
echo "🎯 Diagnostic terminé!"
