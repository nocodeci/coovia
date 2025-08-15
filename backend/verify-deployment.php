<?php

echo "=== VÉRIFICATION DU DÉPLOIEMENT LARAVEL CLOUD ===\n\n";

// 1. Vérifier la structure des fichiers
echo "1. Structure des fichiers:\n";
$current_dir = __DIR__;
echo "   Répertoire actuel: $current_dir\n";

$public_dir = $current_dir . '/public';
if (is_dir($public_dir)) {
    echo "   ✅ Dossier public existe: $public_dir\n";
    
    $index_file = $public_dir . '/index.php';
    if (file_exists($index_file)) {
        echo "   ✅ index.php existe: $index_file\n";
        echo "   Taille: " . filesize($index_file) . " bytes\n";
        echo "   Permissions: " . substr(sprintf('%o', fileperms($index_file)), -4) . "\n";
        
        // Vérifier le contenu du fichier index.php
        $content = file_get_contents($index_file);
        if (strpos($content, 'Laravel') !== false) {
            echo "   ✅ Contenu Laravel détecté\n";
        } else {
            echo "   ⚠️  Contenu Laravel non détecté\n";
        }
    } else {
        echo "   ❌ index.php MANQUANT\n";
    }
} else {
    echo "   ❌ Dossier public N'EXISTE PAS\n";
}

// 2. Vérifier les variables d'environnement
echo "\n2. Variables d'environnement:\n";
$env_vars = [
    'APP_ENV',
    'APP_DEBUG',
    'APP_KEY',
    'APP_URL',
    'DB_CONNECTION',
    'DB_HOST',
    'DB_DATABASE'
];

foreach ($env_vars as $var) {
    $value = getenv($var);
    if ($value === false) {
        echo "   ❌ $var: NON DÉFINIE\n";
    } else {
        $display = in_array($var, ['APP_KEY', 'DB_PASSWORD']) ? '***' : $value;
        echo "   ✅ $var: $display\n";
    }
}

// 3. Vérifier les permissions
echo "\n3. Permissions des dossiers:\n";
$dirs_to_check = [
    'public',
    'storage',
    'storage/framework',
    'storage/framework/cache',
    'storage/framework/sessions',
    'storage/framework/views',
    'bootstrap/cache'
];

foreach ($dirs_to_check as $dir) {
    if (is_dir($dir)) {
        $perms = substr(sprintf('%o', fileperms($dir)), -4);
        $writable = is_writable($dir) ? '✅' : '❌';
        echo "   $writable $dir: $perms\n";
    } else {
        echo "   ❌ $dir: N'EXISTE PAS\n";
    }
}

// 4. Vérifier la configuration Laravel
echo "\n4. Configuration Laravel:\n";
$config_files = [
    'config/app.php',
    'bootstrap/app.php',
    '.env',
    'vendor/autoload.php'
];

foreach ($config_files as $file) {
    if (file_exists($file)) {
        echo "   ✅ $file: EXISTE\n";
    } else {
        echo "   ❌ $file: MANQUANT\n";
    }
}

// 5. Test de démarrage Laravel
echo "\n5. Test de démarrage Laravel:\n";
try {
    // Charger l'autoloader
    if (file_exists('vendor/autoload.php')) {
        require_once 'vendor/autoload.php';
        echo "   ✅ Autoloader chargé\n";
        
        // Essayer de charger l'application
        if (file_exists('bootstrap/app.php')) {
            $app = require_once 'bootstrap/app.php';
            echo "   ✅ Application Laravel chargée\n";
            
            // Tester la configuration
            $config = $app['config'];
            echo "   ✅ Configuration accessible\n";
            echo "   APP_NAME: " . $config->get('app.name', 'NON DÉFINI') . "\n";
            echo "   APP_ENV: " . $config->get('app.env', 'NON DÉFINI') . "\n";
        } else {
            echo "   ❌ bootstrap/app.php manquant\n";
        }
    } else {
        echo "   ❌ vendor/autoload.php manquant\n";
    }
} catch (Exception $e) {
    echo "   ❌ Erreur lors du démarrage: " . $e->getMessage() . "\n";
}

// 6. Vérifier les logs
echo "\n6. Vérification des logs:\n";
$log_files = [
    'storage/logs/laravel.log',
    'storage/logs/error.log'
];

foreach ($log_files as $log_file) {
    if (file_exists($log_file)) {
        $size = filesize($log_file);
        echo "   ✅ $log_file: " . number_format($size) . " bytes\n";
        
        if ($size > 0) {
            $last_lines = file($log_file);
            $last_line = end($last_lines);
            echo "   Dernière ligne: " . trim($last_line) . "\n";
        }
    } else {
        echo "   ❌ $log_file: N'EXISTE PAS\n";
    }
}

// 7. Informations système
echo "\n7. Informations système:\n";
echo "   PHP Version: " . PHP_VERSION . "\n";
echo "   Document Root: " . ($_SERVER['DOCUMENT_ROOT'] ?? 'NON DÉFINI') . "\n";
echo "   Script Name: " . ($_SERVER['SCRIPT_NAME'] ?? 'NON DÉFINI') . "\n";
echo "   Request URI: " . ($_SERVER['REQUEST_URI'] ?? 'NON DÉFINI') . "\n";
echo "   Server Software: " . ($_SERVER['SERVER_SOFTWARE'] ?? 'NON DÉFINI') . "\n";

echo "\n=== RECOMMANDATIONS ===\n";
echo "1. Vérifiez que tous les fichiers sont présents\n";
echo "2. Assurez-vous que les permissions sont correctes (755 pour les dossiers)\n";
echo "3. Configurez toutes les variables d'environnement requises\n";
echo "4. Vérifiez les logs d'erreur pour plus de détails\n";
echo "5. Redéployez l'application si nécessaire\n";

echo "\n=== FIN DE LA VÉRIFICATION ===\n";
