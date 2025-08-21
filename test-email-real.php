<?php

require_once 'vendor/autoload.php';

use App\Mail\StoreCreatedMail;
use Illuminate\Support\Facades\Mail;

// Démarrer Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "🧪 Test d'envoi d'email à l'adresse réelle...\n";

try {
    // Configuration email
    echo "📧 Configuration email:\n";
    echo "- MAIL_MAILER: " . config('mail.default') . "\n";
    echo "- MAIL_HOST: " . config('mail.mailers.smtp.host') . "\n";
    echo "- MAIL_PORT: " . config('mail.mailers.smtp.port') . "\n";
    echo "- MAIL_USERNAME: " . config('mail.mailers.smtp.username') . "\n";
    echo "- MAIL_FROM_ADDRESS: " . config('mail.from.address') . "\n";
    echo "- MAIL_FROM_NAME: " . config('mail.from.name') . "\n";
    
    // Test d'envoi d'email de création de boutique
    echo "\n🚀 Test d'envoi d'email de création de boutique...\n";
    
    $storeName = "Ma Boutique Test";
    $storeSlug = "ma-boutique-test-" . time();
    $paymentMethods = [
        'paydunya' => ['enabled' => true],
        'monneroo' => ['enabled' => true]
    ];
    $userName = "Yohan Koffi";
    
    // Créer l'email
    $email = new StoreCreatedMail($storeName, $storeSlug, $paymentMethods, $userName);
    
    // Envoyer l'email à l'adresse réelle
    $realEmail = 'yohankoffik225@gmail.com';
    Mail::to($realEmail)->send($email);
    
    echo "✅ Email de création de boutique envoyé avec succès!\n";
    echo "📧 Destinataire: $realEmail\n";
    echo "🏪 Boutique: $storeName\n";
    echo "🌐 Domaine: $storeSlug.wozif.store\n";
    echo "👤 Utilisateur: $userName\n";
    
    echo "\n💡 Vérifiez dans Mailtrap:\n";
    echo "🔗 https://mailtrap.io/inboxes\n";
    echo "📧 Vous devriez voir l'email de confirmation de création de boutique\n";
    
    echo "\n📱 Vérifiez aussi dans votre boîte Gmail:\n";
    echo "🔗 https://gmail.com\n";
    echo "📧 L'email devrait arriver dans quelques minutes\n";
    
    echo "\n🎉 Test terminé avec succès!\n";
    
} catch (Exception $e) {
    echo "❌ Erreur: " . $e->getMessage() . "\n";
    echo "🔍 Code d'erreur: " . $e->getCode() . "\n";
}
