<?php
/**
 * 🔍 Script de diagnostic complet des emails
 * Vérifie pourquoi l'email n'arrive pas
 */

// Configuration
$config = [
    'api_url' => 'https://api.wozif.com',
    'target_email' => 'yohankoffik225@gmail.com',
    'mailtrap_config' => [
        'host' => 'live.smtp.mailtrap.io',
        'port' => 587,
        'username' => 'smtp@mailtrap.io',
        'password' => 'c368936fe291afb61199670a97562ab5'
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
            'User-Agent: Coovia-Email-Diagnostic/1.0'
        ]
    ]);
    
    if ($data) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    }
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    $info = curl_getinfo($ch);
    curl_close($ch);
    
    return [
        'success' => $response !== false && $error === '',
        'http_code' => $httpCode,
        'response' => $response,
        'error' => $error,
        'info' => $info
    ];
}

// Test de connectivité SMTP
function testSMTPConnection() {
    global $config;
    
    printColor("🔌 Test de connectivité SMTP Mailtrap...\n", Colors::BOLD);
    
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

// Test de l'API d'envoi d'email
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
            printColor("     Token: " . substr($response['temp_token'], 0, 10) . "...\n", Colors::WHITE);
        } else {
            printColor("❌ ÉCHEC\n", Colors::RED);
        }
    } else {
        printColor("❌ ÉCHEC\n", Colors::RED);
    }
    
    // Test 2: Inscription (déclenche l'envoi)
    printColor("   📝 Test inscription... ", Colors::CYAN);
    $registerData = [
        'name' => 'Test Diagnostic',
        'email' => $config['target_email'],
        'password' => 'password123',
        'password_confirmation' => 'password123'
    ];
    
    $result = testEndpoint($config['api_url'] . '/api/auth/register', 'POST', $registerData);
    
    if ($result['success'] && $result['http_code'] === 200) {
        $response = json_decode($result['response'], true);
        if ($response && $response['success']) {
            printColor("✅ OK\n", Colors::GREEN);
            printColor("     Utilisateur créé: " . $response['user']['id'] . "\n", Colors::WHITE);
            return true;
        } else {
            printColor("❌ ÉCHEC\n", Colors::RED);
            if (isset($response['message'])) {
                printColor("     Message: " . $response['message'] . "\n", Colors::RED);
            }
        }
    } else {
        printColor("❌ ÉCHEC\n", Colors::RED);
        if ($result['error']) {
            printColor("     Erreur: " . $result['error'] . "\n", Colors::RED);
        }
    }
    
    return false;
}

// Test de la configuration Mailtrap
function testMailtrapConfig() {
    global $config;
    
    printColor("📋 Vérification de la configuration Mailtrap...\n", Colors::BOLD);
    
    $config = $config['mailtrap_config'];
    
    printColor("   🏠 Host: " . $config['host'] . "\n", Colors::WHITE);
    printColor("   🚪 Port: " . $config['port'] . "\n", Colors::WHITE);
    printColor("   👤 Username: " . $config['username'] . "\n", Colors::WHITE);
    printColor("   🔑 Password: " . substr($config['password'], 0, 8) . "...\n", Colors::WHITE);
    
    // Vérification des bonnes pratiques
    if ($config['port'] == 587) {
        printColor("   🔒 Port 587 (TLS) ✅\n", Colors::GREEN);
    } else {
        printColor("   ⚠️ Port non standard: " . $config['port'] . "\n", Colors::YELLOW);
    }
    
    if (strpos($config['host'], 'mailtrap') !== false) {
        printColor("   📧 Host Mailtrap ✅\n", Colors::GREEN);
    } else {
        printColor("   ⚠️ Host non Mailtrap\n", Colors::YELLOW);
    }
}

// Test de l'état de l'utilisateur
function checkUserStatus() {
    global $config;
    
    printColor("👤 Vérification de l'état de l'utilisateur...\n", Colors::BOLD);
    
    $result = testEndpoint($config['api_url'] . '/api/users');
    
    if ($result['success'] && $result['http_code'] === 200) {
        $response = json_decode($result['response'], true);
        if ($response && isset($response['users'])) {
            $user = null;
            foreach ($response['users'] as $u) {
                if ($u['email'] === $config['target_email']) {
                    $user = $u;
                    break;
                }
            }
            
            if ($user) {
                printColor("   ✅ Utilisateur trouvé\n", Colors::GREEN);
                printColor("     ID: " . $user['id'] . "\n", Colors::WHITE);
                printColor("     Nom: " . $user['name'] . "\n", Colors::WHITE);
                printColor("     Email: " . $user['email'] . "\n", Colors::WHITE);
                printColor("     Créé le: " . $user['created_at'] . "\n", Colors::WHITE);
                return $user;
            } else {
                printColor("   ❌ Utilisateur non trouvé\n", Colors::RED);
            }
        }
    } else {
        printColor("   ❌ Impossible de récupérer les utilisateurs\n", Colors::RED);
    }
    
    return null;
}

