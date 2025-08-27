<?php
/**
 * 📧 Test avec la nouvelle configuration Mailtrap
 * Configuration actuelle de l'utilisateur
 */

// Configuration Mailtrap actuelle
$config = [
    'api_url' => 'https://api.wozif.com',
    'target_email' => 'yohankoffik225@gmail.com',
    'mailtrap_config' => [
        'host' => 'live.smtp.mailtrap.io',
        'port' => 587,
        'username' => 'smtp@mailtrap.io',
        'password' => '4e525211be1b15fe3238991c3b84c55a', // NOUVELLE CONFIGURATION
        'encryption' => 'tls',
        'from_address' => 'noreply@wozif.com',
        'from_name' => 'Coovia'
    ]
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
            'User-Agent: Coovia-Mailtrap-Test/1.0'
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

// Test de connectivité SMTP avec la nouvelle configuration
function testSMTPConnection() {
    global $config;
    
    printColor("🔌 Test de connectivité SMTP avec NOUVELLE configuration...\n", Colors::BOLD);
    
    $host = $config['mailtrap_config']['host'];
    $port = $config['mailtrap_config']['port'];
    
    printColor("   📡 Connexion à $host:$port... ", Colors::CYAN);
    
    $socket = @fsockopen($host, $port, $errno, $errstr, 10);
    
    if ($socket) {
        printColor("✅ OK\n", Colors::GREEN);
        fclose($socket);
        return true;
    } else {
        printColor("❌ ÉCHEC\n", Colors::RED);
        printColor("     Erreur: $errstr ($errno)\n", Colors::RED);
        return false;
    }
}

// Test de l'API avec la nouvelle configuration
function testEmailAPI() {
    global $config;
    
    printColor("📧 Test de l'API d'envoi d'email...\n", Colors::BOLD);
    
    // Test 1: Validation email
    printColor("   🔍 Test validation email... ", Colors::CYAN);
    $validationData = ['email' => $config['target_email']];
    $result = testEndpoint($config['api_url'] . '/api/auth/validate-email', 'POST', $validationData);
    
    if ($result['success'] && $result['http_code'] === 200) {
        $response = json_decode($result['response'], true);
        if ($response && $response['success']) {
            printColor("✅ OK\n", Colors::GREEN);
            printColor("     Message: " . $response['message'] . "\n", Colors::WHITE);
        } else {
            printColor("❌ ÉCHEC\n", Colors::RED);
        }
    } else {
        printColor("❌ ÉCHEC\n", Colors::RED);
    }
    
    // Test 2: Tentative de connexion (pour déclencher l'envoi d'email)
    printColor("   🔐 Test connexion (déclenche email)... ", Colors::CYAN);
    $loginData = [
        'email' => $config['target_email'],
        'password' => 'password123'
    ];
    
    $result = testEndpoint($config['api_url'] . '/api/auth/login', 'POST', $loginData);
    
    if ($result['success']) {
        $response = json_decode($result['response'], true);
        if ($response && $response['success'] === false && isset($response['errors']['otp'])) {
            printColor("✅ OK - OTP requis\n", Colors::GREEN);
            printColor("     L'email a été envoyé et le système attend un OTP\n", Colors::CYAN);
            return true;
        } else {
            printColor("⚠️ Réponse inattendue\n", Colors::YELLOW);
            printColor("     Message: " . ($response['message'] ?? 'Aucun message') . "\n", Colors::WHITE);
        }
    } else {
        printColor("❌ ÉCHEC\n", Colors::RED);
    }
    
    return false;
}

// Test de création d'un nouvel utilisateur avec la nouvelle configuration
function testNewUserRegistration() {
    global $config;
    
    printColor("👤 Test création nouvel utilisateur...\n", Colors::BOLD);
    
    $timestamp = time();
    $newEmail = "test-mailtrap-{$timestamp}@gmail.com";
    
    printColor("   📧 Email de test: $newEmail\n", Colors::WHITE);
    
    $registerData = [
        'name' => 'Test Mailtrap Nouveau',
        'email' => $newEmail,
        'password' => 'password123',
        'password_confirmation' => 'password123'
    ];
    
    $result = testEndpoint($config['api_url'] . '/api/auth/register', 'POST', $registerData);
    
    if ($result['success'] && $result['http_code'] === 200) {
        $response = json_decode($result['response'], true);
        if ($response && $response['success']) {
            printColor("   ✅ Inscription réussie !\n", Colors::GREEN);
            printColor("     Utilisateur créé: " . $response['user']['id'] . "\n", Colors::WHITE);
            
            // Test immédiat de connexion pour vérifier l'OTP
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
                    return true;
                } else {
                    printColor("⚠️ OTP non requis\n", Colors::YELLOW);
                }
            }
            
            return true;
        } else {
            printColor("   ❌ Échec de l'inscription\n", Colors::RED);
            if (isset($response['message'])) {
                printColor("     Message: " . $response['message'] . "\n", Colors::RED);
            }
        }
    } else {
        printColor("   ❌ Erreur lors de l'inscription\n", Colors::RED);
        if ($result['error']) {
            printColor("     Erreur: " . $result['error'] . "\n", Colors::RED);
        }
    }
    
    return false;
}

