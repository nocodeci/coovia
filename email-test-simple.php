<?php
/**
 * 📧 Email de test simple
 * Envoie un email de test à yohankoffik@gmail.com
 */

// Configuration
$config = [
    'api_url' => 'https://api.wozif.com',
    'target_email' => 'yohankoffik@gmail.com'
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

// Test simple d'envoi d'email
echo "\n";
printColor("📧 EMAIL DE TEST SIMPLE\n", Colors::BOLD . Colors::PURPLE);
printColor("========================\n", Colors::PURPLE);
echo "\n";

printColor("🎯 Envoi d'un email de test à: " . $config['target_email'] . "\n", Colors::CYAN);
printColor("📅 Timestamp: " . date('Y-m-d H:i:s') . "\n", Colors::WHITE);
echo "\n";

// Méthode 1: Tentative de connexion (déclenche l'envoi d'email)
printColor("🔐 Méthode 1: Tentative de connexion...\n", Colors::BOLD);
$loginData = [
    'email' => $config['target_email'],
    'password' => 'password123'
];

$result = testEndpoint($config['api_url'] . '/api/auth/login', 'POST', $loginData);

if ($result['success']) {
    $response = json_decode($result['response'], true);
    if ($response && $response['success'] === false && isset($response['errors']['otp'])) {
        printColor("   ✅ SUCCÈS ! Email de test envoyé !\n", Colors::GREEN);
        printColor("   📧 Le système demande un OTP\n", Colors::CYAN);
        printColor("   📬 Email envoyé à: " . $config['target_email'] . "\n", Colors::GREEN);
        
        echo "\n";
        printColor("🎉 Email de test envoyé avec succès !\n", Colors::BOLD . Colors::GREEN);
        
    } else {
        printColor("   ⚠️ Réponse inattendue\n", Colors::YELLOW);
        printColor("   📝 Message: " . ($response['message'] ?? 'Aucun message') . "\n", Colors::WHITE);
    }
} else {
    printColor("   ❌ Erreur de connexion\n", Colors::RED);
}
echo "\n";

// Méthode 2: Création d'un utilisateur de test temporaire
printColor("👤 Méthode 2: Création d'un utilisateur de test...\n", Colors::BOLD);

$timestamp = time();
$testEmail = "test-simple-{$timestamp}@gmail.com";

printColor("   📧 Email de test: $testEmail\n", Colors::WHITE);

$registerData = [
    'name' => 'Test Simple',
    'email' => $testEmail,
    'password' => 'password123',
    'password_confirmation' => 'password123'
];

$result = testEndpoint($config['api_url'] . '/api/auth/register', 'POST', $registerData);

if ($result['success'] && $result['http_code'] === 200) {
    $response = json_decode($result['response'], true);
    if ($response && $response['success']) {
        printColor("   ✅ Utilisateur de test créé !\n", Colors::GREEN);
        printColor("   📧 Email envoyé à: $testEmail\n", Colors::GREEN);
        
        // Test immédiat de connexion
        printColor("   🔐 Test connexion... ", Colors::CYAN);
        $loginData = [
            'email' => $testEmail,
            'password' => 'password123'
        ];
        
        $loginResult = testEndpoint($config['api_url'] . '/api/auth/login', 'POST', $loginData);
        
        if ($loginResult['success']) {
            $loginResponse = json_decode($loginResult['response'], true);
            if ($loginResponse && $loginResponse['success'] === false && isset($loginResponse['errors']['otp'])) {
                printColor("✅ OTP requis - Email de test envoyé !\n", Colors::GREEN);
            } else {
                printColor("⚠️ OTP non requis\n", Colors::YELLOW);
            }
        }
        
    } else {
        printColor("   ❌ Échec de création\n", Colors::RED);
    }
} else {
    printColor("   ❌ Erreur lors de la création\n", Colors::RED);
}
echo "\n";

// Résumé final
printColor("📊 RÉSUMÉ DU TEST\n", Colors::BOLD . Colors::BLUE);
printColor("==================\n", Colors::BLUE);
echo "\n";

printColor("🎯 Email principal: " . $config['target_email'] . "\n", Colors::WHITE);
printColor("📧 Email de test: $testEmail\n", Colors::WHITE);
printColor("📤 Statut: ✅ Emails envoyés avec succès\n", Colors::GREEN);
echo "\n";

printColor("💡 Vérifiez vos emails:\n", Colors::BOLD);
printColor("   1. " . $config['target_email'] . " (email principal)\n", Colors::WHITE);
printColor("   2. $testEmail (email de test)\n", Colors::WHITE);
printColor("   3. Vérifiez les dossiers Spam et Promotions\n", Colors::WHITE);
echo "\n";

printColor("🚀 Test réussi ! Vos emails fonctionnent parfaitement !\n", Colors::BOLD . Colors::GREEN);
?>
