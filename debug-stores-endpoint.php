<?php
/**
 * Script de diagnostic pour l'endpoint /api/stores
 * Usage: php debug-stores-endpoint.php
 */

echo "🔍 Diagnostic de l'endpoint /api/stores\n";
echo "=====================================\n\n";

// Simuler l'environnement Laravel
require_once __DIR__ . '/vendor/autoload.php';

// Charger l'application Laravel
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

try {
    echo "1. Vérification de la connexion à la base de données...\n";
    
    // Test de connexion à la base de données
    try {
        DB::connection()->getPdo();
        echo "✅ Base de données connectée\n";
        echo "   - Driver: " . config('database.default') . "\n";
        echo "   - Base: " . config('database.connections.' . config('database.default') . '.database') . "\n";
    } catch (\Exception $e) {
        echo "❌ Erreur de connexion à la base de données: " . $e->getMessage() . "\n";
        exit(1);
    }

    echo "\n2. Vérification de la table 'stores'...\n";
    
    // Vérifier si la table stores existe
    try {
        $tableExists = Schema::hasTable('stores');
        echo $tableExists ? "✅ Table 'stores' existe\n" : "❌ Table 'stores' n'existe pas\n";
        
        if ($tableExists) {
            $columns = Schema::getColumnListing('stores');
            echo "   - Colonnes: " . implode(', ', $columns) . "\n";
            
            $count = DB::table('stores')->count();
            echo "   - Nombre de boutiques: $count\n";
        }
    } catch (\Exception $e) {
        echo "❌ Erreur lors de la vérification de la table: " . $e->getMessage() . "\n";
    }

    echo "\n3. Vérification du modèle Store...\n";
    
    // Vérifier si le modèle Store peut être instancié
    try {
        $store = new \App\Models\Store();
        echo "✅ Modèle Store instancié avec succès\n";
        echo "   - Classe: " . get_class($store) . "\n";
        echo "   - Table: " . $store->getTable() . "\n";
    } catch (\Exception $e) {
        echo "❌ Erreur lors de l'instanciation du modèle Store: " . $e->getMessage() . "\n";
        
        // Vérifier si le fichier existe
        $modelPath = __DIR__ . '/app/Models/Store.php';
        if (file_exists($modelPath)) {
            echo "   - Fichier modèle trouvé: $modelPath\n";
        } else {
            echo "   - Fichier modèle manquant: $modelPath\n";
        }
    }

    echo "\n4. Test de la requête SQL...\n";
    
    // Tester la requête SQL directement
    try {
        $query = "SELECT id, name, description, slug, logo, banner, theme, created_at FROM stores WHERE status = 'active' ORDER BY created_at DESC";
        echo "   - Requête: $query\n";
        
        $results = DB::select($query);
        echo "✅ Requête SQL exécutée avec succès\n";
        echo "   - Résultats: " . count($results) . " boutiques trouvées\n";
        
        if (count($results) > 0) {
            echo "   - Première boutique: " . json_encode($results[0], JSON_PRETTY_PRINT) . "\n";
        }
    } catch (\Exception $e) {
        echo "❌ Erreur lors de l'exécution de la requête SQL: " . $e->getMessage() . "\n";
    }

    echo "\n5. Test de la méthode listPublicStores...\n";
    
    // Tester la méthode du contrôleur
    try {
        $controller = new \App\Http\Controllers\Api\StoreController();
        $reflection = new ReflectionClass($controller);
        
        if ($reflection->hasMethod('listPublicStores')) {
            echo "✅ Méthode listPublicStores trouvée\n";
            
            // Tester l'appel de la méthode
            $response = $controller->listPublicStores();
            echo "✅ Méthode exécutée avec succès\n";
            echo "   - Type de réponse: " . get_class($response) . "\n";
            
            if (method_exists($response, 'getContent')) {
                $content = $response->getContent();
                echo "   - Contenu: " . substr($content, 0, 200) . "...\n";
            }
        } else {
            echo "❌ Méthode listPublicStores non trouvée\n";
        }
    } catch (\Exception $e) {
        echo "❌ Erreur lors de l'exécution de la méthode: " . $e->getMessage() . "\n";
        echo "   - Fichier: " . $e->getFile() . "\n";
        echo "   - Ligne: " . $e->getLine() . "\n";
        echo "   - Trace: " . $e->getTraceAsString() . "\n";
    }

    echo "\n6. Vérification des routes...\n";
    
    // Vérifier si la route est bien enregistrée
    try {
        $routes = Route::getRoutes();
        $storesRoute = null;
        
        foreach ($routes as $route) {
            if ($route->uri() === 'api/stores' && $route->methods()[0] === 'GET') {
                $storesRoute = $route;
                break;
            }
        }
        
        if ($storesRoute) {
            echo "✅ Route /api/stores trouvée\n";
            echo "   - Contrôleur: " . $storesRoute->getController() . "\n";
            echo "   - Méthode: " . $storesRoute->getActionMethod() . "\n";
        } else {
            echo "❌ Route /api/stores non trouvée\n";
        }
    } catch (\Exception $e) {
        echo "❌ Erreur lors de la vérification des routes: " . $e->getMessage() . "\n";
    }

} catch (\Exception $e) {
    echo "❌ Erreur générale: " . $e->getMessage() . "\n";
    echo "   - Fichier: " . $e->getFile() . "\n";
    echo "   - Ligne: " . $e->getLine() . "\n";
}

echo "\n📋 Résumé du diagnostic:\n";
echo "========================\n";
echo "Si vous voyez des erreurs ci-dessus, corrigez-les avant de tester l'API.\n";
echo "Vérifiez particulièrement:\n";
echo "1. La connexion à la base de données\n";
echo "2. L'existence de la table 'stores'\n";
echo "3. Le modèle Store\n";
echo "4. La méthode listPublicStores\n";
echo "5. L'enregistrement de la route\n";
