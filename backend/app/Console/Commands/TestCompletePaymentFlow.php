<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class TestCompletePaymentFlow extends Command
{
    protected $signature = 'payment:test-complete {method} {--amount=1000} {--phone=0123456789}';
    protected $description = 'Tester le flux de paiement complet avec une méthode spécifique';

    public function handle()
    {
        $method = $this->argument('method');
        $amount = $this->option('amount');
        $phone = $this->option('phone');

        $this->info("🧪 TEST DU FLUX DE PAIEMENT COMPLET");
        $this->info("===================================\n");

        $this->info("Méthode: $method");
        $this->info("Montant: $amount XOF");
        $this->info("Téléphone: $phone\n");

        // 1. Test de l'API Smart Payment
        $this->testSmartPaymentAPI($method, $amount, $phone);

        // 2. Test des méthodes spécifiques
        $this->testSpecificMethod($method, $amount, $phone);

        return 0;
    }

    private function testSmartPaymentAPI($method, $amount, $phone)
    {
        $this->info("1. TEST API SMART PAYMENT");
        $this->info("-------------------------\n");

        $data = [
            'amount' => (int) $amount,
            'currency' => 'XOF',
            'phone_number' => $phone,
            'country' => 'CI',
            'payment_method' => $method,
            'customer_name' => 'Test User',
            'customer_email' => 'test@example.com',
            'order_id' => 'TEST-' . time(),
            'customer_message' => 'Test de paiement complet'
        ];

        try {
            $response = Http::timeout(30)->post('http://localhost:8000/api/smart-payment/initialize', $data);
            
            $this->line("Status: " . $response->status());
            $this->line("Response: " . $response->body());
            
            if ($response->successful()) {
                $result = $response->json();
                if ($result['success']) {
                    $this->info("✅ Smart Payment API: SUCCÈS");
                    $this->line("   Payment ID: " . ($result['data']['payment_id'] ?? 'N/A'));
                    $this->line("   Provider: " . ($result['data']['provider'] ?? 'N/A'));
                } else {
                    $this->error("❌ Smart Payment API: ÉCHEC");
                    $this->line("   Erreur: " . ($result['message'] ?? 'Erreur inconnue'));
                }
            } else {
                $this->error("❌ Smart Payment API: Erreur HTTP " . $response->status());
            }
        } catch (\Exception $e) {
            $this->error("❌ Smart Payment API: Exception");
            $this->line("   Erreur: " . $e->getMessage());
        }

        $this->line("");
    }

    private function testSpecificMethod($method, $amount, $phone)
    {
        $this->info("2. TEST MÉTHODE SPÉCIFIQUE");
        $this->info("----------------------------\n");

        switch ($method) {
            case 'orange-money-ci':
                $this->testOrangeMoneyCI($amount, $phone);
                break;
            case 'wave-ci':
                $this->testWaveCI($amount, $phone);
                break;
            case 'mtn-ci':
                $this->testMTNCI($amount, $phone);
                break;
            case 'moov-ci':
                $this->testMoovCI($amount, $phone);
                break;
            default:
                $this->warn("⚠️  Méthode $method non implémentée pour le test spécifique");
        }
    }

    private function testOrangeMoneyCI($amount, $phone)
    {
        $this->info("🔍 Test Orange Money CI");
        
        // Test de création de facture
        $data = [
            'productName' => 'Test Product',
            'email' => 'test@example.com',
            'phone' => $phone,
            'amount' => $amount,
            'currency' => 'XOF',
            'country' => 'Côte d\'Ivoire',
            'paymentMethod' => 'orange-money-ci',
            'customerName' => 'Test User',
            'orderId' => 'TEST-' . time(),
            'customerMessage' => 'Test Orange Money CI'
        ];

        try {
            $response = Http::timeout(30)->post('http://localhost:8000/api/process-orange-money-ci-payment', [
                'phone_number' => $phone,
                'otp' => '123456',
                'payment_token' => 'test_token',
                'customer_name' => 'Test User',
                'customer_email' => 'test@example.com'
            ]);
            
            $this->line("Status: " . $response->status());
            $this->line("Response: " . $response->body());
            
            if ($response->successful()) {
                $result = $response->json();
                if ($result['success']) {
                    $this->info("✅ Orange Money CI: SUCCÈS");
                } else {
                    $this->error("❌ Orange Money CI: ÉCHEC");
                    $this->line("   Erreur: " . ($result['message'] ?? 'Erreur inconnue'));
                }
            } else {
                $this->error("❌ Orange Money CI: Erreur HTTP " . $response->status());
            }
        } catch (\Exception $e) {
            $this->error("❌ Orange Money CI: Exception");
            $this->line("   Erreur: " . $e->getMessage());
        }
    }

    private function testWaveCI($amount, $phone)
    {
        $this->info("🔍 Test Wave CI");
        
        try {
            $response = Http::timeout(30)->post('http://localhost:8000/api/process-wave-ci-payment', [
                'phone_number' => $phone,
                'payment_token' => 'test_token',
                'customer_name' => 'Test User',
                'customer_email' => 'test@example.com'
            ]);
            
            $this->line("Status: " . $response->status());
            $this->line("Response: " . $response->body());
            
            if ($response->successful()) {
                $result = $response->json();
                if ($result['success']) {
                    $this->info("✅ Wave CI: SUCCÈS");
                } else {
                    $this->error("❌ Wave CI: ÉCHEC");
                    $this->line("   Erreur: " . ($result['message'] ?? 'Erreur inconnue'));
                }
            } else {
                $this->error("❌ Wave CI: Erreur HTTP " . $response->status());
            }
        } catch (\Exception $e) {
            $this->error("❌ Wave CI: Exception");
            $this->line("   Erreur: " . $e->getMessage());
        }
    }

    private function testMTNCI($amount, $phone)
    {
        $this->info("🔍 Test MTN CI");
        
        try {
            // Créer d'abord une vraie facture PayDunya pour obtenir un token valide
            $paydunyaService = new \App\Services\PaydunyaOfficialService();
            
            $invoiceData = [
                'amount' => $amount,
                'productName' => 'Test MTN CI',
                'productDescription' => 'Test paiement MTN CI',
                'unit_price' => $amount,
                'quantity' => 1,
                'storeId' => 'test-store',
                'productId' => 'PROD-' . uniqid(),
                'firstName' => 'Test',
                'lastName' => 'User',
                'email' => 'test@example.com',
                'phone' => $phone,
                'paymentMethod' => 'mtn_ci',
                'currency' => 'XOF',
                'paymentCountry' => 'Côte d\'Ivoire',
                'custom_data' => ['order_id' => 'ORDER-' . uniqid()]
            ];
            
            $invoiceResult = $paydunyaService->createInvoice($invoiceData);
            
            if (!$invoiceResult['success']) {
                $this->error("❌ MTN CI: Échec création facture");
                return;
            }
            
            $paymentToken = $invoiceResult['token'];
            
            $response = Http::timeout(30)->post('http://localhost:8000/api/process-mtn-ci-payment', [
                'phone_number' => $phone,
                'payment_token' => $paymentToken,
                'customer_name' => 'Test User',
                'customer_email' => 'test@example.com'
            ]);
            
            $this->line("Status: " . $response->status());
            $this->line("Response: " . $response->body());
            
            if ($response->successful()) {
                $result = $response->json();
                if ($result['success']) {
                    $this->info("✅ MTN CI: SUCCÈS");
                } else {
                    $this->error("❌ MTN CI: ÉCHEC");
                    $this->line("   Erreur: " . ($result['message'] ?? 'Erreur inconnue'));
                }
            } else {
                $this->error("❌ MTN CI: Erreur HTTP " . $response->status());
            }
        } catch (\Exception $e) {
            $this->error("❌ MTN CI: Exception");
            $this->line("   Erreur: " . $e->getMessage());
        }
    }

    private function testMoovCI($amount, $phone)
    {
        $this->info("🔍 Test Moov CI");
        
        try {
            $response = Http::timeout(30)->post('http://localhost:8000/api/process-moov-ci-payment', [
                'phone_number' => $phone,
                'payment_token' => 'test_token',
                'customer_name' => 'Test User',
                'customer_email' => 'test@example.com'
            ]);
            
            $this->line("Status: " . $response->status());
            $this->line("Response: " . $response->body());
            
            if ($response->successful()) {
                $result = $response->json();
                if ($result['success']) {
                    $this->info("✅ Moov CI: SUCCÈS");
                } else {
                    $this->error("❌ Moov CI: ÉCHEC");
                    $this->line("   Erreur: " . ($result['message'] ?? 'Erreur inconnue'));
                }
            } else {
                $this->error("❌ Moov CI: Erreur HTTP " . $response->status());
            }
        } catch (\Exception $e) {
            $this->error("❌ Moov CI: Exception");
            $this->line("   Erreur: " . $e->getMessage());
        }
    }
}
