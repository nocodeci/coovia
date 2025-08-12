<?php

echo "🧪 Test de l'API avec cURL\n";
echo "==========================\n\n";

// Récupérer un token d'authentification
echo "1. Récupération du token d'authentification...\n";

$loginData = [
    'email' => 'marie.diallo@gmail.com',
    'password' => 'password123'
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'http://localhost:8000/api/auth/login');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($loginData));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Accept: application/json'
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode === 200) {
    $loginResponse = json_decode($response, true);
    if (isset($loginResponse['token'])) {
        $token = $loginResponse['token'];
        echo "   ✅ Token récupéré: " . substr($token, 0, 20) . "...\n\n";
    } else {
        echo "   ❌ Token non trouvé dans la réponse\n";
        echo "   Réponse: " . $response . "\n";
        exit(1);
    }
} else {
    echo "   ❌ Erreur de connexion (HTTP $httpCode)\n";
    echo "   Réponse: " . $response . "\n";
    exit(1);
}

// Test de création de boutique
echo "2. Test de création de boutique via API...\n";

$formData = [
    'name' => 'Boutique Test cURL',
    'slug' => 'boutique-test-curl',
    'description' => 'Boutique créée via cURL',
    'productType' => 'digital',
    'productCategories' => json_encode(['formations']),
    'address[city]' => 'Abidjan',
    'contact[email]' => 'contact@boutique.com',
    'contact[phone]' => '+2250123456789',
    'settings[paymentMethods]' => json_encode(['wozif']),
    'settings[currency]' => 'XOF',
    'settings[monneroo][enabled]' => 'false',
    'settings[monneroo][secretKey]' => '',
    'settings[monneroo][environment]' => 'sandbox'
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'http://localhost:8000/api/stores/create');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($formData));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $token,
    'Content-Type: application/x-www-form-urlencoded',
    'Accept: application/json'
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "   Code HTTP: $httpCode\n";
echo "   Réponse: $response\n\n";

if ($httpCode === 200 || $httpCode === 201) {
    $responseData = json_decode($response, true);
    if ($responseData['success']) {
        echo "   ✅ Boutique créée avec succès!\n";
        echo "   - ID: {$responseData['data']['id']}\n";
        echo "   - Nom: {$responseData['data']['name']}\n";
        echo "   - Slug: {$responseData['data']['slug']}\n";
        echo "   - Domaine: {$responseData['data']['slug']}.wozif.store\n";
    } else {
        echo "   ❌ Erreur lors de la création\n";
        echo "   - Message: {$responseData['message']}\n";
        if (isset($responseData['errors'])) {
            echo "   - Erreurs:\n";
            foreach ($responseData['errors'] as $field => $errors) {
                echo "     * $field: " . implode(', ', $errors) . "\n";
            }
        }
    }
} else {
    echo "   ❌ Erreur HTTP $httpCode\n";
    echo "   Réponse: $response\n";
}

echo "\n📚 Prochaines étapes:\n";
echo "   🔄 Vérifiez les logs du backend\n";
echo "   📬 Testez l'envoi d'email\n";
echo "   🌐 Testez l'accès au sous-domaine\n\n";
