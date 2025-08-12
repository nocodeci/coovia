<?php

// Charger le fichier .env
$envFile = __DIR__ . '/.env';
if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos($line, '=') !== false && strpos($line, '#') !== 0) {
            list($key, $value) = explode('=', $line, 2);
            $_ENV[trim($key)] = trim($value);
        }
    }
}

echo "🧪 Test complet de création de sous-domaines\n";
echo "==========================================\n\n";

$vercelToken = $_ENV['VERCEL_TOKEN'] ?? null;
$vercelProjectId = $_ENV['VERCEL_PROJECT_ID'] ?? null;
$vercelDomain = $_ENV['VERCEL_DOMAIN'] ?? null;

if (!$vercelToken || !$vercelProjectId || !$vercelDomain) {
    echo "❌ Configuration incomplète\n";
    exit(1);
}

// Test 1: Création d'un sous-domaine avec un slug simple
echo "1️⃣ Test de création avec slug simple: 'nocodeci'\n";

$testSlug = 'nocodeci';
$subdomain = $testSlug . '.' . $vercelDomain;

$url = "https://api.vercel.com/v1/projects/{$vercelProjectId}/domains";
$headers = [
    'Authorization: Bearer ' . $vercelToken,
    'Content-Type: application/json'
];

$data = [
    'name' => $subdomain,
    'projectId' => $vercelProjectId
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "  📡 Code HTTP: $httpCode\n";
echo "  📄 Réponse: $response\n";

if ($httpCode === 200 || $httpCode === 201) {
    echo "  ✅ Sous-domaine créé avec succès!\n";
    echo "  🌐 URL: https://$subdomain\n";
    
    // Vérifier que le sous-domaine existe
    echo "\n2️⃣ Vérification de l'existence...\n";
    
    $checkUrl = "https://api.vercel.com/v1/projects/{$vercelProjectId}/domains/{$subdomain}";
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $checkUrl);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode === 200) {
        echo "  ✅ Sous-domaine confirmé dans Vercel\n";
        $data = json_decode($response, true);
        echo "  📋 Nom: " . ($data['name'] ?? 'Inconnu') . "\n";
        echo "  📋 Créé le: " . (isset($data['createdAt']) ? date('Y-m-d H:i:s', $data['createdAt'] / 1000) : 'Inconnu') . "\n";
    } else {
        echo "  ⚠️ Sous-domaine non trouvé (HTTP $httpCode)\n";
    }
    
    // Supprimer le sous-domaine de test
    echo "\n3️⃣ Nettoyage - Suppression du sous-domaine...\n";
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $checkUrl);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'DELETE');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode === 200 || $httpCode === 204) {
        echo "  ✅ Sous-domaine supprimé avec succès\n";
    } else {
        echo "  ⚠️ Erreur lors de la suppression (HTTP $httpCode)\n";
    }
    
} else {
    echo "  ❌ Erreur lors de la création\n";
    $errorData = json_decode($response, true);
    if (isset($errorData['error'])) {
        echo "  📝 Erreur: " . ($errorData['error']['message'] ?? 'Erreur inconnue') . "\n";
    }
}

echo "\n✅ Test terminé\n";
echo "\n📝 Maintenant vous pouvez créer des boutiques via l'interface web\n";
echo "🔍 Les sous-domaines seront créés exactement comme vous les saisissez\n";
echo "🌐 Exemple: 'nocodeci' → nocodeci.wozif.store\n";
