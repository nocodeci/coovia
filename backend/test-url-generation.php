<?php

require_once 'vendor/autoload.php';

// Démarrer Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Store;

echo "🧪 Test de génération d'URLs selon l'environnement...\n";

try {
    // Récupérer une boutique active
    $store = Store::where('status', 'active')->first();
    
    if (!$store) {
        echo "❌ Aucune boutique active trouvée\n";
        exit(1);
    }
    
    echo "✅ Boutique trouvée:\n";
    echo "- ID: {$store->id}\n";
    echo "- Nom: {$store->name}\n";
    echo "- Slug: {$store->slug}\n";
    echo "- Status: {$store->status}\n";
    
    // Tester l'endpoint API
    echo "\n🔗 Test de l'endpoint API...\n";
    $apiUrl = "http://localhost:8000/api/boutique/slug/{$store->id}";
    echo "- URL: $apiUrl\n";
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $apiUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Accept: application/json']);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    echo "- Code HTTP: $httpCode\n";
    echo "- Réponse: $response\n";
    
    if ($httpCode === 200) {
        $data = json_decode($response, true);
        echo "✅ API fonctionne correctement\n";
        echo "- Slug récupéré: {$data['slug']}\n";
        
        // Générer les URLs selon l'environnement
        echo "\n🌐 URLs générées selon l'environnement:\n";
        
        // URL de développement (localhost)
        $devUrl = "http://localhost:3000/{$data['slug']}";
        echo "- Développement: $devUrl\n";
        
        // URL de production (sous-domaine)
        $prodUrl = "https://{$data['slug']}.wozif.store";
        echo "- Production: $prodUrl\n";
        
        // Tester l'URL de développement
        echo "\n🔍 Test de l'URL de développement...\n";
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $devUrl);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_NOBODY, true);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 5);
        
        $result = curl_exec($ch);
        $devHttpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        echo "- Code HTTP: $devHttpCode\n";
        echo "- Status: " . ($devHttpCode === 200 ? "✅ Accessible" : "⚠️ Non accessible") . "\n";
        
        // Tester l'URL de production
        echo "\n🔍 Test de l'URL de production...\n";
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $prodUrl);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_NOBODY, true);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 10);
        
        $result = curl_exec($ch);
        $prodHttpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        echo "- Code HTTP: $prodHttpCode\n";
        echo "- Status: " . ($prodHttpCode === 200 ? "✅ Accessible" : "⚠️ Non accessible") . "\n";
        
        echo "\n🎯 Configuration Frontend:\n";
        echo "// frontend/src/utils/environment.ts\n";
        echo "export const BOUTIQUE_CLIENT_BASE_URL = isDevelopment \n";
        echo "  ? 'http://localhost:3000' \n";
        echo "  : 'https://wozif.store'\n\n";
        echo "export function getBoutiqueUrl(slug: string): string {\n";
        echo "  if (isDevelopment) {\n";
        echo "    return \`\${BOUTIQUE_CLIENT_BASE_URL}/\${slug}\`\n";
        echo "  }\n";
        echo "  return \`https://\${slug}.wozif.store\`\n";
        echo "}\n";
        
        echo "\n💡 Résultat:\n";
        echo "- En développement: $devUrl\n";
        echo "- En production: $prodUrl\n";
        echo "- Le bouton 'Voir la boutique' utilisera automatiquement la bonne URL\n";
        
    } else {
        echo "❌ Erreur API (Code: $httpCode)\n";
    }
    
} catch (Exception $e) {
    echo "❌ Erreur: " . $e->getMessage() . "\n";
}