// Test de connexion avec OTP
function testLoginWithOTP() {
    global $config;
    
    printColor("🔐 Test de connexion (vérification OTP)...\n", Colors::BOLD);
    
    $loginData = [
        'email' => $config['target_email'],
        'password' => 'password123'
    ];
    
    $result = testEndpoint($config['api_url'] . '/api/auth/login', 'POST', $loginData);
    
    if ($result['success']) {
        $response = json_decode($result['response'], true);
        if ($response && $response['success'] === false && isset($response['errors']['otp'])) {
            printColor("   ✅ OTP requis (normal)\n", Colors::GREEN);
            printColor("     Le système attend un code OTP\n", Colors::CYAN);
            printColor("     Cela confirme que l'email a été envoyé\n", Colors::CYAN);
            return true;
        } else {
            printColor("   ⚠️ Réponse inattendue\n", Colors::YELLOW);
            printColor("     Message: " . ($response['message'] ?? 'Aucun message') . "\n", Colors::WHITE);
        }
    } else {
        printColor("   ❌ Erreur de connexion\n", Colors::RED);
    }
    
    return false;
}

// Diagnostic principal
function runDiagnostic() {
    global $config;
    
    echo "\n";
    printColor("🔍 DIAGNOSTIC COMPLET DES EMAILS\n", Colors::BOLD . Colors::PURPLE);
    printColor("==================================\n", Colors::PURPLE);
    echo "\n";
    
    printColor("🎯 Email cible: " . $config['target_email'] . "\n", Colors::CYAN);
    printColor("📅 Timestamp: " . date('Y-m-d H:i:s') . "\n", Colors::WHITE);
    echo "\n";
    
    // Test 1: Configuration Mailtrap
    testMailtrapConfig();
    echo "\n";
    
    // Test 2: Connectivité SMTP
    $smtpOK = testSMTPConnection();
    echo "\n";
    
    // Test 3: API d'envoi d'email
    $emailSent = testEmailAPI();
    echo "\n";
    
    // Test 4: État de l'utilisateur
    $user = checkUserStatus();
    echo "\n";
    
    // Test 5: Vérification OTP
    $otpRequired = testLoginWithOTP();
    echo "\n";
    
    // Résumé et diagnostic
    printColor("📊 DIAGNOSTIC FINAL\n", Colors::BOLD . Colors::BLUE);
    printColor("====================\n", Colors::BLUE);
    echo "\n";
    
    printColor("🔌 Connectivité SMTP: ", Colors::WHITE);
    printColor(($smtpOK ? "✅ OK" : "❌ ÉCHEC") . "\n", $smtpOK ? Colors::GREEN : Colors::RED);
    
    printColor("📧 Envoi d'email: ", Colors::WHITE);
    printColor(($emailSent ? "✅ OK" : "❌ ÉCHEC") . "\n", $emailSent ? Colors::GREEN : Colors::RED);
    
    printColor("👤 Utilisateur créé: ", Colors::WHITE);
    printColor(($user ? "✅ OUI" : "❌ NON") . "\n", $user ? Colors::GREEN : Colors::RED);
    
    printColor("🔐 OTP requis: ", Colors::WHITE);
    printColor(($otpRequired ? "✅ OUI" : "❌ NON") . "\n", $otpRequired ? Colors::GREEN : Colors::RED);
    
    echo "\n";
    
    // Analyse des problèmes
    printColor("💡 ANALYSE DES PROBLÈMES:\n", Colors::BOLD);
    
    if (!$smtpOK) {
        printColor("   ❌ Problème de connectivité SMTP\n", Colors::RED);
        printColor("      • Vérifiez votre connexion internet\n", Colors::WHITE);
        printColor("      • Vérifiez que le port 587 n'est pas bloqué\n", Colors::WHITE);
    }
    
    if (!$emailSent) {
        printColor("   ❌ Problème d'envoi d'email\n", Colors::RED);
        printColor("      • Vérifiez la configuration Mailtrap\n", Colors::WHITE);
        printColor("      • Vérifiez les logs Laravel\n", Colors::WHITE);
    }
    
    if (!$user) {
        printColor("   ❌ Utilisateur non créé\n", Colors::RED);
        printColor("      • Problème dans la base de données\n", Colors::WHITE);
        printColor("      • Vérifiez les migrations\n", Colors::WHITE);
    }
    
    if (!$otpRequired) {
        printColor("   ❌ OTP non requis\n", Colors::RED);
        printColor("      • L'email n'a peut-être pas été envoyé\n", Colors::WHITE);
        printColor("      • Problème de configuration OTP\n", Colors::WHITE);
    }
    
    echo "\n";
    
    // Solutions recommandées
    printColor("🚀 SOLUTIONS RECOMMANDÉES:\n", Colors::BOLD);
    
    if ($smtpOK && $emailSent && $user && $otpRequired) {
        printColor("   🎉 Tout fonctionne ! L'email a été envoyé\n", Colors::GREEN);
        printColor("   📧 Vérifiez vos spams et dossiers spéciaux\n", Colors::WHITE);
        printColor("   ⏰ Attendez quelques minutes (délai d'envoi)\n", Colors::WHITE);
    } else {
        printColor("   🔧 Vérifiez la configuration Mailtrap\n", Colors::YELLOW);
        printColor("   📝 Consultez les logs Laravel sur Forge\n", Colors::YELLOW);
        printColor("   🗄️ Vérifiez la base de données\n", Colors::YELLOW);
        printColor("   🔄 Redémarrez les services sur Forge\n", Colors::YELLOW);
    }
    
    echo "\n";
    
    return $smtpOK && $emailSent && $user && $otpRequired;
}

// Exécution du diagnostic
if (php_sapi_name() === 'cli') {
    $success = runDiagnostic();
    exit($success ? 0 : 1);
} else {
    echo "Ce script doit être exécuté en ligne de commande.\n";
    echo "Usage: php diagnostic-email.php\n";
}
?>
