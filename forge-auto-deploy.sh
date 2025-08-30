#!/bin/bash

# Script de déploiement automatique pour Forge
# À exécuter sur le serveur avant chaque déploiement

echo "🚀 SCRIPT DE DÉPLOIEMENT AUTOMATIQUE FORGE"
echo "=========================================="
echo ""

# Vérifier qu'on est dans le bon répertoire
if [ ! -f "artisan" ]; then
    echo "❌ ERREUR: Fichier artisan non trouvé. Assurez-vous d'être dans /home/forge/api.wozif.com"
    exit 1
fi

echo "✅ Répertoire Laravel détecté"
echo ""

# Étape 1: Sauvegarder les fichiers importants
echo "📋 ÉTAPE 1: Sauvegarde des fichiers importants"
echo "----------------------------------------------"
cp .env .env.backup 2>/dev/null && echo "✅ .env sauvegardé" || echo "⚠️  .env non trouvé"
echo ""

# Étape 2: Nettoyer l'état Git
echo "🧹 ÉTAPE 2: Nettoyage de l'état Git"
echo "-----------------------------------"
echo "Exécution de: git reset --hard HEAD"
git reset --hard HEAD
echo ""

echo "Exécution de: git clean -df"
git clean -df
echo ""

# Étape 3: Vérifier l'état après nettoyage
echo "🔍 ÉTAPE 3: Vérification après nettoyage"
echo "----------------------------------------"
git status
echo ""

# Étape 4: Récupérer les dernières modifications
echo "📥 ÉTAPE 4: Récupération des dernières modifications"
echo "---------------------------------------------------"
echo "Exécution de: git fetch origin"
git fetch origin
echo ""

# Étape 5: Pull des modifications
echo "⬇️  ÉTAPE 5: Application des modifications"
echo "----------------------------------------"
echo "Exécution de: git pull origin backend-laravel-clean"
git pull origin backend-laravel-clean
echo ""

# Étape 6: Restaurer les fichiers importants
echo "🔄 ÉTAPE 6: Restauration des fichiers importants"
echo "-----------------------------------------------"
if [ -f ".env.backup" ]; then
    cp .env.backup .env
    echo "✅ .env restauré"
    rm .env.backup
else
    echo "⚠️  Aucun .env à restaurer"
fi
echo ""

# Étape 7: Clear des caches Laravel
echo "🗑️  ÉTAPE 7: Nettoyage des caches Laravel"
echo "----------------------------------------"
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear
echo ""

# Étape 8: Redémarrer PHP-FPM
echo "🔄 ÉTAPE 8: Redémarrage de PHP-FPM"
echo "----------------------------------"
sudo systemctl restart php8.3-fpm
echo ""

# Étape 9: Vérification finale
echo "✅ ÉTAPE 9: Vérification finale"
echo "-------------------------------"
echo "Commit actuel:"
git log --oneline -1
echo ""

echo "Statut Git:"
git status
echo ""

echo "🎉 DÉPLOIEMENT TERMINÉ AVEC SUCCÈS !"
echo "====================================="
echo "Le site est maintenant à jour et prêt à être utilisé."
echo ""

# Nettoyer les fichiers temporaires
rm -f test-upload.txt test-*.txt 2>/dev/null
echo "🧹 Fichiers temporaires nettoyés"
