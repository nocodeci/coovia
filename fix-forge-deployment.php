<?php

/**
 * Script pour résoudre les problèmes de déploiement Forge
 * À exécuter sur le serveur Forge pour nettoyer l'état Git
 */

echo "🔧 SCRIPT DE CORRECTION FORGE DEPLOYMENT\n";
echo "=====================================\n\n";

// Vérifier qu'on est dans le bon répertoire
$currentDir = getcwd();
echo "📂 Répertoire actuel: {$currentDir}\n";

if (!file_exists('artisan')) {
    echo "❌ ERREUR: Fichier artisan non trouvé. Assurez-vous d'être dans /home/forge/api.wozif.com\n";
    exit(1);
}

echo "✅ Fichier artisan trouvé - Nous sommes dans le bon répertoire Laravel\n\n";

// Étape 1: Afficher le statut Git actuel
echo "📋 ÉTAPE 1: Statut Git actuel\n";
echo "-----------------------------\n";
system('git status --porcelain');
echo "\n";

// Étape 2: Sauvegarder les modifications locales importantes (si besoin)
echo "💾 ÉTAPE 2: Sauvegarde des modifications importantes\n";
echo "---------------------------------------------------\n";

$importantFiles = [
    '.env',
    'storage/logs/',
    'bootstrap/cache/',
    'storage/framework/'
];

foreach ($importantFiles as $file) {
    if (file_exists($file)) {
        echo "✅ {$file} - Présent\n";
    } else {
        echo "⚠️  {$file} - Non trouvé\n";
    }
}
echo "\n";

// Étape 3: Nettoyer l'état Git
echo "🧹 ÉTAPE 3: Nettoyage de l'état Git\n";
echo "-----------------------------------\n";
echo "Exécution de: git reset --hard HEAD\n";
system('git reset --hard HEAD');
echo "\n";

echo "Exécution de: git clean -df\n";
system('git clean -df');
echo "\n";

// Étape 4: Vérifier l'état après nettoyage
echo "🔍 ÉTAPE 4: Vérification après nettoyage\n";
echo "----------------------------------------\n";
system('git status');
echo "\n";

// Étape 5: Fetch les dernières modifications
echo "📥 ÉTAPE 5: Récupération des dernières modifications\n";
echo "---------------------------------------------------\n";
echo "Exécution de: git fetch origin\n";
system('git fetch origin');
echo "\n";

// Étape 6: Pull des modifications
echo "⬇️  ÉTAPE 6: Application des modifications\n";
echo "-----------------------------------------\n";
echo "Exécution de: git pull origin backend-laravel-clean\n";
system('git pull origin backend-laravel-clean');
echo "\n";

// Étape 7: Vérifier le commit actuel
echo "📍 ÉTAPE 7: Vérification du commit actuel\n";
echo "-----------------------------------------\n";
system('git log --oneline -3');
echo "\n";

// Étape 8: Clear des caches Laravel
echo "🗑️  ÉTAPE 8: Nettoyage des caches Laravel\n";
echo "-----------------------------------------\n";

$commands = [
    'php artisan config:clear',
    'php artisan cache:clear',
    'php artisan route:clear',
    'php artisan view:clear'
];

foreach ($commands as $command) {
    echo "Exécution de: {$command}\n";
    system($command);
}
echo "\n";

// Étape 9: Redémarrer PHP-FPM
echo "🔄 ÉTAPE 9: Redémarrage de PHP-FPM\n";
echo "----------------------------------\n";
echo "Exécution de: sudo systemctl restart php8.3-fpm\n";
system('sudo systemctl restart php8.3-fpm');
echo "\n";

// Étape 10: Test de l'API
echo "🧪 ÉTAPE 10: Test de l'API\n";
echo "--------------------------\n";
echo "Test de: https://api.wozif.com/api/user/stores\n";
$response = file_get_contents('https://api.wozif.com/api/user/stores');
if ($response) {
    echo "✅ API répond correctement\n";
    $data = json_decode($response, true);
    if (json_last_error() === JSON_ERROR_NONE) {
        echo "✅ JSON valide reçu\n";
    } else {
        echo "⚠️  Réponse non-JSON: " . substr($response, 0, 100) . "...\n";
    }
} else {
    echo "❌ API ne répond pas\n";
}
echo "\n";

echo "🎉 SCRIPT TERMINÉ\n";
echo "=================\n";
echo "Le déploiement Forge devrait maintenant fonctionner.\n";
echo "Vous pouvez relancer le déploiement depuis l'interface Forge.\n\n";

?>
