<?php

echo "=== DIAGNOSTIC PROBLÈME NGINX ===\n\n";

// 1. Vérifier la structure des fichiers
echo "1. Vérification de la structure des fichiers:\n";
$public_dir = __DIR__ . '/public';
$index_file = $public_dir . '/index.php';

if (is_dir($public_dir)) {
    echo "✅ Dossier public existe: $public_dir\n";
    
    if (file_exists($index_file)) {
        echo "✅ index.php existe: $index_file\n";
        echo "   Taille: " . filesize($index_file) . " bytes\n";
        echo "   Permissions: " . substr(sprintf('%o', fileperms($index_file)), -4) . "\n";
    } else {
        echo "❌ index.php MANQUANT: $index_file\n";
    }
    
    // Lister les fichiers dans public
    $files = scandir($public_dir);
    echo "   Fichiers dans public: " . implode(', ', array_filter($files, function($f) { return $f !== '.' && $f !== '..'; })) . "\n";
} else {
    echo "❌ Dossier public N'EXISTE PAS: $public_dir\n";
}

// 2. Vérifier les permissions
echo "\n2. Vérification des permissions:\n";
$dirs_to_check = [
    'public',
    'storage',
    'bootstrap/cache'
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

// 3. Vérifier la configuration Laravel
echo "\n3. Vérification de la configuration Laravel:\n";
$config_files = [
    'config/app.php',
    'bootstrap/app.php',
    '.env'
];

foreach ($config_files as $file) {
    if (file_exists($file)) {
        echo "✅ $file: EXISTE\n";
    } else {
        echo "❌ $file: MANQUANT\n";
    }
}

// 4. Vérifier les variables d'environnement critiques
echo "\n4. Variables d'environnement critiques:\n";
$critical_vars = [
    'APP_ENV',
    'APP_DEBUG',
    'APP_KEY',
    'APP_URL'
];

foreach ($critical_vars as $var) {
    $value = getenv($var);
    if ($value === false) {
        echo "❌ $var: NON DÉFINIE\n";
    } else {
        $display = $var === 'APP_KEY' ? '***' : $value;
        echo "✅ $var: $display\n";
    }
}

// 5. Vérifier la configuration du serveur
echo "\n5. Configuration du serveur:\n";
echo "   Document Root: " . $_SERVER['DOCUMENT_ROOT'] ?? 'NON DÉFINI' . "\n";
echo "   Script Name: " . $_SERVER['SCRIPT_NAME'] ?? 'NON DÉFINI' . "\n";
echo "   Request URI: " . $_SERVER['REQUEST_URI'] ?? 'NON DÉFINI' . "\n";
echo "   Server Software: " . $_SERVER['SERVER_SOFTWARE'] ?? 'NON DÉFINI' . "\n";

// 6. Test de connexion à la base de données
echo "\n6. Test de connexion à la base de données:\n";
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

echo "\n=== RECOMMANDATIONS ===\n";
echo "1. Vérifiez que le fichier index.php existe dans le dossier public\n";
echo "2. Assurez-vous que les permissions sont correctes (755 pour les dossiers)\n";
echo "3. Configurez les variables d'environnement dans Laravel Cloud\n";
echo "4. Utilisez FrankenPHP directement sans nginx\n";
echo "5. Vérifiez les logs d'erreur: laravel cloud logs\n";

echo "\n=== FIN DU DIAGNOSTIC ===\n";
