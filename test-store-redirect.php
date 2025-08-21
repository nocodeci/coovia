<?php

require_once 'vendor/autoload.php';

// Démarrer Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Store;

echo "🧪 Test de redirection vers la boutique...\n";

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
        
        // Générer l'URL de la boutique
        $boutiqueUrl = "https://{$data['slug']}.wozif.store";
        echo "\n🌐 URL de la boutique:\n";
        echo "- URL: $boutiqueUrl\n";
        
        // Vérifier si le sous-domaine existe sur Vercel
        echo "\n🔍 Vérification du sous-domaine sur Vercel...\n";
        $vercelUrl = "https://{$data['slug']}.wozif.store";
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $vercelUrl);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_NOBODY, true);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 10);
        
        $result = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        echo "- Code HTTP: $httpCode\n";
        
        if ($httpCode === 200) {
            echo "✅ Sous-domaine accessible sur Vercel\n";
        } elseif ($httpCode === 404) {
            echo "⚠️ Sous-domaine non trouvé sur Vercel (404)\n";
        } else {
            echo "❌ Erreur lors de l'accès au sous-domaine (Code: $httpCode)\n";
        }
        
        echo "\n🎯 Flux de redirection:\n";
        echo "1. ✅ Boutique trouvée en base de données\n";
        echo "2. ✅ API /api/boutique/slug/{id} fonctionne\n";
        echo "3. ✅ Slug récupéré: {$data['slug']}\n";
        echo "4. ✅ URL générée: $boutiqueUrl\n";
        echo "5. " . ($httpCode === 200 ? "✅" : "⚠️") . " Sous-domaine accessible sur Vercel\n";
        
        echo "\n💡 Pour tester dans le frontend:\n";
        echo "- Cliquez sur le bouton 'Voir la boutique'\n";
        echo "- Cela devrait ouvrir: $boutiqueUrl\n";
        
    } else {
        echo "❌ Erreur API (Code: $httpCode)\n";
    }
    
} catch (Exception $e) {
    echo "❌ Erreur: " . $e->getMessage() . "\n";
}
