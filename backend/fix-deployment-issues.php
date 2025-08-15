<?php

echo "=== CORRECTION DES PROBLÈMES DE DÉPLOIEMENT ===\n\n";

// 1. Vérifier et créer les dossiers nécessaires
$dirs_to_create = [
    'storage/framework/cache',
    'storage/framework/sessions', 
    'storage/framework/views',
    'bootstrap/cache'
];

echo "Création des dossiers nécessaires...\n";
foreach ($dirs_to_create as $dir) {
    if (!is_dir($dir)) {
        if (mkdir($dir, 0755, true)) {
            echo "✅ Créé: $dir\n";
        } else {
            echo "❌ Échec création: $dir\n";
        }
    } else {
        echo "✅ Existe déjà: $dir\n";
    }
}

// 2. Corriger les permissions
echo "\nCorrection des permissions...\n";
$dirs_to_fix = [
    'storage',
    'bootstrap/cache'
];

foreach ($dirs_to_fix as $dir) {
    if (is_dir($dir)) {
        if (chmod($dir, 0755)) {
            echo "✅ Permissions corrigées: $dir\n";
        } else {
            echo "❌ Échec permissions: $dir\n";
        }
        
        // Récursif pour les sous-dossiers
        $iterator = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($dir, RecursiveDirectoryIterator::SKIP_DOTS),
            RecursiveIteratorIterator::SELF_FIRST
        );
        
        foreach ($iterator as $file) {
            if ($file->isDir()) {
                chmod($file->getPathname(), 0755);
            } else {
                chmod($file->getPathname(), 0644);
            }
        }
    }
}

// 3. Vérifier la clé d'application
echo "\nVérification de la clé d'application...\n";
$app_key = getenv('APP_KEY');
if (!$app_key || $app_key === '') {
    echo "❌ APP_KEY manquante ou vide\n";
    echo "Exécutez: php artisan key:generate\n";
} else {
    echo "✅ APP_KEY configurée\n";
}

// 4. Vérifier les variables d'environnement critiques
echo "\nVérification des variables critiques...\n";
$critical_vars = [
    'APP_ENV' => 'production',
    'APP_DEBUG' => 'false',
    'APP_URL' => 'https://coovia-cursor-ozzf9a.laravel.cloud'
];

foreach ($critical_vars as $var => $expected) {
    $value = getenv($var);
    if ($value === false) {
        echo "❌ $var: NON DÉFINIE (devrait être: $expected)\n";
    } else {
        echo "✅ $var: $value\n";
    }
}

// 5. Vérifier la configuration de base de données
echo "\nVérification de la base de données...\n";
$db_vars = ['DB_CONNECTION', 'DB_HOST', 'DB_PORT', 'DB_DATABASE', 'DB_USERNAME', 'DB_PASSWORD'];
$db_configured = true;

foreach ($db_vars as $var) {
    $value = getenv($var);
    if ($value === false || $value === '') {
        echo "❌ $var: MANQUANTE\n";
        $db_configured = false;
    } else {
        $display = in_array($var, ['DB_PASSWORD']) ? '***' : $value;
        echo "✅ $var: $display\n";
    }
}

if (!$db_configured) {
    echo "\n⚠️  Variables de base de données manquantes. Vérifiez votre configuration.\n";
}

echo "\n=== FIN DE LA CORRECTION ===\n";
echo "\nSi des problèmes persistent, vérifiez:\n";
echo "1. Les variables d'environnement dans Laravel Cloud\n";
echo "2. La configuration de la base de données\n";
echo "3. Les logs d'erreur: php artisan log:clear\n";
