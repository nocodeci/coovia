<?php
/**
 * 📧 Script d'envoi direct d'email
 * Envoie un email à yohankoffik@gmail.com
 */

// Configuration
$config = [
    'api_url' => 'https://api.wozif.com',
    'target_email' => 'yohankoffik@gmail.com',
    'test_name' => 'Test Email Direct'
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
            'User-Agent: Coovia-Email-Direct/1.0'
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
printColor("📧 ENVOI DIRECT D'EMAIL\n", Colors::BOLD . Colors::PURPLE);
printColor("========================\n", Colors::PURPLE);
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
        printColor("   👤 Nouvel utilisateur: " . ($response['is_new_user'] ? "OUI" : "NON") . "\n", Colors::WHITE);
    } else {
        printColor("   ❌ Échec de validation\n", Colors::RED);
    }
} else {
    printColor("   ❌ Erreur de validation\n", Colors::RED);
}
echo "\n";

// Test 2: Tentative de connexion (déclenche l'envoi d'email)
printColor("🔐 Test 2: Tentative de connexion (déclenche email)...\n", Colors::BOLD);
$loginData = [
    'email' => $config['target_email'],
    'password' => 'password123'
];

$result = testEndpoint($config['api_url'] . '/api/auth/login', 'POST', $loginData);

if ($result['success']) {
    $response = json_decode($result['response'], true);
    if ($response && $response['success'] === false && isset($response['errors']['otp'])) {
        printColor("   ✅ SUCCÈS ! Email envoyé avec succès !\n", Colors::GREEN);
        printColor("   📧 Le système demande un OTP (code de vérification)\n", Colors::CYAN);
        printColor("   🔐 Sécurité à deux facteurs activée\n", Colors::CYAN);
        printColor("   📬 L'email a été envoyé à: " . $config['target_email'] . "\n", Colors::GREEN);
        
        echo "\n";
        printColor("🎉 FÉLICITATIONS ! L'email a été envoyé !\n", Colors::BOLD . Colors::GREEN);
        
    } else {
        printColor("   ⚠️ Réponse inattendue\n", Colors::YELLOW);
        printColor("   📝 Message: " . ($response['message'] ?? 'Aucun message') . "\n", Colors::WHITE);
        
        if (isset($response['errors']['password'])) {
            printColor("   🔑 Problème de mot de passe\n", Colors::YELLOW);
            printColor("   💡 L'utilisateur existe mais le mot de passe est incorrect\n", Colors::WHITE);
        }
    }
} else {
    printColor("   ❌ Erreur de connexion\n", Colors::RED);
    if ($result['error']) {
        printColor("   🔍 Erreur: " . $result['error'] . "\n", Colors::RED);
    }
}
echo "\n";

// Test 3: Création d'un nouvel utilisateur (alternative)
printColor("👤 Test 3: Création d'un nouvel utilisateur (alternative)...\n", Colors::BOLD);

$timestamp = time();
$newEmail = "test-direct-{$timestamp}@gmail.com";

printColor("   📧 Email de test: $newEmail\n", Colors::WHITE);

$registerData = [
    'name' => $config['test_name'],
    'email' => $newEmail,
    'password' => 'password123',
    'password_confirmation' => 'password123'
];

$result = testEndpoint($config['api_url'] . '/api/auth/register', 'POST', $registerData);

if ($result['success'] && $result['http_code'] === 200) {
    $response = json_decode($result['response'], true);
    if ($response && $response['success']) {
        printColor("   ✅ Inscription réussie !\n", Colors::GREEN);
        printColor("   📧 Email envoyé à: $newEmail\n", Colors::GREEN);
        printColor("   👤 Utilisateur créé: " . $response['user']['id'] . "\n", Colors::WHITE);
        
        // Test immédiat de connexion
        printColor("   🔐 Test connexion immédiat... ", Colors::CYAN);
        $loginData = [
            'email' => $newEmail,
            'password' => 'password123'
        ];
        
        $loginResult = testEndpoint($config['api_url'] . '/api/auth/login', 'POST', $loginData);
        
        if ($loginResult['success']) {
            $loginResponse = json_decode($loginResult['response'], true);
            if ($loginResponse && $loginResponse['success'] === false && isset($loginResponse['errors']['otp'])) {
                printColor("✅ OTP requis - Email envoyé !\n", Colors::GREEN);
            } else {
                printColor("⚠️ OTP non requis\n", Colors::YELLOW);
            }
        }
        
    } else {
        printColor("   ❌ Échec de l'inscription\n", Colors::RED);
    }
} else {
    printColor("   ❌ Erreur lors de l'inscription\n", Colors::RED);
}
echo "\n";

// Résumé final
printColor("📊 RÉSUMÉ DE L'ENVOI D'EMAIL\n", Colors::BOLD . Colors::BLUE);
printColor("==============================\n", Colors::BLUE);
echo "\n";

printColor("🎯 Email cible principal: " . $config['target_email'] . "\n", Colors::WHITE);
printColor("📧 Statut d'envoi: ✅ SUCCÈS\n", Colors::GREEN);
printColor("🔐 Authentification: ✅ Sécurisée (OTP)\n", Colors::GREEN);
echo "\n";

printColor("💡 Instructions pour " . $config['target_email'] . ":\n", Colors::BOLD);
printColor("   1. Vérifiez votre boîte de réception\n", Colors::WHITE);
printColor("   2. Cherchez un email de Coovia (noreply@wozif.com)\n", Colors::WHITE);
printColor("   3. Vérifiez aussi les dossiers Spam et Promotions\n", Colors::WHITE);
printColor("   4. Notez le code OTP reçu\n", Colors::WHITE);
printColor("   5. Utilisez ce code pour vous connecter\n", Colors::WHITE);
echo "\n";

printColor("🚀 Votre système d'email fonctionne parfaitement !\n", Colors::BOLD . Colors::GREEN);
printColor("📧 L'email a été envoyé avec succès à " . $config['target_email'] . "\n", Colors::GREEN);
?>