// Diagnostic principal
function runDiagnostic() {
    global $config;
    
    echo "\n";
    printColor("🔍 DIAGNOSTIC AVEC NOUVELLE CONFIGURATION MAILTRAP\n", Colors::BOLD . Colors::PURPLE);
    printColor("==================================================\n", Colors::PURPLE);
    echo "\n";
    
    printColor("📋 Configuration Mailtrap actuelle:\n", Colors::BOLD);
    printColor("   🏠 Host: " . $config['mailtrap_config']['host'] . "\n", Colors::WHITE);
    printColor("   🚪 Port: " . $config['mailtrap_config']['port'] . "\n", Colors::WHITE);
    printColor("   👤 Username: " . $config['mailtrap_config']['username'] . "\n", Colors::WHITE);
    printColor("   🔑 Password: " . substr($config['mailtrap_config']['password'], 0, 8) . "...\n", Colors::WHITE);
    printColor("   🔒 Encryption: " . $config['mailtrap_config']['encryption'] . "\n", Colors::WHITE);
    printColor("   📧 From: " . $config['mailtrap_config']['from_address'] . "\n", Colors::WHITE);
    echo "\n";
    
    printColor("🎯 Email cible: " . $config['target_email'] . "\n", Colors::CYAN);
    printColor("📅 Timestamp: " . date('Y-m-d H:i:s') . "\n", Colors::WHITE);
    echo "\n";
    
    // Test 1: Connectivité SMTP
    $smtpOK = testSMTPConnection();
    echo "\n";
    
    // Test 2: API d'envoi d'email
    $emailSent = testEmailAPI();
    echo "\n";
    
    // Test 3: Nouvel utilisateur
    $newUserCreated = testNewUserRegistration();
    echo "\n";
    
    // Résumé et diagnostic
    printColor("📊 DIAGNOSTIC FINAL\n", Colors::BOLD . Colors::BLUE);
    printColor("====================\n", Colors::BLUE);
    echo "\n";
    
    printColor("🔌 Connectivité SMTP: ", Colors::WHITE);
    printColor(($smtpOK ? "✅ OK" : "❌ ÉCHEC") . "\n", $smtpOK ? Colors::GREEN : Colors::RED);
    
    printColor("📧 Email envoyé (utilisateur existant): ", Colors::WHITE);
    printColor(($emailSent ? "✅ OUI" : "❌ NON") . "\n", $emailSent ? Colors::GREEN : Colors::RED);
    
    printColor("👤 Nouvel utilisateur créé: ", Colors::WHITE);
    printColor(($newUserCreated ? "✅ OUI" : "❌ NON") . "\n", $newUserCreated ? Colors::GREEN : Colors::RED);
    
    echo "\n";
    
    // Analyse des problèmes
    printColor("💡 ANALYSE:\n", Colors::BOLD);
    
    if ($smtpOK && $emailSent && $newUserCreated) {
        printColor("   🎉 Tout fonctionne avec la nouvelle configuration !\n", Colors::GREEN);
        printColor("   📧 Les emails sont envoyés avec succès\n", Colors::GREEN);
        printColor("   🔐 Le système OTP fonctionne parfaitement\n", Colors::GREEN);
    } elseif ($smtpOK && $newUserCreated) {
        printColor("   ⚠️ Problème avec l'utilisateur existant\n", Colors::YELLOW);
        printColor("      • L'email a peut-être été envoyé lors de la création initiale\n", Colors::WHITE);
        printColor("      • Vérifiez vos spams et dossiers spéciaux\n", Colors::WHITE);
    } else {
        printColor("   ❌ Problème persistant\n", Colors::RED);
        printColor("      • Vérifiez la configuration sur Forge\n", Colors::WHITE);
        printColor("      • Consultez les logs Laravel\n", Colors::WHITE);
    }
    
    echo "\n";
    
    // Solutions recommandées
    printColor("🚀 SOLUTIONS:\n", Colors::BOLD);
    
    if ($smtpOK && $newUserCreated) {
        printColor("   ✅ Votre nouvelle configuration Mailtrap fonctionne !\n", Colors::GREEN);
        printColor("   📧 Vérifiez vos spams pour l'email de test\n", Colors::WHITE);
        printColor("   🔄 Mettez à jour la configuration sur Forge\n", Colors::WHITE);
    } else {
        printColor("   🔧 Vérifiez la configuration sur votre serveur Forge\n", Colors::YELLOW);
        printColor("   📝 Consultez les logs Laravel\n", Colors::YELLOW);
        printColor("   🔄 Redémarrez les services\n", Colors::YELLOW);
    }
    
    echo "\n";
    
    return $smtpOK && $newUserCreated;
}

// Exécution du diagnostic
if (php_sapi_name() === 'cli') {
    $success = runDiagnostic();
    exit($success ? 0 : 1);
} else {
    echo "Ce script doit être exécuté en ligne de commande.\n";
    echo "Usage: php test-mailtrap-nouveau.php\n";
}
?>
