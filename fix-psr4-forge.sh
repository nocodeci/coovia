#!/bin/bash

echo "🔧 Correction PSR-4 sur le serveur Forge"
echo "========================================"

# Aller dans le répertoire du site
cd /home/forge/default

echo "📁 Vérification des fichiers Paydunya..."
ls -la app/Services/ | grep -i paydunya

echo ""
echo "🔄 Renommage du fichier pour PSR-4 compliance..."

# Renommer le fichier si nécessaire
if [ -f "app/Services/PayDunyaService.php" ]; then
    mv app/Services/PayDunyaService.php app/Services/PaydunyaService.php
    echo "✅ Fichier renommé : PayDunyaService.php → PaydunyaService.php"
else
    echo "ℹ️  Fichier déjà correctement nommé"
fi

echo ""
echo "📦 Régénération de l'autoload..."
composer dump-autoload --optimize

echo ""
echo "🔍 Vérification finale..."
ls -la app/Services/ | grep -i paydunya

echo ""
echo "✅ Correction PSR-4 terminée !"
echo "🔄 Redémarrage des services..."

# Redémarrer PHP-FPM
sudo systemctl reload php8.2-fpm

echo ""
echo "🎉 Correction terminée ! L'erreur PSR-4 devrait disparaître au prochain déploiement."
