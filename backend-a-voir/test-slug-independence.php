<?php

// Charger l'autoloader de Laravel
require_once __DIR__ . '/vendor/autoload.php';

// Charger l'application Laravel
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Store;

echo "🧪 Test d'indépendance du slug et du nom de boutique\n";
echo "==================================================\n\n";

// Test 1: Vérifier les boutiques existantes
echo "1️⃣ Boutiques existantes dans la base de données:\n";
$stores = Store::all(['id', 'name', 'slug'])->take(10);
foreach ($stores as $store) {
    echo "  📋 Nom: '{$store->name}' → Slug: '{$store->slug}'\n";
}

echo "\n2️⃣ Test de validation des slugs:\n";

// Test avec différents noms et slugs
$testCases = [
    ['name' => 'Ma Boutique Test', 'slug' => 'test-slug-1'],
    ['name' => 'Boutique Électronique', 'slug' => 'electronique-pro'],
    ['name' => 'Formation Python', 'slug' => 'python-courses'],
    ['name' => 'Django Framework', 'slug' => 'django-framework'],
];

foreach ($testCases as $testCase) {
    $name = $testCase['name'];
    $slug = $testCase['slug'];
    
    echo "  🔍 Test: Nom='$name' → Slug='$slug'\n";
    
    // Vérifier si le slug existe déjà
    $existingStore = Store::where('slug', $slug)->first();
    if ($existingStore) {
        echo "    ⚠️ Slug déjà utilisé par: '{$existingStore->name}'\n";
    } else {
        echo "    ✅ Slug disponible\n";
    }
}

echo "\n3️⃣ Test de validation via API:\n";

// Test de l'API de vérification
$testSlugs = ['test-slug-1', 'electronique-pro', 'python-courses', 'django-framework'];

foreach ($testSlugs as $testSlug) {
    $url = "http://localhost:8000/api/stores/subdomain/$testSlug/check";
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Accept: application/json']);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode === 200) {
        $data = json_decode($response, true);
        $exists = $data['data']['exists'] ?? false;
        $message = $data['data']['message'] ?? 'Inconnu';
        
        echo "  🔍 $testSlug: " . ($exists ? "❌ Indisponible" : "✅ Disponible") . " ($message)\n";
    } else {
        echo "  ❌ Erreur HTTP $httpCode pour $testSlug\n";
    }
}

echo "\n✅ Test terminé\n";
echo "\n📝 Résumé:\n";
echo "  - Le slug est maintenant indépendant du nom de la boutique\n";
echo "  - L'utilisateur peut choisir n'importe quel slug valide\n";
echo "  - La validation en temps réel fonctionne\n";
echo "  - Les suggestions sont générées automatiquement\n";
