<?php

echo "=== TEST LOCAL LARAVEL ===\n\n";

// 1. Vérifier que Laravel peut démarrer
echo "1. Test de démarrage Laravel:\n";

try {
    // Charger l'autoloader
    require_once __DIR__ . '/vendor/autoload.php';
    echo "✅ Autoloader chargé\n";
    
    // Charger l'application Laravel
    $app = require_once __DIR__ . '/bootstrap/app.php';
    echo "✅ Application Laravel chargée\n";
    
    // Tester la configuration
    $config = $app['config'];
    echo "✅ Configuration chargée\n";
    
    echo "   APP_NAME: " . $config->get('app.name') . "\n";
    echo "   APP_ENV: " . $config->get('app.env') . "\n";
    echo "   APP_DEBUG: " . ($config->get('app.debug') ? 'true' : 'false') . "\n";
    
} catch (Exception $e) {
    echo "❌ Erreur lors du démarrage: " . $e->getMessage() . "\n";
    exit(1);
}

// 2. Vérifier les routes
echo "\n2. Test des routes:\n";

try {
    $router = $app['router'];
    $routes = $router->getRoutes();
    echo "✅ Routes chargées: " . count($routes) . " routes trouvées\n";
    
    // Lister quelques routes
    $routeNames = [];
    foreach ($routes as $route) {
        $methods = $route->methods();
        $uri = $route->uri();
        $routeNames[] = implode('|', $methods) . ' ' . $uri;
    }
    
    echo "   Routes disponibles:\n";
    foreach (array_slice($routeNames, 0, 10) as $route) {
        echo "   - $route\n";
    }
    
} catch (Exception $e) {
    echo "❌ Erreur lors du chargement des routes: " . $e->getMessage() . "\n";
}

// 3. Vérifier la base de données
echo "\n3. Test de la base de données:\n";

try {
    $db = $app['db'];
    $connection = $db->connection();
    $pdo = $connection->getPdo();
    echo "✅ Connexion DB réussie\n";
    
    // Test simple
    $result = $pdo->query('SELECT 1 as test')->fetch();
    echo "✅ Test DB réussi: " . $result['test'] . "\n";
    
} catch (Exception $e) {
    echo "❌ Erreur DB: " . $e->getMessage() . "\n";
}

// 4. Vérifier les permissions
echo "\n4. Test des permissions:\n";

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
        $writable = is_writable($dir) ? '✅' : '❌';
        $perms = substr(sprintf('%o', fileperms($dir)), -4);
        echo "$writable $dir: $perms\n";
    } else {
        echo "❌ $dir: N'EXISTE PAS\n";
    }
}

// 5. Test de la route de test
echo "\n5. Test de la route /test:\n";

try {
    // Simuler une requête HTTP
    $request = \Illuminate\Http\Request::create('/test', 'GET');
    $response = $app->handle($request);
    
    if ($response->getStatusCode() === 200) {
        echo "✅ Route /test fonctionne\n";
        $content = $response->getContent();
        echo "   Réponse: " . substr($content, 0, 100) . "...\n";
    } else {
        echo "❌ Route /test retourne le code: " . $response->getStatusCode() . "\n";
    }
    
} catch (Exception $e) {
    echo "❌ Erreur lors du test de la route: " . $e->getMessage() . "\n";
}

echo "\n=== FIN DU TEST ===\n";
echo "\nSi tous les tests passent, l'application devrait fonctionner sur Laravel Cloud.\n";
echo "Assurez-vous de configurer les variables d'environnement appropriées.\n";
