<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
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
            : 'test_master_key';
            
        $publicKey = $this->config['environment'] === 'live'
            ? env('PAYDUNYA_PUBLIC_KEY', $this->config['public_key'])
            : 'test_public_key';
            
        $privateKey = $this->config['environment'] === 'live'
            ? env('PAYDUNYA_PRIVATE_KEY', $this->config['private_key'])
            : 'test_private_key';
            
        $token = $this->config['environment'] === 'live'
            ? env('PAYDUNYA_TOKEN', $this->config['token'])
            : 'test_token';

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
                    'url' => $invoice->getInvoiceUrl(),
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

    public function payWithWaveCI(array $data): array
    {
        try {
            Log::info('PaydunyaOfficialService - Paiement Wave CI', [
                'data' => $data
            ]);

            // Créer d'abord une facture
            $invoiceResult = $this->createInvoice($data);
            
            if (!$invoiceResult['success']) {
                return $invoiceResult;
            }

            // Pour Wave CI, nous utilisons la facture créée
            // Le SDK officiel gère automatiquement la redirection
            return [
                'success' => true,
                'payment_url' => $invoiceResult['url'],
                'token' => $invoiceResult['token'],
                'message' => 'Paiement Wave CI initialisé avec succès'
            ];

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
                'payment_url' => $invoiceResult['url'],
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

            // Créer d'abord une facture
            $invoiceResult = $this->createInvoice($data);
            
            if (!$invoiceResult['success']) {
                return $invoiceResult;
            }

            // Pour MTN CI, nous utilisons la facture créée
            return [
                'success' => true,
                'payment_url' => $invoiceResult['url'],
                'token' => $invoiceResult['token'],
                'message' => 'Paiement MTN CI initialisé avec succès'
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
                'payment_url' => $invoiceResult['url'],
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
} 