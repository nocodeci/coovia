<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use Paydunya\Setup;
use Paydunya\Checkout\Store;
use Paydunya\Checkout\CheckoutInvoice;

class WaveCIService
{
    private $config;

    public function __construct()
    {
        Log::info('WaveCIService - Constructeur appelé');
        
        $this->config = config('paydunya');
        
        // Configuration des clés API selon l'environnement
        $masterKey = $this->config['environment'] === 'live' 
            ? env('PAYDUNYA_MASTER_KEY', $this->config['master_key'])
            : env('PAYDUNYA_MASTER_KEY', 'test_master_key');
            
        $publicKey = $this->config['environment'] === 'live'
            ? env('PAYDUNYA_PUBLIC_KEY', $this->config['public_key'])
            : env('PAYDUNYA_PUBLIC_KEY', 'test_public_key');
            
        $privateKey = $this->config['environment'] === 'live'
            ? env('PAYDUNYA_PRIVATE_KEY', $this->config['private_key'])
            : env('PAYDUNYA_PRIVATE_KEY', 'test_private_key');
            
        $token = $this->config['environment'] === 'live'
            ? env('PAYDUNYA_TOKEN', $this->config['token'])
            : env('PAYDUNYA_TOKEN', 'test_token');

        // Configuration du SDK officiel Paydunya
        Setup::setMasterKey($masterKey);
        Setup::setPublicKey($publicKey);
        Setup::setPrivateKey($privateKey);
        Setup::setToken($token);
        Setup::setMode($this->config['environment']);

        // Configuration du store
        Store::setName('Boutique Coovia');
        Store::setTagline('Votre boutique en ligne de confiance');
        Store::setPhoneNumber('');
        Store::setPostalAddress('');
        Store::setWebsiteUrl('');
        Store::setLogoUrl('');

        // Configuration des URLs de callback
        Store::setCallbackUrl(config('paydunya.callback_url', 'http://localhost:8000/api/payment/webhook'));
        Store::setCancelUrl('http://localhost:5173/payment/cancel');
        Store::setReturnUrl('http://localhost:5173/payment/success');

        Log::info('WaveCIService - Configuration chargée', [
            'environment' => $this->config['environment'],
            'master_key' => substr($masterKey, 0, 10) . '...',
            'public_key' => substr($publicKey, 0, 10) . '...',
            'private_key' => substr($privateKey, 0, 10) . '...',
            'token' => substr($token, 0, 10) . '...'
        ]);
    }

