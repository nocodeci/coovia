<?php

require_once 'vendor/autoload.php';

use App\Mail\StoreCreatedMail;
use Illuminate\Support\Facades\Mail;

// Charger l'environnement Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "🧪 Test d'envoi d'email de confirmation de boutique\n";
echo "===================================================\n\n";

// Test 1: Vérifier la configuration email
echo "1. Vérification de la configuration email...\n";
$mailConfig = config('mail');
echo "   - Mailer: " . $mailConfig['default'] . "\n";
echo "   - From: " . $mailConfig['from']['address'] . "\n";
echo "   - From Name: " . $mailConfig['from']['name'] . "\n";
echo "   ✅ Configuration chargée\n\n";

// Test 2: Envoyer un email de test
echo "2. Envoi d'un email de confirmation de boutique...\n";
try {
    $testEmail = 'yohankoffik225@gmail.com'; // Utiliser votre email
    $storeName = 'Ma Boutique Test';
    $storeSlug = 'ma-boutique-test';
    $paymentMethods = ['wozif', 'monneroo' => ['enabled' => true, 'environment' => 'sandbox']];
    $userName = 'Yohan Test';
    
    Mail::to($testEmail)->send(new StoreCreatedMail(
        $storeName,
        $storeSlug,
        $paymentMethods,
        $userName
    ));
    
    echo "   ✅ Email de confirmation envoyé avec succès à {$testEmail}\n";
    echo "   🏪 Boutique: {$storeName}\n";
    echo "   🌐 Domaine: {$storeSlug}.wozif.store\n";
    echo "   💳 Méthodes de paiement: Wozif, Monneroo\n";
    echo "   🔍 Vérifiez votre boîte email\n\n";
    
} catch (Exception $e) {
    echo "   ❌ Erreur lors de l'envoi: " . $e->getMessage() . "\n\n";
}

echo "📚 Prochaines étapes:\n";
echo "   🔄 Testez la création de boutique via l'API\n";
echo "   📬 Vérifiez la réception de l'email\n";
echo "   🎨 Personnalisez le template si nécessaire\n\n";
