<?php

echo "🧪 Test Final de Création de Boutique\n";
echo "=====================================\n\n";

$token = '58|TFcVZ6KsS2sdZYCsfMsWw5F29tRFCf9jHB8FW3Ti656b31a1';

echo "1. Test d'authentification avec le nouveau token...\n";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'http://localhost:8000/api/auth/check');
curl_setopt($ch, CURLOPT_HTTPGET, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $token,
    'Accept: application/json',
    'Content-Type: application/json'
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "   Code HTTP: $httpCode\n";
echo "   Réponse: $response\n\n";

if ($httpCode === 200) {
    echo "   ✅ Authentification réussie !\n\n";
    
    echo "2. Test de création de boutique...\n";
    
    $formData = [
        'name' => 'Ma Boutique Finale',
        'slug' => 'ma-boutique-finale',
        'description' => 'Boutique créée après reset',
        'productType' => 'digital',
        'productCategories' => json_encode(['formations']),
        'address[city]' => 'Abidjan',
        'contact[email]' => 'contact@boutique-finale.com',
        'contact[phone]' => '+2250123456789',
        'settings[paymentMethods]' => json_encode(['wozif']),
        'settings[currency]' => 'XOF',
        'settings[monneroo][enabled]' => '0',
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
            echo "   ✅ Création de boutique réussie !\n";
            echo "   - ID: {$responseData['data']['id']}\n";
            echo "   - Nom: {$responseData['data']['name']}\n";
            echo "   - Slug: {$responseData['data']['slug']}\n";
            echo "   - Domaine: {$responseData['data']['slug']}.wozif.store\n\n";
            
            echo "🎉 SUCCÈS ! Le système fonctionne parfaitement !\n\n";
            
            echo "📋 Prochaines étapes:\n";
            echo "1. Configurez le token dans le navigateur\n";
            echo "2. Testez la création via l'interface\n";
            echo "3. Vérifiez la réception de l'email\n\n";
            
        } else {
            echo "   ❌ Erreur lors de la création\n";
            echo "   - Message: {$responseData['message']}\n";
        }
    } else {
        echo "   ❌ Erreur HTTP $httpCode\n";
        echo "   Réponse: $response\n";
    }
    
} else {
    echo "   ❌ Échec de l'authentification\n";
}

echo "🔧 Token à utiliser dans le navigateur:\n";
echo "localStorage.setItem('sanctum_token', '$token');\n\n";