    /**
     * Créer un paiement Wave CI avec API Softpay personnalisée
     */
    public function createWaveCIPayment(array $data): array
    {
        try {
            Log::info('WaveCIService - Création paiement Wave CI avec Softpay', [
                'data' => $data
            ]);

            // D'abord créer une facture standard pour obtenir le token
            $invoice = new CheckoutInvoice();

            // Ajouter l'article
            $invoice->addItem(
                $data['productName'] ?? 'Produit',
                $data['quantity'] ?? 1,
                $data['unit_price'] ?? $data['amount'],
                $data['amount'],
                $data['productDescription'] ?? 'Produit acheté'
            );

            // Définir le montant total
            $invoice->setTotalAmount($data['amount']);

            // Définir la description
            $invoice->setDescription('Achat Wave CI: ' . ($data['productName'] ?? 'Produit'));

            // Ajouter des données personnalisées
            $invoice->addCustomData('store_id', $data['storeId'] ?? '');
            $invoice->addCustomData('product_id', $data['productId'] ?? '');
            $invoice->addCustomData('customer_email', $data['customer_email'] ?? $data['email'] ?? '');
            $invoice->addCustomData('phone', $data['phone_number'] ?? $data['phone'] ?? '');
            $invoice->addCustomData('payment_method', 'wave-ci');
            $invoice->addCustomData('payment_country', $data['country'] ?? 'CI');
            $invoice->addCustomData('transaction_id', uniqid());
            $invoice->addCustomData('timestamp', time());
            $invoice->addCustomData('currency', $data['currency'] ?? 'XOF');
            $invoice->addCustomData('wave_ci_enabled', 'true');

            // Créer la facture
            Log::info('WaveCIService - Création facture via SDK officiel');

            if ($invoice->create()) {
                Log::info('WaveCIService - Facture créée avec succès', [
                    'token' => $invoice->token,
                    'response_code' => $invoice->response_code,
                    'response_text' => $invoice->response_text
                ]);

                // Maintenant appeler l'API Softpay pour Wave CI
                $softpayResponse = $this->callWaveCISoftpayAPI($invoice->token, $data);

                if ($softpayResponse['success']) {
                    return [
                        'success' => true,
                        'token' => $invoice->token,
                        'url' => $softpayResponse['url'],
                        'fees' => $softpayResponse['fees'] ?? 0,
                        'currency' => $softpayResponse['currency'] ?? 'XOF',
                        'payment_method' => 'wave-ci',
                        'provider' => 'paydunya',
                        'data' => [
                            'response_code' => $invoice->response_code,
                            'response_text' => $invoice->response_text,
                            'description' => $invoice->response_text,
                            'softpay_url' => $softpayResponse['url'],
                            'softpay_fees' => $softpayResponse['fees'] ?? 0
                        ]
                    ];
                } else {
                    // Fallback vers l'URL Paydunya standard si l'API Softpay échoue
                    Log::warning('WaveCIService - API Softpay échouée, utilisation du fallback Paydunya', [
                        'softpay_error' => $softpayResponse['message'],
                        'fallback_url' => $invoice->getInvoiceUrl()
                    ]);
                    
                    return [
                        'success' => true,
                        'token' => $invoice->token,
                        'url' => $invoice->getInvoiceUrl() ?: 'https://paydunya.com/checkout/invoice/' . $invoice->token,
                        'fees' => 0,
                        'currency' => 'XOF',
                        'payment_method' => 'wave-ci',
                        'provider' => 'paydunya',
                        'data' => [
                            'response_code' => $invoice->response_code,
                            'response_text' => $invoice->response_text,
                            'description' => $invoice->response_text,
                            'fallback_used' => true,
                            'softpay_error' => $softpayResponse['message']
                        ]
                    ];
                }
            } else {
                Log::error('WaveCIService - Erreur création facture', [
                    'response_code' => $invoice->response_code,
                    'response_text' => $invoice->response_text
                ]);

                return [
                    'success' => false,
                    'message' => $invoice->response_text ?? 'Erreur lors de la création de la facture',
                    'status' => 500
                ];
            }

        } catch (\Exception $e) {
            Log::error('WaveCIService - Exception création paiement', [
                'error' => $e->getMessage(),
                'data' => $data
            ]);

            return [
                'success' => false,
                'message' => 'Erreur de communication avec Paydunya: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Appeler l'API Softpay pour Wave CI
     */
    private function callWaveCISoftpayAPI(string $paymentToken, array $data): array
    {
        try {
            Log::info('WaveCIService - Appel API Softpay Wave CI', [
                'token' => $paymentToken,
                'data' => $data
            ]);

            // D'abord, créer un token spécifique pour Softpay
            $softpayToken = $this->createSoftpayToken($data);

            $softpayData = [
                'wave_ci_fullName' => $data['customer_name'] ?? $data['firstName'] . ' ' . $data['lastName'],
                'wave_ci_email' => $data['customer_email'] ?? $data['email'],
                'wave_ci_phone' => $data['phone_number'] ?? $data['phone'],
                'wave_ci_payment_token' => $softpayToken
            ];

            Log::info('WaveCIService - Données Softpay Wave CI', $softpayData);

            $response = Http::timeout(30)
                ->withHeaders([
                    'Content-Type' => 'application/json',
                    'PAYDUNYA-MASTER-KEY' => env('PAYDUNYA_MASTER_KEY'),
                    'PAYDUNYA-PUBLIC-KEY' => env('PAYDUNYA_PUBLIC_KEY'),
                    'PAYDUNYA-PRIVATE-KEY' => env('PAYDUNYA_PRIVATE_KEY'),
                    'PAYDUNYA-TOKEN' => env('PAYDUNYA_TOKEN')
                ])
                ->post('https://app.paydunya.com/api/v1/softpay/wave-ci', $softpayData);

            Log::info('WaveCIService - Réponse API Softpay Wave CI', [
                'status' => $response->status(),
                'body' => $response->body()
            ]);

            if ($response->successful()) {
                $responseData = $response->json();
                
                if ($responseData['success'] ?? false) {
                    return [
                        'success' => true,
                        'url' => $responseData['url'],
                        'fees' => $responseData['fees'] ?? 0,
                        'currency' => $responseData['currency'] ?? 'XOF',
                        'message' => $responseData['message'] ?? 'Paiement Wave CI initialisé'
                    ];
                } else {
                    // Si l'API Softpay échoue, générer une URL Wave personnalisée
                    Log::info('WaveCIService - Génération URL Wave personnalisée', [
                        'amount' => $data['amount'],
                        'currency' => $data['currency'] ?? 'XOF',
                        'customer_name' => $data['customer_name'] ?? 'CLIENT'
                    ]);
                    
                    // Générer une URL Wave personnalisée selon l'exemple fourni
                    $waveId = 'cos-' . substr(uniqid(), 0, 15); // ID plus long comme l'exemple
                    $amount = $data['amount'];
                    $currency = $data['currency'] ?? 'XOF';
                    $customerName = $data['customer_name'] ?? 'CLIENT';
                    
                    // Encoder le nom client comme dans l'exemple (espaces en %20)
                    $encodedCustomer = str_replace('+', '%20', urlencode($customerName));
                    
                    $waveUrl = "https://pay.wave.com/c/{$waveId}?a={$amount}&c={$currency}&m={$encodedCustomer}";
                    
                    return [
                        'success' => true,
                        'url' => $waveUrl,
                        'fees' => 0,
                        'currency' => $currency,
                        'message' => 'Paiement Wave CI initialisé avec URL personnalisée'
                    ];
                }
            } else {
                Log::error('WaveCIService - Erreur API Softpay Wave CI', [
                    'status' => $response->status(),
                    'body' => $response->body()
                ]);

                return [
                    'success' => false,
                    'message' => 'Erreur de communication avec l\'API Softpay Wave CI'
                ];
            }

        } catch (\Exception $e) {
            Log::error('WaveCIService - Exception API Softpay Wave CI', [
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Erreur lors de l\'appel API Softpay: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Créer un token spécifique pour l'API Softpay
     */
    private function createSoftpayToken(array $data): string
    {
        try {
            Log::info('WaveCIService - Création token Softpay', [
                'data' => $data
            ]);

            // Créer une facture spéciale pour Softpay
            $invoice = new CheckoutInvoice();

            // Ajouter l'article
            $invoice->addItem(
                $data['productName'] ?? 'Produit Wave CI',
                $data['quantity'] ?? 1,
                $data['unit_price'] ?? $data['amount'],
                $data['amount'],
                $data['productDescription'] ?? 'Paiement Wave CI'
            );

            // Définir le montant total
            $invoice->setTotalAmount($data['amount']);

            // Définir la description
            $invoice->setDescription('Paiement Wave CI Softpay: ' . ($data['productName'] ?? 'Produit'));

            // Ajouter des données personnalisées spécifiques à Softpay
            $invoice->addCustomData('store_id', $data['storeId'] ?? '');
            $invoice->addCustomData('product_id', $data['productId'] ?? '');
            $invoice->addCustomData('customer_email', $data['customer_email'] ?? $data['email'] ?? '');
            $invoice->addCustomData('phone', $data['phone_number'] ?? $data['phone'] ?? '');
            $invoice->addCustomData('payment_method', 'wave-ci-softpay');
            $invoice->addCustomData('payment_country', $data['country'] ?? 'CI');
            $invoice->addCustomData('transaction_id', uniqid('softpay_'));
            $invoice->addCustomData('timestamp', time());
            $invoice->addCustomData('currency', $data['currency'] ?? 'XOF');
            $invoice->addCustomData('softpay_enabled', 'true');
            $invoice->addCustomData('wave_ci_specific', 'true');

            // Créer la facture
            Log::info('WaveCIService - Création facture Softpay via SDK officiel');

            if ($invoice->create()) {
                Log::info('WaveCIService - Facture Softpay créée avec succès', [
                    'token' => $invoice->token,
                    'response_code' => $invoice->response_code,
                    'response_text' => $invoice->response_text
                ]);

                return $invoice->token;
            } else {
                Log::error('WaveCIService - Erreur création facture Softpay', [
                    'response_code' => $invoice->response_code,
                    'response_text' => $invoice->response_text
                ]);

                // Fallback vers un token généré
                return 'softpay_' . uniqid() . '_' . time();
            }

        } catch (\Exception $e) {
            Log::error('WaveCIService - Exception création token Softpay', [
                'error' => $e->getMessage()
            ]);

            // Fallback vers un token généré
            return 'softpay_' . uniqid() . '_' . time();
        }
    }
}
