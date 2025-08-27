<?php
/**
 * Script de test pour vérifier la configuration CORS en production
 * Usage: php test-cors-production.php
 */

echo "🧪 Test de configuration CORS pour la production\n";
echo "==============================================\n\n";

// Test 1: Vérifier que le middleware CORS est bien configuré
echo "1. Vérification du middleware CORS...\n";
if (file_exists(__DIR__ . '/app/Http/Middleware/Cors.php')) {
    echo "✅ Middleware CORS trouvé\n";
    
    $corsContent = file_get_contents(__DIR__ . '/app/Http/Middleware/Cors.php');
    if (strpos($corsContent, 'https://app.wozif.store') !== false) {
        echo "✅ Domaine app.wozif.store autorisé dans le middleware\n";
    } else {
        echo "❌ Domaine app.wozif.store NON trouvé dans le middleware\n";
    }
} else {
    echo "❌ Middleware CORS non trouvé\n";
}

// Test 2: Vérifier la configuration CORS
echo "\n2. Vérification de la configuration CORS...\n";
if (file_exists(__DIR__ . '/config/cors.php')) {
    echo "✅ Fichier de configuration CORS trouvé\n";
    
    $configContent = file_get_contents(__DIR__ . '/config/cors.php');
    if (strpos($configContent, 'https://app.wozif.store') !== false) {
        echo "✅ Domaine app.wozif.store autorisé dans la config\n";
    } else {
        echo "❌ Domaine app.wozif.store NON trouvé dans la config\n";
    }
} else {
    echo "❌ Fichier de configuration CORS non trouvé\n";
}

// Test 3: Vérifier l'enregistrement du middleware
echo "\n3. Vérification de l'enregistrement du middleware...\n";
$bootstrapFiles = [
    __DIR__ . '/bootstrap/app.php',
    __DIR__ . '/backend/bootstrap/app.php'
];

$middlewareRegistered = false;
foreach ($bootstrapFiles as $file) {
    if (file_exists($file)) {
        $content = file_get_contents($file);
        if (strpos($content, 'Cors::class') !== false) {
            echo "✅ Middleware CORS enregistré dans " . basename($file) . "\n";
            $middlewareRegistered = true;
            break;
        }
    }
}

if (!$middlewareRegistered) {
    echo "❌ Middleware CORS non enregistré dans les fichiers bootstrap\n";
}

// Test 4: Vérifier les routes API
echo "\n4. Vérification des routes API...\n";
if (file_exists(__DIR__ . '/routes/api.php')) {
    echo "✅ Fichier de routes API trouvé\n";
    
    $routesContent = file_get_contents(__DIR__ . '/routes/api.php');
    if (strpos($routesContent, 'auth/check') !== false) {
        echo "✅ Route auth/check trouvée dans les routes API\n";
    } else {
        echo "⚠️  Route auth/check non trouvée dans les routes API\n";
    }
} else {
    echo "❌ Fichier de routes API non trouvé\n";
}

echo "\n📋 Résumé des tests CORS:\n";
echo "========================\n";
echo "Pour résoudre l'erreur CORS, assurez-vous que:\n";
echo "1. Le middleware CORS est bien enregistré\n";
echo "2. Le domaine 'https://app.wozif.store' est autorisé\n";
echo "3. Les en-têtes CORS sont correctement définis\n";
echo "4. Le serveur Forge est redémarré après les modifications\n\n";

echo "🚀 Prochaines étapes:\n";
echo "1. Redéployer votre backend sur Forge\n";
echo "2. Vérifier que les en-têtes CORS sont bien envoyés\n";
echo "3. Tester l'API depuis votre frontend\n";
