<?php

echo "=== TEST CONFIGURATION VARIABLES D'ENVIRONNEMENT ===\n\n";

// Variables critiques à vérifier
$critical_vars = [
    'APP_NAME' => 'coovia',
    'APP_ENV' => 'production',
    'APP_DEBUG' => 'false',
    'APP_URL' => 'https://coovia-cursor-ozzf9a.laravel.cloud',
    'APP_KEY' => 'base64:',
    'LOG_CHANNEL' => 'laravel-cloud-socket',
    'SESSION_DRIVER' => 'cookie',
    'CACHE_DRIVER' => 'file',
    'QUEUE_CONNECTION' => 'sync',
    'FILESYSTEM_DISK' => 'local'
];

// Variables de base de données
$db_vars = [
    'DB_CONNECTION',
    'DB_HOST',
    'DB_PORT',
    'DB_DATABASE',
    'DB_USERNAME',
    'DB_PASSWORD'
];

echo "1. Vérification des variables critiques:\n";
$all_good = true;

foreach ($critical_vars as $var => $expected_value) {
    $value = getenv($var);
    
    if ($value === false) {
        echo "   ❌ $var: NON DÉFINIE\n";
        $all_good = false;
    } else {
        $display_value = $var === 'APP_KEY' ? '***' : $value;
        
        if ($expected_value === 'base64:') {
            if (strpos($value, 'base64:') === 0) {
                echo "   ✅ $var: $display_value\n";
            } else {
                echo "   ❌ $var: Format incorrect (devrait commencer par 'base64:')\n";
                $all_good = false;
            }
        } else {
            echo "   ✅ $var: $display_value\n";
        }
    }
}

echo "\n2. Vérification des variables de base de données:\n";
$db_configured = true;

foreach ($db_vars as $var) {
    $value = getenv($var);
    
    if ($value === false || $value === '') {
        echo "   ❌ $var: NON DÉFINIE\n";
        $db_configured = false;
    } else {
        $display = $var === 'DB_PASSWORD' ? '***' : $value;
        echo "   ✅ $var: $display\n";
    }
}

echo "\n3. Test de connexion à la base de données:\n";

if ($db_configured) {
    try {
        $dsn = getenv('DB_CONNECTION') . ':host=' . getenv('DB_HOST');
        if (getenv('DB_PORT')) {
            $dsn .= ';port=' . getenv('DB_PORT');
        }
        if (getenv('DB_DATABASE')) {
            $dsn .= ';dbname=' . getenv('DB_DATABASE');
        }
        
        $pdo = new PDO($dsn, getenv('DB_USERNAME'), getenv('DB_PASSWORD'));
        echo "   ✅ Connexion DB: RÉUSSIE\n";
    } catch (Exception $e) {
        echo "   ❌ Connexion DB: ÉCHEC - " . $e->getMessage() . "\n";
        $all_good = false;
    }
} else {
    echo "   ⚠️  Connexion DB: Variables manquantes\n";
    $all_good = false;
}

echo "\n4. Test de démarrage Laravel:\n";

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
            
            // Vérifier les valeurs de configuration
            $app_name = $config->get('app.name');
            $app_env = $config->get('app.env');
            $app_debug = $config->get('app.debug');
            
            echo "   APP_NAME configuré: $app_name\n";
            echo "   APP_ENV configuré: $app_env\n";
            echo "   APP_DEBUG configuré: " . ($app_debug ? 'true' : 'false') . "\n";
            
        } else {
            echo "   ❌ bootstrap/app.php manquant\n";
            $all_good = false;
        }
    } else {
        echo "   ❌ vendor/autoload.php manquant\n";
        $all_good = false;
    }
} catch (Exception $e) {
    echo "   ❌ Erreur lors du démarrage: " . $e->getMessage() . "\n";
    $all_good = false;
}

echo "\n=== RÉSULTAT ===\n";

if ($all_good && $db_configured) {
    echo "✅ Configuration complète et correcte !\n";
    echo "Votre application devrait fonctionner correctement.\n";
} elseif ($all_good && !$db_configured) {
    echo "⚠️  Configuration partielle - Base de données manquante\n";
    echo "Ajoutez les variables DB_* pour une configuration complète.\n";
} else {
    echo "❌ Configuration incomplète ou incorrecte\n";
    echo "Vérifiez les variables d'environnement manquantes.\n";
}

echo "\n=== RECOMMANDATIONS ===\n";

if (!$all_good) {
    echo "1. Ajoutez les variables manquantes dans Laravel Cloud\n";
    echo "2. Vérifiez le format de APP_KEY (doit commencer par 'base64:')\n";
    echo "3. Configurez la base de données\n";
    echo "4. Redéployez l'application\n";
}

echo "5. Testez l'URL: https://coovia-cursor-ozzf9a.laravel.cloud/test\n";

echo "\n=== FIN DU TEST ===\n";
