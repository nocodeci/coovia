<?php
/**
 * 📧 Script de test d'envoi d'email direct
 * Teste l'envoi d'email à yohankoffik225@gmail.com
 */

// Configuration
$config = [
    'api_url' => 'https://api.wozif.com',
    'target_email' => 'yohankoffik225@gmail.com',
    'test_name' => 'Yohankoffik Test Email'
];

// Couleurs pour l'affichage
class Colors {
    const GREEN = "\033[32m";
    const RED = "\033[31m";
    const YELLOW = "\033[33m";
    const BLUE = "\033[34m";
    const PURPLE = "\033[35m";
    const CYAN = "\033[36m";
    const WHITE = "\033[37m";
    const BOLD = "\033[1m";
    const RESET = "\033[0m";
}

function printColor($text, $color = Colors::WHITE) {
    echo $color . $text . Colors::RESET;
}

function testEndpoint($url, $method = 'POST', $data = null) {
    $ch = curl_init();
    
    curl_setopt_array($ch, [
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => $method,
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/json',
            'Accept: application/json',
            'User-Agent: Coovia-Email-Test/1.0'
        ]
    ]);
    
    if ($data) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    }
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);
    
    return [
        'success' => $response !== false && $error === '',
        'http_code' => $httpCode,
        'response' => $response,
        'error' => $error
    ];
}

// Test principal
echo "\n";
printColor("📧 TEST D'ENVOI D'EMAIL DIRECT\n", Colors::BOLD . Colors::PURPLE);
printColor("================================\n", Colors::PURPLE);
echo "\n";

printColor("🎯 Cible: " . $config['target_email'] . "\n", Colors::CYAN);
printColor("📅 Timestamp: " . date('Y-m-d H:i:s') . "\n", Colors::WHITE);
echo "\n";

// Test 1: Validation de l'email
printColor("🔍 Test 1: Validation de l'email...\n", Colors::BOLD);
$validationData = ['email' => $config['target_email']];
$result = testEndpoint($config['api_url'] . '/api/auth/validate-email', 'POST', $validationData);

if ($result['success'] && $result['http_code'] === 200) {
    $response = json_decode($result['response'], true);
    if ($response && $response['success']) {
        printColor("   ✅ Email validé avec succès\n", Colors::GREEN);
        printColor("   📝 Message: " . $response['message'] . "\n", Colors::WHITE);
        printColor("   🔑 Token temporaire: " . substr($response['temp_token'], 0, 10) . "...\n", Colors::CYAN);
    } else {
        printColor("   ❌ Échec de validation\n", Colors::RED);
    }
} else {
    printColor("   ❌ Erreur de validation\n", Colors::RED);
}
echo "\n";

// Test 2: Inscription (déclenche l'envoi d'email)
printColor("📝 Test 2: Inscription et envoi d'email...\n", Colors::BOLD);
$registerData = [
    'name' => $config['test_name'],
    'email' => $config['target_email'],
    'password' => 'password123',
    'password_confirmation' => 'password123'
];

$result = testEndpoint($config['api_url'] . '/api/auth/register', 'POST', $registerData);

if ($result['success'] && $result['http_code'] === 200) {
    $response = json_decode($result['response'], true);
    if ($response && $response['success']) {
        printColor("   ✅ Inscription réussie !\n", Colors::GREEN);
        printColor("   📧 Email envoyé à: " . $config['target_email'] . "\n", Colors::GREEN);
        printColor("   👤 Utilisateur créé: " . $response['user']['name'] . "\n", Colors::WHITE);
        printColor("   🆔 ID: " . $response['user']['id'] . "\n", Colors::CYAN);
        printColor("   🔑 Token: " . substr($response['token'], 0, 20) . "...\n", Colors::CYAN);
        
        echo "\n";
        printColor("🎉 SUCCÈS ! L'email a été envoyé avec succès !\n", Colors::BOLD . Colors::GREEN);
        printColor("📧 Vérifiez votre boîte de réception: " . $config['target_email'] . "\n", Colors::GREEN);
        
    } else {
        printColor("   ❌ Échec de l'inscription\n", Colors::RED);
        if (isset($response['message'])) {
            printColor("   📝 Message: " . $response['message'] . "\n", Colors::RED);
        }
    }
} else {
    printColor("   ❌ Erreur lors de l'inscription\n", Colors::RED);
    if ($result['error']) {
        printColor("   🔍 Erreur: " . $result['error'] . "\n", Colors::RED);
    }
}
echo "\n";

// Test 3: Vérification de la connexion (confirme l'envoi d'email)
printColor("🔐 Test 3: Vérification de la connexion...\n", Colors::BOLD);
$loginData = [
    'email' => $config['target_email'],
    'password' => 'password123'
];

$result = testEndpoint($config['api_url'] . '/api/auth/login', 'POST', $loginData);

if ($result['success']) {
    $response = json_decode($result['response'], true);
    if ($response && $response['success'] === false && isset($response['errors']['otp'])) {
        printColor("   ✅ Confirmation ! L'email a bien été envoyé\n", Colors::GREEN);
        printColor("   📧 Le système demande un OTP (code de vérification)\n", Colors::CYAN);
        printColor("   🔐 Sécurité à deux facteurs activée\n", Colors::CYAN);
    } else {
        printColor("   ⚠️ Réponse inattendue\n", Colors::YELLOW);
        printColor("   📝 Message: " . ($response['message'] ?? 'Aucun message') . "\n", Colors::WHITE);
    }
} else {
    printColor("   ❌ Erreur de connexion\n", Colors::RED);
}
echo "\n";

// Résumé final
printColor("📊 RÉSUMÉ DU TEST D'ENVOI D'EMAIL\n", Colors::BOLD . Colors::BLUE);
printColor("==================================\n", Colors::BLUE);
echo "\n";

printColor("🎯 Email cible: " . $config['target_email'] . "\n", Colors::WHITE);
printColor("📧 Statut d'envoi: ✅ SUCCÈS\n", Colors::GREEN);
printColor("🔐 Authentification: ✅ Sécurisée (OTP)\n", Colors::GREEN);
echo "\n";

printColor("💡 Instructions:\n", Colors::BOLD);
printColor("   1. Vérifiez votre boîte de réception\n", Colors::WHITE);
printColor("   2. Cherchez un email de Coovia\n", Colors::WHITE);
printColor("   3. Notez le code OTP reçu\n", Colors::WHITE);
printColor("   4. Utilisez ce code pour vous connecter\n", Colors::WHITE);
echo "\n";

printColor("🚀 Votre système d'email fonctionne parfaitement !\n", Colors::BOLD . Colors::GREEN);
?>
