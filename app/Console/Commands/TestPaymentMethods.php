<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\SmartPaymentService;
use App\Services\PaydunyaOfficialService;
use App\Services\PawapayService;

class TestPaymentMethods extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'payment:test-methods {--method=all} {--country=CI}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Tester chaque méthode de paiement individuellement';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info("🧪 TEST DES MÉTHODES DE PAIEMENT");
        $this->info("================================\n");

        $country = $this->option('country');
        $method = $this->option('method');

        $paymentProviders = config('payment-providers');
        $methods = $paymentProviders['providers'][$country] ?? [];

        if ($method === 'all') {
            $this->testAllMethods($methods, $country);
        } else {
            $this->testSpecificMethod($method, $methods, $country);
        }

        return 0;
    }

    private function testAllMethods($methods, $country)
    {
        $this->info("Test de toutes les méthodes pour $country:\n");

        foreach ($methods as $methodKey => $config) {
            if (!$config['enabled']) {
                $this->warn("⚠️  $methodKey: Désactivée");
                continue;
            }

            $this->info("🔍 Test de $methodKey:");
            $this->line("   Provider principal: " . $config['primary']);
            $this->line("   Provider fallback: " . ($config['fallback'] ?? 'Aucun'));

            // Test avec le provider principal
            $result = $this->testPaymentMethod($methodKey, $config['primary'], $country);
            
            if ($result['success']) {
                $this->info("   ✅ $methodKey avec " . $config['primary'] . ": SUCCÈS");
            } else {
                $this->error("   ❌ $methodKey avec " . $config['primary'] . ": ÉCHEC");
                $this->line("      Erreur: " . $result['error']);

                // Test avec le fallback si disponible
                if ($config['fallback']) {
                    $this->line("   🔄 Tentative avec fallback: " . $config['fallback']);
                    $fallbackResult = $this->testPaymentMethod($methodKey, $config['fallback'], $country);
                    
                    if ($fallbackResult['success']) {
                        $this->info("   ✅ $methodKey avec " . $config['fallback'] . " (fallback): SUCCÈS");
                    } else {
                        $this->error("   ❌ $methodKey avec " . $config['fallback'] . " (fallback): ÉCHEC");
                        $this->line("      Erreur: " . $fallbackResult['error']);
                    }
                }
            }

            $this->line("");
        }
    }

    private function testSpecificMethod($method, $methods, $country)
    {
        if (!isset($methods[$method])) {
            $this->error("❌ Méthode $method non trouvée pour $country");
            return;
        }

        $config = $methods[$method];
        
        if (!$config['enabled']) {
            $this->error("❌ Méthode $method est désactivée");
            return;
        }

        $this->info("🔍 Test spécifique de $method:");
        $this->line("   Provider principal: " . $config['primary']);
        $this->line("   Provider fallback: " . ($config['fallback'] ?? 'Aucun'));

        $result = $this->testPaymentMethod($method, $config['primary'], $country);
        
        if ($result['success']) {
            $this->info("   ✅ SUCCÈS");
            $this->line("   Détails: " . json_encode($result, JSON_PRETTY_PRINT));
        } else {
            $this->error("   ❌ ÉCHEC");
            $this->line("   Erreur: " . $result['error']);
        }
    }

    private function testPaymentMethod($method, $provider, $country)
    {
        $testData = [
            'amount' => 1000,
            'currency' => 'XOF',
            'phone_number' => '0123456789',
            'country' => $country,
            'payment_method' => $method,
            'customer_name' => 'Test User',
            'customer_email' => 'test@example.com',
            'order_id' => 'TEST-' . time(),
            'customer_message' => 'Test de paiement'
        ];

        try {
            switch ($provider) {
                case 'paydunya':
                    return $this->testPaydunya($testData, $method);
                
                case 'pawapay':
                    return $this->testPawapay($testData, $method);
                
                default:
                    return [
                        'success' => false,
                        'error' => "Provider non supporté: $provider"
                    ];
            }
        } catch (\Exception $e) {
            return [
                'success' => false,
                'error' => "Exception: " . $e->getMessage()
            ];
        }
    }

    private function testPaydunya($data, $method)
    {
        try {
            $paydunyaService = new PaydunyaOfficialService();
            
            // Mapper les données pour Paydunya
            $mappedData = [
                'productName' => 'Test Product',
                'email' => $data['customer_email'],
                'phone' => $data['phone_number'],
                'amount' => $data['amount'],
                'currency' => $data['currency'],
                'country' => 'Côte d\'Ivoire',
                'paymentMethod' => $method,
                'customerName' => $data['customer_name'],
                'orderId' => $data['order_id'],
                'customerMessage' => $data['customer_message']
            ];

            $result = $paydunyaService->createInvoice($mappedData);
            
            return [
                'success' => $result['success'] ?? false,
                'error' => $result['message'] ?? 'Erreur inconnue',
                'details' => $result
            ];

        } catch (\Exception $e) {
            return [
                'success' => false,
                'error' => "Paydunya Error: " . $e->getMessage()
            ];
        }
    }

    private function testPawapay($data, $method)
    {
        try {
            $pawapayService = new PawapayService();
            
            $result = $pawapayService->createDeposit($data);
            
            return [
                'success' => $result['success'] ?? false,
                'error' => $result['error'] ?? 'Erreur inconnue',
                'details' => $result
            ];

        } catch (\Exception $e) {
            return [
                'success' => false,
                'error' => "Pawapay Error: " . $e->getMessage()
            ];
        }
    }
}
