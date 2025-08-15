<?php

echo "=== DIAGNOSTIC DE DÉPLOIEMENT ===\n\n";

// Vérifier les variables d'environnement essentielles
$required_vars = [
    'APP_ENV',
    'APP_DEBUG',
    'APP_KEY',
    'APP_URL',
    'DB_CONNECTION',
    'DB_HOST',
    'DB_PORT',
    'DB_DATABASE',
    'DB_USERNAME',
    'DB_PASSWORD'
];

echo "Variables d'environnement requises:\n";
foreach ($required_vars as $var) {
    $value = getenv($var);
    if ($value === false) {
        echo "❌ $var: NON DÉFINIE\n";
    } else {
        $display_value = in_array($var, ['DB_PASSWORD', 'APP_KEY']) ? '***' : $value;
        echo "✅ $var: $display_value\n";
    }
}

echo "\n=== PERMISSIONS DES DOSSIERS ===\n";

$dirs_to_check = [
    'storage',
    'storage/framework',
    'storage/framework/cache',
    'storage/framework/sessions',
    'storage/framework/views',
    'bootstrap/cache',
    'public'
];

foreach ($dirs_to_check as $dir) {
    if (is_dir($dir)) {
        $perms = substr(sprintf('%o', fileperms($dir)), -4);
        $writable = is_writable($dir) ? '✅' : '❌';
        echo "$writable $dir: $perms\n";
    } else {
        echo "❌ $dir: N'EXISTE PAS\n";
    }
}

echo "\n=== CONNEXION BASE DE DONNÉES ===\n";

try {
    if (getenv('DB_CONNECTION') && getenv('DB_HOST')) {
        $dsn = getenv('DB_CONNECTION') . ':host=' . getenv('DB_HOST');
        if (getenv('DB_PORT')) {
            $dsn .= ';port=' . getenv('DB_PORT');
        }
        if (getenv('DB_DATABASE')) {
            $dsn .= ';dbname=' . getenv('DB_DATABASE');
        }
        
        $pdo = new PDO($dsn, getenv('DB_USERNAME'), getenv('DB_PASSWORD'));
        echo "✅ Connexion DB: RÉUSSIE\n";
    } else {
        echo "❌ Connexion DB: VARIABLES MANQUANTES\n";
    }
} catch (Exception $e) {
    echo "❌ Connexion DB: ÉCHEC - " . $e->getMessage() . "\n";
}

echo "\n=== FICHIERS ESSENTIELS ===\n";

$files_to_check = [
    'vendor/autoload.php',
    'bootstrap/app.php',
    'config/app.php',
    '.env'
];

foreach ($files_to_check as $file) {
    if (file_exists($file)) {
        echo "✅ $file: EXISTE\n";
    } else {
        echo "❌ $file: MANQUANT\n";
    }
}

echo "\n=== FIN DU DIAGNOSTIC ===\n";
