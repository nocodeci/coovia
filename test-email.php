<?php

require_once 'vendor/autoload.php';

use App\Mail\StoreCreatedMail;
use Illuminate\Support\Facades\Mail;

// Démarrer Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "🧪 Test d'envoi d'email...\n";

try {
    // Configuration email
    echo "📧 Configuration email:\n";
    echo "- MAIL_MAILER: " . config('mail.default') . "\n";
    echo "- MAIL_HOST: " . config('mail.mailers.smtp.host') . "\n";
    echo "- MAIL_PORT: " . config('mail.mailers.smtp.port') . "\n";
    echo "- MAIL_USERNAME: " . config('mail.mailers.smtp.username') . "\n";
    echo "- MAIL_FROM_ADDRESS: " . config('mail.from.address') . "\n";
    echo "- MAIL_FROM_NAME: " . config('mail.from.name') . "\n";
    
    // Test d'envoi d'email
    echo "\n🚀 Test d'envoi d'email de création de boutique...\n";
    
    $storeName = "Boutique de Test";
    $storeSlug = "test-boutique-" . time();
    $paymentMethods = [
        'paydunya' => ['enabled' => true],
        'monneroo' => ['enabled' => false]
    ];
    $userName = "Utilisateur Test";
    
    // Créer l'email
    $email = new StoreCreatedMail($storeName, $storeSlug, $paymentMethods, $userName);
    
    // Envoyer l'email
    Mail::to('test@example.com')->send($email);
    
    echo "✅ Email envoyé avec succès!\n";
    echo "📧 Destinataire: test@example.com\n";
    echo "🏪 Boutique: $storeName\n";
    echo "🌐 Domaine: $storeSlug.wozif.store\n";
    
    echo "\n💡 Vérifiez dans Mailtrap:\n";
    echo "🔗 https://mailtrap.io/inboxes\n";
    
} catch (Exception $e) {
    echo "❌ Erreur: " . $e->getMessage() . "\n";
    echo "🔍 Code d'erreur: " . $e->getCode() . "\n";
    echo "📋 Trace: " . $e->getTraceAsString() . "\n";
}
