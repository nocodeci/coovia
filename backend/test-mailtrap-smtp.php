<?php

require_once 'vendor/autoload.php';

use App\Mail\OtpMail;
use Illuminate\Support\Facades\Mail;

// Charger l'environnement Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "🧪 Test de configuration Mailtrap SMTP pour Wozif\n";
echo "=================================================\n\n";

// Test 1: Vérifier la configuration
echo "1. Vérification de la configuration Mailtrap SMTP...\n";
$mailConfig = config('mail');
echo "   - Host: " . $mailConfig['mailers']['smtp']['host'] . "\n";
echo "   - Port: " . $mailConfig['mailers']['smtp']['port'] . "\n";
echo "   - Username: " . $mailConfig['mailers']['smtp']['username'] . "\n";
echo "   - Password: " . substr($mailConfig['mailers']['smtp']['password'], 0, 8) . "...\n";
echo "   - Encryption: " . ($mailConfig['mailers']['smtp']['encryption'] ?? 'null') . "\n";
echo "   - From: " . $mailConfig['from']['address'] . "\n";
echo "   ✅ Configuration chargée\n\n";

// Test 2: Envoyer un email de test
echo "2. Envoi d'un email de test via SMTP...\n";
try {
    $testEmail = 'yohankoffik225@gmail.com';
    $testOtp = '123456';
    
    Mail::to($testEmail)->send(new OtpMail($testOtp, $testEmail));
    
    echo "   ✅ Email envoyé avec succès à {$testEmail}\n";
    echo "   📧 Code OTP: {$testOtp}\n";
    echo "   🔍 Vérifiez votre Inbox Mailtrap\n\n";
    
} catch (Exception $e) {
    echo "   ❌ Erreur lors de l'envoi: " . $e->getMessage() . "\n\n";
}

echo "📚 Consultez MAILTRAP_SETUP_GUIDE.md pour plus d'informations\n";
