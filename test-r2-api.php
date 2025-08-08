<?php

// Test de l'API Laravel R2
$apiUrl = 'http://localhost:8000/api/files/upload';

echo "🧪 Test de l'API Laravel R2...\n";

// Créer un fichier de test
$testFile = 'test-image.jpg';
file_put_contents($testFile, 'Test image content');

// Test d'upload via API
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $apiUrl);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, [
    'file' => new CURLFile($testFile),
    'path' => 'test'
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "📤 Test d'upload API...\n";
echo "📊 Code HTTP: " . $httpCode . "\n";
echo "📄 Réponse: " . $response . "\n";

// Nettoyer
unlink($testFile);

if ($httpCode === 200) {
    echo "✅ API R2 fonctionne correctement!\n";
} else {
    echo "❌ Erreur API R2\n";
}
