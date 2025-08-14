<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use Paydunya\Setup;
use Paydunya\Checkout\Store;
use Paydunya\Checkout\CheckoutInvoice;

class PaydunyaOfficialService
{
    private $config;

    public function __construct()
    {
        Log::info('PaydunyaOfficialService - Constructeur appelé');
        
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

        Log::info('PaydunyaOfficialService - Configuration chargée', [
            'environment' => $this->config['environment'],
            'master_key' => substr($masterKey, 0, 10) . '...',
            'public_key' => substr($publicKey, 0, 10) . '...',
            'private_key' => substr($privateKey, 0, 10) . '...',
            'token' => substr($token, 0, 10) . '...'
        ]);
    }

    public function createInvoice(array $data): array
    {
        try {
            Log::info('PaydunyaOfficialService - Création de facture', [
                'data' => $data
            ]);

            $invoice = new CheckoutInvoice();

            // Ajouter l'article
            $invoice->addItem(
                $data['productName'],
                $data['quantity'] ?? 1,
                $data['unit_price'] ?? $data['amount'],
                $data['amount'],
                $data['productDescription'] ?? 'Produit acheté'
            );

            // Définir le montant total
            $invoice->setTotalAmount($data['amount']);

            // Définir la description
            $invoice->setDescription('Achat: ' . $data['productName']);

            // Ajouter des données personnalisées
            $invoice->addCustomData('store_id', $data['storeId'] ?? '');
            $invoice->addCustomData('product_id', $data['productId'] ?? '');
            $invoice->addCustomData('customer_email', $data['email'] ?? '');
            $invoice->addCustomData('phone', $data['phone'] ?? '');
            $invoice->addCustomData('payment_method', $data['paymentMethod'] ?? '');
            $invoice->addCustomData('payment_country', $data['paymentCountry'] ?? '');
            $invoice->addCustomData('transaction_id', uniqid());
            $invoice->addCustomData('timestamp', time());
            $invoice->addCustomData('currency', $data['currency'] ?? 'XOF');

            // Créer la facture
            Log::info('PaydunyaOfficialService - Création de facture via SDK officiel');

            if ($invoice->create()) {
                Log::info('PaydunyaOfficialService - Facture créée avec succès', [
                    'token' => $invoice->token,
                    'invoice_url' => $invoice->getInvoiceUrl(),
                    'response_code' => $invoice->response_code,
                    'response_text' => $invoice->response_text
                ]);

                return [
                    'success' => true,
                    'token' => $invoice->token,
                    'url' => $invoice->getInvoiceUrl() ?: 'https://paydunya.com/checkout/invoice/' . $invoice->token,
                    'data' => [
                        'response_code' => $invoice->response_code,
                        'response_text' => $invoice->response_text,
                        'description' => $invoice->response_text
                    ]
                ];
            } else {
                Log::error('PaydunyaOfficialService - Erreur création facture', [
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
            Log::error('PaydunyaOfficialService - Exception création facture', [
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
     * Créer une facture spécifique pour Wave CI avec API Softpay
     */
    public function createWaveCIInvoice(array $data): array
    {
        try {
            Log::info('PaydunyaOfficialService - Création facture Wave CI avec Softpay', [
                'data' => $data
            ]);

            // D'abord créer une facture standard pour obtenir le token
            $invoice = new CheckoutInvoice();

            // Ajouter l'article
            $invoice->addItem(
                $data['productName'],
                $data['quantity'] ?? 1,
                $data['unit_price'] ?? $data['amount'],
                $data['amount'],
                $data['productDescription'] ?? 'Produit acheté'
            );

            // Définir le montant total
            $invoice->setTotalAmount($data['amount']);

            // Définir la description
            $invoice->setDescription('Achat Wave CI: ' . $data['productName']);

            // Ajouter des données personnalisées spécifiques à Wave CI
            $invoice->addCustomData('store_id', $data['storeId'] ?? '');
            $invoice->addCustomData('product_id', $data['productId'] ?? '');
            $invoice->addCustomData('customer_email', $data['email'] ?? '');
            $invoice->addCustomData('phone', $data['phone'] ?? '');
            $invoice->addCustomData('payment_method', 'wave-ci');
            $invoice->addCustomData('payment_country', $data['paymentCountry'] ?? '');
            $invoice->addCustomData('transaction_id', uniqid());
            $invoice->addCustomData('timestamp', time());
            $invoice->addCustomData('currency', $data['currency'] ?? 'XOF');
            $invoice->addCustomData('wave_ci_enabled', 'true');

            // Créer la facture
            Log::info('PaydunyaOfficialService - Création facture Wave CI via SDK officiel');

            if ($invoice->create()) {
                Log::info('PaydunyaOfficialService - Facture Wave CI créée avec succès', [
                    'token' => $invoice->token,
                    'invoice_url' => $invoice->getInvoiceUrl(),
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
                    return [
                        'success' => false,
                        'message' => 'Erreur lors de l\'initialisation Wave CI: ' . $softpayResponse['message'],
                        'status' => 500
                    ];
                }
            } else {
                Log::error('PaydunyaOfficialService - Erreur création facture Wave CI', [
                    'response_code' => $invoice->response_code,
                    'response_text' => $invoice->response_text
                ]);

                return [
                    'success' => false,
                    'message' => $invoice->response_text ?? 'Erreur lors de la création de la facture Wave CI',
                    'status' => 500
                ];
            }

        } catch (\Exception $e) {
            Log::error('PaydunyaOfficialService - Exception création facture Wave CI', [
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
            Log::info('PaydunyaOfficialService - Appel API Softpay Wave CI', [
                'token' => $paymentToken,
                'data' => $data
            ]);

            $softpayData = [
                'wave_ci_fullName' => $data['customer_name'] ?? $data['firstName'] . ' ' . $data['lastName'],
                'wave_ci_email' => $data['customer_email'] ?? $data['email'],
                'wave_ci_phone' => $data['phone_number'] ?? $data['phone'],
                'wave_ci_payment_token' => $paymentToken
            ];

            Log::info('PaydunyaOfficialService - Données Softpay Wave CI', $softpayData);

            $response = Http::timeout(30)
                ->withHeaders([
                    'Content-Type' => 'application/json',
                    'PAYDUNYA-MASTER-KEY' => env('PAYDUNYA_MASTER_KEY'),
                    'PAYDUNYA-PUBLIC-KEY' => env('PAYDUNYA_PUBLIC_KEY'),
                    'PAYDUNYA-PRIVATE-KEY' => env('PAYDUNYA_PRIVATE_KEY'),
                    'PAYDUNYA-TOKEN' => env('PAYDUNYA_TOKEN')
                ])
                ->post('https://app.paydunya.com/api/v1/softpay/wave-ci', $softpayData);

            Log::info('PaydunyaOfficialService - Réponse API Softpay Wave CI', [
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
                    return [
                        'success' => false,
                        'message' => $responseData['message'] ?? 'Erreur lors de l\'initialisation Wave CI'
                    ];
                }
            } else {
                Log::error('PaydunyaOfficialService - Erreur API Softpay Wave CI', [
                    'status' => $response->status(),
                    'body' => $response->body()
                ]);

                return [
                    'success' => false,
                    'message' => 'Erreur de communication avec l\'API Softpay Wave CI'
                ];
            }

        } catch (\Exception $e) {
            Log::error('PaydunyaOfficialService - Exception API Softpay Wave CI', [
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Erreur lors de l\'appel API Softpay: ' . $e->getMessage()
            ];
        }
    }


    /**
     * Paiement Wave CI avec API Softpay personnalisée
     */
    public function payWithWaveCI(array $data): array
    {
        try {
            Log::info('PaydunyaOfficialService - Paiement Wave CI avec Softpay', [
                'data' => $data
            ]);

            // Créer d'abord une facture pour obtenir le token
            $invoiceResult = $this->createInvoice($data);
            
            if (!$invoiceResult['success']) {
                return $invoiceResult;
            }

            $paymentToken = $invoiceResult['token'];

            // Appeler l'API Softpay pour Wave CI
            $softpayResponse = $this->callWaveCISoftpayAPI($paymentToken, $data);

            if ($softpayResponse['success']) {
                return [
                    'success' => true,
                    'token' => $paymentToken,
                    'url' => $softpayResponse['url'],
                    'fees' => $softpayResponse['fees'] ?? 0,
                    'currency' => $softpayResponse['currency'] ?? 'XOF',
                    'payment_method' => 'wave-ci',
                    'provider' => 'paydunya',
                    'message' => 'Paiement Wave CI initialisé avec succès',
                    'data' => [
                        'softpay_url' => $softpayResponse['url'],
                        'softpay_fees' => $softpayResponse['fees'] ?? 0,
                        'softpay_currency' => $softpayResponse['currency'] ?? 'XOF'
                    ]
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'Erreur lors de l\'initialisation Wave CI: ' . $softpayResponse['message']
                ];
            }

        } catch (\Exception $e) {
            Log::error('PaydunyaOfficialService - Exception paiement Wave CI', [
                'error' => $e->getMessage(),
                'data' => $data
            ]);

            return [
                'success' => false,
                'message' => 'Erreur de communication avec Paydunya Wave CI: ' . $e->getMessage()
            ];
        }
    }

    public function payWithOrangeMoneyCI(array $data): array
    {
        try {
            Log::info('PaydunyaOfficialService - Paiement Orange Money CI', [
                'data' => $data
            ]);

            // Créer d'abord une facture
            $invoiceResult = $this->createInvoice($data);
            
            if (!$invoiceResult['success']) {
                return $invoiceResult;
            }

            // Pour Orange Money CI, nous utilisons la facture créée
            return [
                'success' => true,
                'payment_url' => $invoiceResult['url'] ?? 'https://paydunya.com/checkout/invoice/' . $invoiceResult['token'],
                'token' => $invoiceResult['token'],
                'message' => 'Paiement Orange Money CI initialisé avec succès'
            ];

        } catch (\Exception $e) {
            Log::error('PaydunyaOfficialService - Exception paiement Orange Money CI', [
                'error' => $e->getMessage(),
                'data' => $data
            ]);

            return [
                'success' => false,
                'message' => 'Erreur de communication avec Paydunya Orange Money CI: ' . $e->getMessage()
            ];
        }
    }

    public function payWithMTNCI(array $data): array
    {
        try {
            Log::info('PaydunyaOfficialService - Paiement MTN CI', [
                'data' => $data
            ]);

            // Créer d'abord une facture pour obtenir le payment_token
            $invoiceResult = $this->createInvoice($data);
            
            if (!$invoiceResult['success'] || !isset($invoiceResult['token'])) {
                Log::error('PaydunyaOfficialService - Échec création facture MTN CI', [
                    'invoice_result' => $invoiceResult
                ]);
                return $invoiceResult;
            }

            $paymentToken = $invoiceResult['token'];

            // Appeler l'API Softpay MTN CI avec le payment_token
            $mtnResponse = $this->payWithMTNCIAPI(
                $paymentToken,
                $data['firstName'] . ' ' . $data['lastName'],
                $data['email'],
                $data['phone']
            );

            if ($mtnResponse && isset($mtnResponse['success']) && $mtnResponse['success'] === true) {
                Log::info('PaydunyaOfficialService - API Softpay MTN CI réussie', [
                    'response' => $mtnResponse
                ]);
                
                return [
                    'success' => true,
                    'message' => $mtnResponse['message'] ?? 'Votre paiement est en cours de traitement. Merci de valider le paiement après reception de sms pour le compléter.',
                    'fees' => $mtnResponse['fees'] ?? null,
                    'currency' => $mtnResponse['currency'] ?? 'XOF',
                    'token' => $paymentToken,
                    'sms_sent' => true
                ];
            }

            // Si l'API Softpay échoue, essayer une approche alternative
            Log::warning('PaydunyaOfficialService - API Softpay MTN CI échouée, tentative alternative', [
                'mtn_response' => $mtnResponse
            ]);

            // Essayer de créer une facture spécifique pour MTN CI
            $alternativeData = $data;
            $alternativeData['paymentMethod'] = 'mtn_ci';
            $alternativeData['custom_data'] = array_merge($data['custom_data'] ?? [], [
                'mtn_ci_phone' => $data['phone'],
                'mtn_ci_customer' => $data['firstName'] . ' ' . $data['lastName']
            ]);

            $alternativeInvoice = $this->createInvoice($alternativeData);
            
            if ($alternativeInvoice['success']) {
                return [
                    'success' => true,
                    'message' => 'Votre paiement MTN CI est en cours de traitement. Veuillez vérifier votre téléphone pour le SMS de confirmation.',
                    'token' => $alternativeInvoice['token'],
                    'payment_url' => $alternativeInvoice['url'],
                    'sms_sent' => false,
                    'fallback_used' => true
                ];
            }

            // Dernière option : facture standard
            return [
                'success' => true,
                'message' => 'Paiement MTN CI initialisé. Veuillez vérifier votre téléphone pour le SMS de confirmation.',
                'token' => $paymentToken,
                'payment_url' => $invoiceResult['url'] ?? 'https://paydunya.com/checkout/invoice/' . $paymentToken,
                'sms_sent' => false,
                'fallback_used' => true
            ];

        } catch (\Exception $e) {
            Log::error('PaydunyaOfficialService - Exception paiement MTN CI', [
                'error' => $e->getMessage(),
                'data' => $data
            ]);

            return [
                'success' => false,
                'message' => 'Erreur de communication avec Paydunya MTN CI: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Appeler l'API Softpay MTN CI
     */
    public function payWithMTNCIAPI(string $paymentToken, string $customerName, string $customerEmail, string $customerPhone): ?array
    {
        try {
            Log::info('PaydunyaOfficialService - Initiation paiement MTN CI API', [
                'payment_token' => $paymentToken,
                'customer_name' => $customerName,
                'customer_email' => $customerEmail,
                'customer_phone' => $customerPhone
            ]);

            $payload = [
                'mtn_ci_customer_fullname' => $customerName,
                'mtn_ci_email' => $customerEmail,
                'mtn_ci_phone_number' => $customerPhone,
                'mtn_ci_wallet_provider' => 'MTNCI',
                'payment_token' => $paymentToken,
            ];

            $headers = [
                'Content-Type' => 'application/json',
                'PAYDUNYA-MASTER-KEY' => env('PAYDUNYA_MASTER_KEY'),
                'PAYDUNYA-PUBLIC-KEY' => env('PAYDUNYA_PUBLIC_KEY'),
                'PAYDUNYA-PRIVATE-KEY' => env('PAYDUNYA_PRIVATE_KEY'),
                'PAYDUNYA-TOKEN' => env('PAYDUNYA_TOKEN')
            ];

            $response = Http::timeout(30)
                ->withHeaders($headers)
                ->post('https://app.paydunya.com/api/v1/softpay/mtn-ci', $payload);

            if ($response->successful() && $response->json('success') === true) {
                return $response->json();
            }

            Log::error('PaydunyaOfficialService - Erreur de paiement MTN CI:', [
                'status' => $response->status(),
                'response' => $response->json()
            ]);
            return null;

        } catch (\Exception $e) {
            Log::error('PaydunyaOfficialService - Exception paiement MTN CI', [
                'error' => $e->getMessage(),
                'payment_token' => $paymentToken
            ]);
            return null;
        }
    }

    public function payWithMoovCI(array $data): array
    {
        try {
            Log::info('PaydunyaOfficialService - Paiement Moov CI', [
                'data' => $data
            ]);

            // Créer d'abord une facture
            $invoiceResult = $this->createInvoice($data);
            
            if (!$invoiceResult['success']) {
                return $invoiceResult;
            }

            // Pour Moov CI, nous utilisons la facture créée
            return [
                'success' => true,
                'payment_url' => $invoiceResult['url'] ?? 'https://paydunya.com/checkout/invoice/' . $invoiceResult['token'],
                'token' => $invoiceResult['token'],
                'message' => 'Paiement Moov CI initialisé avec succès'
            ];

        } catch (\Exception $e) {
            Log::error('PaydunyaOfficialService - Exception paiement Moov CI', [
                'error' => $e->getMessage(),
                'data' => $data
            ]);

            return [
                'success' => false,
                'message' => 'Erreur de communication avec Paydunya Moov CI: ' . $e->getMessage()
            ];
        }
    }

    public function payWithOrangeMoneyBurkina(array $data): array
    {
        try {
            Log::info('PaydunyaOfficialService - Paiement Orange Money Burkina', [
                'data' => $data
            ]);

            // Créer d'abord une facture
            $invoiceResult = $this->createInvoice($data);
            
            if (!$invoiceResult['success']) {
                return $invoiceResult;
            }

            // Pour Orange Money Burkina, nous utilisons la facture créée
            return [
                'success' => true,
                'payment_url' => $invoiceResult['url'] ?? 'https://paydunya.com/checkout/invoice/' . $invoiceResult['token'],
                'token' => $invoiceResult['token'],
                'message' => 'Paiement Orange Money Burkina initialisé avec succès'
            ];

        } catch (\Exception $e) {
            Log::error('PaydunyaOfficialService - Exception paiement Orange Money Burkina', [
                'error' => $e->getMessage(),
                'data' => $data
            ]);

            return [
                'success' => false,
                'message' => 'Erreur de communication avec Paydunya Orange Money Burkina: ' . $e->getMessage()
            ];
        }
    }

    public function payWithOrangeMoneySenegal(array $data): array
    {
        try {
            Log::info('PaydunyaOfficialService - Paiement Orange Money Sénégal', [
                'data' => $data
            ]);

            // Créer d'abord une facture
            $invoiceResult = $this->createInvoice($data);
            
            if (!$invoiceResult['success']) {
                return $invoiceResult;
            }

            // Pour Orange Money Sénégal, nous utilisons la facture créée
            return [
                'success' => true,
                'payment_url' => $invoiceResult['url'] ?? "https://paydunya.com/checkout/invoice/" . $invoiceResult['token'],
                'token' => $invoiceResult['token'],
                'message' => 'Paiement Orange Money Sénégal initialisé avec succès'
            ];

        } catch (\Exception $e) {
            Log::error('PaydunyaOfficialService - Exception paiement Orange Money Sénégal', [
                'error' => $e->getMessage(),
                'data' => $data
            ]);

            return [
                'success' => false,
                'message' => 'Erreur de communication avec Paydunya Orange Money Sénégal: ' . $e->getMessage()
            ];
        }
    }

    public function payWithFreeMoneySenegal(array $data): array
    {
        try {
            Log::info('PaydunyaOfficialService - Paiement Free Money Sénégal', [
                'data' => $data
            ]);

            // Créer d'abord une facture
            $invoiceResult = $this->createInvoice($data);
            
            if (!$invoiceResult['success']) {
                return $invoiceResult;
            }

            // Pour Free Money Sénégal, nous utilisons la facture créée
            return [
                'success' => true,
                'payment_url' => $invoiceResult['url'] ?? "https://paydunya.com/checkout/invoice/" . $invoiceResult['token'],
                'token' => $invoiceResult['token'],
                'message' => 'Paiement Free Money Sénégal initialisé avec succès'
            ];

        } catch (\Exception $e) {
            Log::error('PaydunyaOfficialService - Exception paiement Free Money Sénégal', [
                'error' => $e->getMessage(),
                'data' => $data
            ]);

            return [
                'success' => false,
                'message' => 'Erreur de communication avec Paydunya Free Money Sénégal: ' . $e->getMessage()
            ];
        }
    }

    public function payWithExpressoSenegal(array $data): array
    {
        try {
            Log::info('PaydunyaOfficialService - Paiement Expresso Sénégal', [
                'data' => $data
            ]);

            // Créer d'abord une facture
            $invoiceResult = $this->createInvoice($data);
            
            if (!$invoiceResult['success']) {
                return $invoiceResult;
            }

            // Pour Expresso Sénégal, nous utilisons la facture créée
            return [
                'success' => true,
                'payment_url' => $invoiceResult['url'] ?? "https://paydunya.com/checkout/invoice/" . $invoiceResult['token'],
                'token' => $invoiceResult['token'],
                'message' => 'Paiement Expresso Sénégal initialisé avec succès'
            ];

        } catch (\Exception $e) {
            Log::error('PaydunyaOfficialService - Exception paiement Expresso Sénégal', [
                'error' => $e->getMessage(),
                'data' => $data
            ]);

            return [
                'success' => false,
                'message' => 'Erreur de communication avec Paydunya Expresso Sénégal: ' . $e->getMessage()
            ];
        }
    }

    public function payWithWaveSenegal(array $data): array
    {
        try {
            Log::info('PaydunyaOfficialService - Paiement Wave Sénégal', [
                'data' => $data
            ]);

            // Créer d'abord une facture
            $invoiceResult = $this->createInvoice($data);
            
            if (!$invoiceResult['success']) {
                return $invoiceResult;
            }

            // Pour Wave Sénégal, nous utilisons la facture créée
            return [
                'success' => true,
                'payment_url' => $invoiceResult['url'] ?? "https://paydunya.com/checkout/invoice/" . $invoiceResult['token'],
                'token' => $invoiceResult['token'],
                'message' => 'Paiement Wave Sénégal initialisé avec succès'
            ];

        } catch (\Exception $e) {
            Log::error('PaydunyaOfficialService - Exception paiement Wave Sénégal', [
                'error' => $e->getMessage(),
                'data' => $data
            ]);

            return [
                'success' => false,
                'message' => 'Erreur de communication avec Paydunya Wave Sénégal: ' . $e->getMessage()
            ];
        }
    }

    public function payWithWizallSenegal(array $data): array
    {
        try {
            Log::info('PaydunyaOfficialService - Paiement Wizall Sénégal', [
                'data' => $data
            ]);

            // Créer d'abord une facture
            $invoiceResult = $this->createInvoice($data);
            
            if (!$invoiceResult['success']) {
                return $invoiceResult;
            }

            // Pour Wizall Sénégal, nous utilisons la facture créée
            return [
                'success' => true,
                'payment_url' => $invoiceResult['url'] ?? "https://paydunya.com/checkout/invoice/" . $invoiceResult['token'],
                'token' => $invoiceResult['token'],
                'message' => 'Paiement Wizall Sénégal initialisé avec succès'
            ];

        } catch (\Exception $e) {
            Log::error('PaydunyaOfficialService - Exception paiement Wizall Sénégal', [
                'error' => $e->getMessage(),
                'data' => $data
            ]);

            return [
                'success' => false,
                'message' => 'Erreur de communication avec Paydunya Wizall Sénégal: ' . $e->getMessage()
            ];
        }
    }

    public function payWithMoovBenin(array $data): array
    {
        try {
            Log::info('PaydunyaOfficialService - Paiement Moov Bénin', [
                'data' => $data
            ]);

            // Créer d'abord une facture
            $invoiceResult = $this->createInvoice($data);
            
            if (!$invoiceResult['success']) {
                return $invoiceResult;
            }

            // Pour Moov Bénin, nous utilisons la facture créée
            return [
                'success' => true,
                'payment_url' => $invoiceResult['url'] ?? "https://paydunya.com/checkout/invoice/" . $invoiceResult['token'],
                'token' => $invoiceResult['token'],
                'message' => 'Paiement Moov Bénin initialisé avec succès'
            ];

        } catch (\Exception $e) {
            Log::error('PaydunyaOfficialService - Exception paiement Moov Bénin', [
                'error' => $e->getMessage(),
                'data' => $data
            ]);

            return [
                'success' => false,
                'message' => 'Erreur de communication avec Paydunya Moov Bénin: ' . $e->getMessage()
            ];
        }
    }

    public function payWithMTNBenin(array $data): array
    {
        try {
            Log::info('PaydunyaOfficialService - Paiement MTN Bénin', [
                'data' => $data
            ]);

            // Créer d'abord une facture
            $invoiceResult = $this->createInvoice($data);
            
            if (!$invoiceResult['success']) {
                return $invoiceResult;
            }

            // Pour MTN Bénin, nous utilisons la facture créée
            return [
                'success' => true,
                'payment_url' => $invoiceResult['url'] ?? "https://paydunya.com/checkout/invoice/" . $invoiceResult['token'],
                'token' => $invoiceResult['token'],
                'message' => 'Paiement MTN Bénin initialisé avec succès'
            ];

        } catch (\Exception $e) {
            Log::error('PaydunyaOfficialService - Exception paiement MTN Bénin', [
                'error' => $e->getMessage(),
                'data' => $data
            ]);

            return [
                'success' => false,
                'message' => 'Erreur de communication avec Paydunya MTN Bénin: ' . $e->getMessage()
            ];
        }
    }

    public function payWithTMoneyTogo(array $data): array
    {
        try {
            Log::info('PaydunyaOfficialService - Paiement T-Money Togo', [
                'data' => $data
            ]);

            // Créer d'abord une facture
            $invoiceResult = $this->createInvoice($data);
            
            if (!$invoiceResult['success']) {
                return $invoiceResult;
            }

            // Pour T-Money Togo, nous utilisons la facture créée
            return [
                'success' => true,
                'payment_url' => $invoiceResult['url'] ?? "https://paydunya.com/checkout/invoice/" . $invoiceResult['token'],
                'token' => $invoiceResult['token'],
                'message' => 'Paiement T-Money Togo initialisé avec succès'
            ];

        } catch (\Exception $e) {
            Log::error('PaydunyaOfficialService - Exception paiement T-Money Togo', [
                'error' => $e->getMessage(),
                'data' => $data
            ]);

            return [
                'success' => false,
                'message' => 'Erreur de communication avec Paydunya T-Money Togo: ' . $e->getMessage()
            ];
        }
    }

    public function payWithMoovTogo(array $data): array
    {
        try {
            Log::info('PaydunyaOfficialService - Paiement Moov Togo', [
                'data' => $data
            ]);

            // Créer d'abord une facture
            $invoiceResult = $this->createInvoice($data);
            
            if (!$invoiceResult['success']) {
                return $invoiceResult;
            }

            // Pour Moov Togo, nous utilisons la facture créée
            return [
                'success' => true,
                'payment_url' => $invoiceResult['url'] ?? "https://paydunya.com/checkout/invoice/" . $invoiceResult['token'],
                'token' => $invoiceResult['token'],
                'message' => 'Paiement Moov Togo initialisé avec succès'
            ];

        } catch (\Exception $e) {
            Log::error('PaydunyaOfficialService - Exception paiement Moov Togo', [
                'error' => $e->getMessage(),
                'data' => $data
            ]);

            return [
                'success' => false,
                'message' => 'Erreur de communication avec Paydunya Moov Togo: ' . $e->getMessage()
            ];
        }
    }

    public function payWithOrangeMoneyMali(array $data): array
    {
        try {
            Log::info('PaydunyaOfficialService - Paiement Orange Money Mali', [
                'data' => $data
            ]);

            // Créer d'abord une facture
            $invoiceResult = $this->createInvoice($data);
            
            if (!$invoiceResult['success']) {
                return $invoiceResult;
            }

            // Pour Orange Money Mali, nous utilisons la facture créée
            return [
                'success' => true,
                'payment_url' => $invoiceResult['url'] ?? "https://paydunya.com/checkout/invoice/" . $invoiceResult['token'],
                'token' => $invoiceResult['token'],
                'message' => 'Paiement Orange Money Mali initialisé avec succès'
            ];

        } catch (\Exception $e) {
            Log::error('PaydunyaOfficialService - Exception paiement Orange Money Mali', [
                'error' => $e->getMessage(),
                'data' => $data
            ]);

            return [
                'success' => false,
                'message' => 'Erreur de communication avec Paydunya Orange Money Mali: ' . $e->getMessage()
            ];
        }
    }

    public function payWithMoovMali(array $data): array
    {
        try {
            Log::info('PaydunyaOfficialService - Paiement Moov Mali', [
                'data' => $data
            ]);

            // Créer d'abord une facture
            $invoiceResult = $this->createInvoice($data);
            
            if (!$invoiceResult['success']) {
                return $invoiceResult;
            }

            // Pour Moov Mali, nous utilisons la facture créée
            return [
                'success' => true,
                'payment_url' => $invoiceResult['url'] ?? "https://paydunya.com/checkout/invoice/" . $invoiceResult['token'],
                'token' => $invoiceResult['token'],
                'message' => 'Paiement Moov Mali initialisé avec succès'
            ];

        } catch (\Exception $e) {
            Log::error('PaydunyaOfficialService - Exception paiement Moov Mali', [
                'error' => $e->getMessage(),
                'data' => $data
            ]);

            return [
                'success' => false,
                'message' => 'Erreur de communication avec Paydunya Moov Mali: ' . $e->getMessage()
            ];
        }
    }



    public function checkPaymentStatus(string $token): array
    {
        try {
            Log::info('PaydunyaOfficialService - Vérification statut paiement', [
                'token' => $token
            ]);

            $invoice = new CheckoutInvoice();
            
            if ($invoice->confirm($token)) {
                Log::info('PaydunyaOfficialService - Statut récupéré avec succès', [
                    'status' => $invoice->getStatus(),
                    'customer_name' => $invoice->getCustomerInfo('name'),
                    'customer_email' => $invoice->getCustomerInfo('email'),
                    'customer_phone' => $invoice->getCustomerInfo('phone'),
                    'receipt_url' => $invoice->getReceiptUrl(),
                    'total_amount' => $invoice->getTotalAmount()
                ]);

                return [
                    'success' => true,
                    'status' => $invoice->getStatus(),
                    'customer' => [
                        'name' => $invoice->getCustomerInfo('name'),
                        'email' => $invoice->getCustomerInfo('email'),
                        'phone' => $invoice->getCustomerInfo('phone')
                    ],
                    'receipt_url' => $invoice->getReceiptUrl(),
                    'total_amount' => $invoice->getTotalAmount(),
                    'custom_data' => [
                        'store_id' => $invoice->getCustomData('store_id'),
                        'product_id' => $invoice->getCustomData('product_id'),
                        'payment_method' => $invoice->getCustomData('payment_method'),
                        'transaction_id' => $invoice->getCustomData('transaction_id')
                    ]
                ];
            } else {
                Log::error('PaydunyaOfficialService - Erreur vérification statut', [
                    'status' => $invoice->getStatus(),
                    'response_text' => $invoice->response_text,
                    'response_code' => $invoice->response_code
                ]);

                return [
                    'success' => false,
                    'message' => $invoice->response_text ?? 'Erreur lors de la vérification du statut',
                    'status' => $invoice->response_code ?? 500
                ];
            }

        } catch (\Exception $e) {
            Log::error('PaydunyaOfficialService - Exception vérification statut', [
                'error' => $e->getMessage(),
                'token' => $token
            ]);

            return [
                'success' => false,
                'message' => 'Erreur de communication avec Paydunya: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Initie un paiement via Wave Côte d'Ivoire.
     *
     * @param string $paymentToken Le jeton obtenu lors de la création de la facture.
     * @param string $customerName Le nom complet du client.
     * @param string $customerEmail L'email du client.
     * @param string $customerPhone Le numéro de téléphone Wave du client.
     * @return array|null La réponse de l'API Wave ou null en cas d'échec.
     */
    public function payWithWaveCIAPI(string $paymentToken, string $customerName, string $customerEmail, string $customerPhone): ?array
    {
        try {
            Log::info('PaydunyaOfficialService - Initiation paiement Wave CI API', [
                'payment_token' => $paymentToken,
                'customer_name' => $customerName,
                'customer_email' => $customerEmail,
                'customer_phone' => $customerPhone
            ]);

            $payload = [
                'wave_ci_fullName' => $customerName,
                'wave_ci_email' => $customerEmail,
                'wave_ci_phone' => $customerPhone,
                'wave_ci_payment_token' => $paymentToken,
            ];

            $headers = [
                'Content-Type' => 'application/json',
                'PAYDUNYA-MASTER-KEY' => env('PAYDUNYA_MASTER_KEY'),
                'PAYDUNYA-PUBLIC-KEY' => env('PAYDUNYA_PUBLIC_KEY'),
                'PAYDUNYA-PRIVATE-KEY' => env('PAYDUNYA_PRIVATE_KEY'),
                'PAYDUNYA-TOKEN' => env('PAYDUNYA_TOKEN')
            ];

            Log::info('PaydunyaOfficialService - Appel API Wave CI', [
                'endpoint' => 'https://app.paydunya.com/api/v1/softpay/wave-ci',
                'payload' => $payload,
                'headers' => array_map(function($value) {
                    return substr($value, 0, 10) . '...';
                }, $headers)
            ]);

            $response = Http::timeout(30)
                ->withHeaders($headers)
                ->post('https://app.paydunya.com/api/v1/softpay/wave-ci', $payload);

            Log::info('PaydunyaOfficialService - Réponse API Wave CI', [
                'status' => $response->status(),
                'body' => $response->body()
            ]);

            if ($response->successful() && $response->json('success') === true) {
                return $response->json();
            }

            Log::error('PaydunyaOfficialService - Erreur de paiement Wave CI:', [
                'status' => $response->status(),
                'response' => $response->json()
            ]);
            
            return null;

        } catch (\Exception $e) {
            Log::error('PaydunyaOfficialService - Exception paiement Wave CI', [
                'error' => $e->getMessage(),
                'payment_token' => $paymentToken
            ]);
            
            return null;
        }
    }
} 