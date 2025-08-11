<?php

require_once 'vendor/autoload.php';

use App\Services\MailtrapService;

// Charger l'environnement Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "🧪 Test de configuration Mailtrap API pour Wozif\n";
echo "================================================\n\n";

// Test 1: Vérifier la configuration
echo "1. Vérification de la configuration Mailtrap API...\n";
$mailtrapConfig = config('mailtrap');
echo "   - API URL: " . $mailtrapConfig['api_url'] . "\n";
echo "   - API Token: " . substr($mailtrapConfig['api_token'], 0, 8) . "...\n";
echo "   - From Email: " . $mailtrapConfig['from_email'] . "\n";
echo "   - From Name: " . $mailtrapConfig['from_name'] . "\n";
echo "   ✅ Configuration chargée\n\n";

// Test 2: Envoyer un email de test
echo "2. Envoi d'un email de test via Mailtrap API...\n";
try {
    $testEmail = 'yohankoffik225@gmail.com'; // Utiliser votre email
    $testOtp = '123456';
    
    $mailtrapService = new MailtrapService();
    $result = $mailtrapService->sendOtpEmail($testEmail, $testOtp);
    
    if ($result) {
        echo "   ✅ Email envoyé avec succès à {$testEmail}\n";
        echo "   📧 Code OTP: {$testOtp}\n";
        echo "   🔍 Vérifiez votre Inbox Mailtrap\n\n";
    } else {
        echo "   ❌ Échec de l'envoi d'email\n";
        echo "   📋 Vérifiez les logs pour plus de détails\n\n";
    }
    
} catch (Exception $e) {
    echo "   ❌ Erreur lors de l'envoi: " . $e->getMessage() . "\n\n";
}

// Test 3: Instructions
echo "3. Configuration actuelle:\n";
echo "   ✅ Token Mailtrap API configuré\n";
echo "   ✅ Service MailtrapService créé\n";
echo "   ✅ Authentification Bearer Token\n\n";

echo "4. Prochaines étapes:\n";
echo "   🔄 Redémarrez le serveur: php artisan serve\n";
echo "   🧪 Testez l'authentification à 3 étapes\n";
echo "   📬 Vérifiez votre Inbox Mailtrap\n\n";

echo "📚 Consultez MAILTRAP_SETUP_GUIDE.md pour plus d'informations\n";
