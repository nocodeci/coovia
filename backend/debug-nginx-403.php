<?php

echo "=== DIAGNOSTIC ERREUR NGINX 403 ===\n\n";

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
        
        // Vérifier le contenu
        $content = file_get_contents($index_file);
        if (strpos($content, 'Laravel') !== false) {
            echo "   ✅ Contenu Laravel détecté\n";
        } else {
            echo "   ⚠️  Contenu Laravel non détecté\n";
        }
    } else {
        echo "   ❌ index.php MANQUANT - C'est le problème principal !\n";
    }
    
    // Lister les fichiers dans public
    $files = scandir($public_dir);
    $visible_files = array_filter($files, function($f) { return $f !== '.' && $f !== '..'; });
    echo "   Fichiers dans public: " . implode(', ', $visible_files) . "\n";
} else {
    echo "   ❌ Dossier public N'EXISTE PAS - Problème critique !\n";
}

// 2. Vérifier les permissions
echo "\n2. Permissions des dossiers:\n";
$dirs_to_check = [
    'public',
    'storage',
    'bootstrap/cache'
];

foreach ($dirs_to_check as $dir) {
    if (is_dir($dir)) {
        $perms = substr(sprintf('%o', fileperms($dir)), -4);
        $writable = is_writable($dir) ? '✅' : '❌';
        echo "   $writable $dir: $perms\n";
        
        // Vérifier les permissions récursives
        if ($dir === 'public') {
            $iterator = new RecursiveIteratorIterator(
                new RecursiveDirectoryIterator($dir, RecursiveDirectoryIterator::SKIP_DOTS),
                RecursiveIteratorIterator::SELF_FIRST
            );
            
            $file_count = 0;
            foreach ($iterator as $file) {
                $file_count++;
                if ($file_count > 10) break; // Limiter l'affichage
            }
            echo "   Nombre de fichiers dans public: $file_count\n";
        }
    } else {
        echo "   ❌ $dir: N'EXISTE PAS\n";
    }
}

// 3. Vérifier la configuration du serveur
echo "\n3. Configuration du serveur:\n";
echo "   Document Root: " . ($_SERVER['DOCUMENT_ROOT'] ?? 'NON DÉFINI') . "\n";
echo "   Script Name: " . ($_SERVER['SCRIPT_NAME'] ?? 'NON DÉFINI') . "\n";
echo "   Request URI: " . ($_SERVER['REQUEST_URI'] ?? 'NON DÉFINI') . "\n";
echo "   Server Software: " . ($_SERVER['SERVER_SOFTWARE'] ?? 'NON DÉFINI') . "\n";
echo "   Server Name: " . ($_SERVER['SERVER_NAME'] ?? 'NON DÉFINI') . "\n";

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
        echo "   ❌ $var: NON DÉFINIE\n";
    } else {
        $display = $var === 'APP_KEY' ? '***' : $value;
        echo "   ✅ $var: $display\n";
    }
}

// 5. Test de démarrage Laravel
echo "\n5. Test de démarrage Laravel:\n";
try {
    if (file_exists('vendor/autoload.php')) {
        require_once 'vendor/autoload.php';
        echo "   ✅ Autoloader chargé\n";
        
        if (file_exists('bootstrap/app.php')) {
            $app = require_once 'bootstrap/app.php';
            echo "   ✅ Application Laravel chargée\n";
            
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

// 6. Recommandations spécifiques
echo "\n=== RECOMMANDATIONS POUR RÉSOUDRE L'ERREUR 403 ===\n";

if (!file_exists($public_dir . '/index.php')) {
    echo "❌ PROBLÈME CRITIQUE: Le fichier index.php est manquant dans le dossier public\n";
    echo "   Solution: Vérifiez que le déploiement a copié tous les fichiers\n";
} else {
    echo "✅ Le fichier index.php existe\n";
}

echo "\n1. Vérifiez que le Procfile utilise nginx:\n";
echo "   web: vendor/bin/heroku-php-nginx public/\n";

echo "\n2. Assurez-vous que toutes les variables d'environnement sont configurées\n";

echo "\n3. Vérifiez les logs nginx:\n";
echo "   laravel cloud logs --type=nginx\n";

echo "\n4. Si le problème persiste, essayez:\n";
echo "   - Redéployer l'application\n";
echo "   - Vérifier que le dossier public contient index.php\n";
echo "   - Vérifier les permissions (755 pour les dossiers, 644 pour les fichiers)\n";

echo "\n=== FIN DU DIAGNOSTIC ===\n";
