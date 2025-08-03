<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class PayDunyaService
{
    private $masterKey;
    private $privateKey;
    private $publicKey;
    private $token;
    private $environment;
    private $baseUrl;

    public function __construct($userId = null)
    {
        $this->loadConfig($userId);
    }

    /**
     * Charger la configuration PayDunya de l'utilisateur
     */
    private function loadConfig($userId)
    {
        try {
            // Essayer de charger la configuration utilisateur
            if ($userId) {
                $config = DB::table('paydunya_configs')
                    ->where('user_id', $userId)
                    ->first();

                if ($config) {
                    $this->masterKey = decrypt($config->master_key);
                    $this->privateKey = decrypt($config->private_key);
                    $this->publicKey = decrypt($config->public_key);
                    $this->token = decrypt($config->token);
                    $this->environment = $config->environment;
                }
            }

            // Si pas de configuration utilisateur, utiliser la configuration par défaut
            if (!$this->masterKey) {
                $this->masterKey = config('paydunya.master_key');
                $this->privateKey = config('paydunya.private_key');
                $this->publicKey = config('paydunya.public_key');
                $this->token = config('paydunya.token');
                $this->environment = config('paydunya.environment', 'live');
            }

            // URL de base pour PayDunya (production)
            $this->baseUrl = 'https://app.paydunya.com/api/v1';

            Log::info('PayDunya config loaded', [
                'user_id' => $userId,
                'environment' => $this->environment,
                'base_url' => $this->baseUrl,
                'has_master_key' => !empty($this->masterKey),
                'has_private_key' => !empty($this->privateKey),
                'has_token' => !empty($this->token)
            ]);

        } catch (\Exception $e) {
            Log::error('PayDunya config loading error', [
                'user_id' => $userId,
                'error' => $e->getMessage()
            ]);

            // En cas d'erreur, utiliser la configuration par défaut
            $this->masterKey = config('paydunya.master_key');
            $this->privateKey = config('paydunya.private_key');
            $this->publicKey = config('paydunya.public_key');
            $this->token = config('paydunya.token');
            $this->environment = config('paydunya.environment', 'live');
            $this->baseUrl = 'https://app.paydunya.com/api/v1';
        }
    }

    /**
     * Créer une facture de paiement
     */
    public function createPayment($paymentData): array
    {
        try {
            $payload = $this->buildInvoicePayload($paymentData);
            
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'PAYDUNYA-MASTER-KEY' => $this->masterKey,
                'PAYDUNYA-PRIVATE-KEY' => $this->privateKey,
                'PAYDUNYA-TOKEN' => $this->token,
            ])->post($this->baseUrl . '/checkout-invoice/create', $payload);

            if ($response->successful()) {
                $data = $response->json();
                
                if ($data['response_code'] === '00') {
                    return [
                        'success' => true,
                        'invoice_url' => $data['response_text'],
                        'token' => $data['token'],
                        'message' => 'Facture PayDunya créée avec succès'
                    ];
                } else {
                    return [
                        'success' => false,
                        'error' => $data['response_text'] ?? 'Erreur lors de la création de la facture'
                    ];
                }
            }

            return [
                'success' => false,
                'error' => 'Erreur de connexion à PayDunya'
            ];

        } catch (\Exception $e) {
            Log::error('PayDunya payment creation error', [
                'message' => $e->getMessage(),
                'payment_data' => $paymentData
            ]);

            return [
                'success' => false,
                'error' => 'Erreur: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Construire le payload pour la facture
     */
    private function buildInvoicePayload($paymentData): array
    {
        $payload = [
            'invoice' => [
                'total_amount' => $paymentData['amount'],
                'description' => $paymentData['description'] ?? 'Paiement via PayDunya'
            ],
            'store' => [
                'name' => $paymentData['store_name'] ?? 'Ma Boutique'
            ],
            'actions' => [
                'callback_url' => route('paydunya.webhook'),
                'return_url' => route('paydunya.success'),
                'cancel_url' => route('paydunya.cancel')
            ]
        ];

        // Ajouter les articles si fournis
        if (!empty($paymentData['items'])) {
            $items = [];
            foreach ($paymentData['items'] as $index => $item) {
                $items["item_{$index}"] = [
                    'name' => $item['name'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'total_price' => $item['total_price'],
                    'description' => $item['description'] ?? ''
                ];
            }
            $payload['invoice']['items'] = $items;
        }

        // Ajouter les informations client si fournies
        if (!empty($paymentData['customer_info'])) {
            $customer = $paymentData['customer_info'];
            $payload['store']['phone'] = $customer['phone'] ?? '';
            $payload['store']['postal_address'] = $customer['address'] ?? '';
        }

        // Ajouter les données personnalisées
        $payload['custom_data'] = [
            'user_id' => $paymentData['user_id'] ?? null,
            'store_id' => $paymentData['store_id'] ?? null,
            'payment_type' => 'paydunya'
        ];

        return $payload;
    }

    /**
     * Vérifier le statut d'un paiement
     */
    public function checkPaymentStatus($token): array
    {
        try {
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'PAYDUNYA-MASTER-KEY' => $this->masterKey,
                'PAYDUNYA-PRIVATE-KEY' => $this->privateKey,
                'PAYDUNYA-TOKEN' => $this->token,
            ])->get($this->baseUrl . '/checkout-invoice/confirm/' . $token);

            if ($response->successful()) {
                $data = $response->json();
                
                if ($data['response_code'] === '00') {
                    return [
                        'success' => true,
                        'status' => $data['status'] ?? 'pending',
                        'data' => $data
                    ];
                }
            }

            return [
                'success' => false,
                'error' => 'Impossible de vérifier le statut du paiement'
            ];

        } catch (\Exception $e) {
            Log::error('PayDunya status check error', [
                'token' => $token,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'error' => 'Erreur: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Valider les clés API PayDunya
     */
    public function validateApiKeys(): array
    {
        try {
            $testPayload = [
                'invoice' => [
                    'total_amount' => 200, // Minimum requis par PayDunya
                    'description' => 'Test de validation des clés API'
                ],
                'store' => [
                    'name' => 'Test Store'
                ]
            ];

            $url = $this->baseUrl . '/checkout-invoice/create';
            
            Log::info('PayDunya API validation attempt', [
                'url' => $url,
                'base_url' => $this->baseUrl,
                'master_key' => substr($this->masterKey, 0, 10) . '...',
                'private_key' => substr($this->privateKey, 0, 10) . '...',
                'token' => substr($this->token, 0, 10) . '...'
            ]);

            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'PAYDUNYA-MASTER-KEY' => $this->masterKey,
                'PAYDUNYA-PRIVATE-KEY' => $this->privateKey,
                'PAYDUNYA-TOKEN' => $this->token,
            ])->post($url, $testPayload);

            Log::info('PayDunya API response', [
                'status' => $response->status(),
                'body' => $response->body()
            ]);

            if ($response->successful()) {
                $data = $response->json();
                return [
                    'success' => $data['response_code'] === '00',
                    'message' => $data['response_code'] === '00' 
                        ? 'Clés API PayDunya valides' 
                        : 'Clés API PayDunya invalides: ' . ($data['response_text'] ?? 'Erreur inconnue')
                ];
            }

            return [
                'success' => false,
                'message' => 'Erreur de connexion à PayDunya'
            ];

        } catch (\Exception $e) {
            Log::error('PayDunya API validation error', [
                'error' => $e->getMessage(),
                'base_url' => $this->baseUrl ?? 'null'
            ]);

            return [
                'success' => false,
                'message' => 'Erreur: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Paiement par Orange Money Sénégal (QR Code)
     */
    public function payWithOrangeMoneyQR($paymentData): array
    {
        try {
            $payload = [
                'customer_name' => $paymentData['customer_name'],
                'customer_email' => $paymentData['customer_email'],
                'phone_number' => $paymentData['phone_number'],
                'invoice_token' => $paymentData['invoice_token'],
                'api_type' => 'QRCODE'
            ];

            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'PAYDUNYA-MASTER-KEY' => $this->masterKey,
                'PAYDUNYA-PRIVATE-KEY' => $this->privateKey,
                'PAYDUNYA-TOKEN' => $this->token,
            ])->post($this->baseUrl . '/softpay/new-orange-money-senegal', $payload);

            if ($response->successful()) {
                $data = $response->json();
                
                if ($data['success']) {
                    return [
                        'success' => true,
                        'url' => $data['url'],
                        'om_url' => $data['other_url']['om_url'] ?? null,
                        'maxit_url' => $data['other_url']['maxit_url'] ?? null,
                        'message' => $data['message']
                    ];
                }
            }

            return [
                'success' => false,
                'error' => 'Erreur lors du paiement Orange Money'
            ];

        } catch (\Exception $e) {
            Log::error('Orange Money QR payment error', [
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'error' => 'Erreur: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Paiement par Orange Money Sénégal (OTP)
     */
    public function payWithOrangeMoneyOTP($paymentData): array
    {
        try {
            $payload = [
                'customer_name' => $paymentData['customer_name'],
                'customer_email' => $paymentData['customer_email'],
                'phone_number' => $paymentData['phone_number'],
                'authorization_code' => $paymentData['authorization_code'],
                'invoice_token' => $paymentData['invoice_token'],
                'api_type' => 'OTPCODE'
            ];

            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'PAYDUNYA-MASTER-KEY' => $this->masterKey,
                'PAYDUNYA-PRIVATE-KEY' => $this->privateKey,
                'PAYDUNYA-TOKEN' => $this->token,
            ])->post($this->baseUrl . '/softpay/new-orange-money-senegal', $payload);

            if ($response->successful()) {
                $data = $response->json();
                
                if ($data['success']) {
                    return [
                        'success' => true,
                        'message' => $data['message']
                    ];
                }
            }

            return [
                'success' => false,
                'error' => 'Erreur lors du paiement Orange Money OTP'
            ];

        } catch (\Exception $e) {
            Log::error('Orange Money OTP payment error', [
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'error' => 'Erreur: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Paiement par Free Money Sénégal
     */
    public function payWithFreeMoney($paymentData): array
    {
        try {
            $payload = [
                'customer_name' => $paymentData['customer_name'],
                'customer_email' => $paymentData['customer_email'],
                'phone_number' => $paymentData['phone_number'],
                'payment_token' => $paymentData['payment_token']
            ];

            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'PAYDUNYA-MASTER-KEY' => $this->masterKey,
                'PAYDUNYA-PRIVATE-KEY' => $this->privateKey,
                'PAYDUNYA-TOKEN' => $this->token,
            ])->post($this->baseUrl . '/softpay/free-money-senegal', $payload);

            if ($response->successful()) {
                $data = $response->json();
                
                if ($data['success']) {
                    return [
                        'success' => true,
                        'message' => $data['message'],
                        'data' => $data['data'] ?? null
                    ];
                }
            }

            return [
                'success' => false,
                'error' => 'Erreur lors du paiement Free Money'
            ];

        } catch (\Exception $e) {
            Log::error('Free Money payment error', [
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'error' => 'Erreur: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Paiement par Wave Sénégal
     */
    public function payWithWave($paymentData): array
    {
        try {
            $payload = [
                'wave_senegal_fullName' => $paymentData['customer_name'],
                'wave_senegal_email' => $paymentData['customer_email'],
                'wave_senegal_phone' => $paymentData['phone_number'],
                'wave_senegal_payment_token' => $paymentData['payment_token']
            ];

            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'PAYDUNYA-MASTER-KEY' => $this->masterKey,
                'PAYDUNYA-PRIVATE-KEY' => $this->privateKey,
                'PAYDUNYA-TOKEN' => $this->token,
            ])->post($this->baseUrl . '/softpay/wave-senegal', $payload);

            if ($response->successful()) {
                $data = $response->json();
                
                if ($data['success']) {
                    return [
                        'success' => true,
                        'url' => $data['url'],
                        'message' => $data['message']
                    ];
                }
            }

            return [
                'success' => false,
                'error' => 'Erreur lors du paiement Wave'
            ];

        } catch (\Exception $e) {
            Log::error('Wave payment error', [
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'error' => 'Erreur: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Paiement par carte bancaire
     */
    public function payWithCard($paymentData): array
    {
        try {
            $payload = [
                'full_name' => $paymentData['full_name'],
                'email' => $paymentData['email'],
                'card_number' => $paymentData['card_number'],
                'card_cvv' => $paymentData['card_cvv'],
                'card_expired_date_year' => $paymentData['card_expired_date_year'],
                'card_expired_date_month' => $paymentData['card_expired_date_month'],
                'token' => $paymentData['token']
            ];

            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'PAYDUNYA-MASTER-KEY' => $this->masterKey,
                'PAYDUNYA-PRIVATE-KEY' => $this->privateKey,
                'PAYDUNYA-TOKEN' => $this->token,
            ])->post($this->baseUrl . '/softpay/card', $payload);

            if ($response->successful()) {
                $data = $response->json();
                
                if ($data['success']) {
                    return [
                        'success' => true,
                        'message' => $data['message'],
                        'url' => $data['url'] ?? null // Pour 3DS
                    ];
                }
            }

            return [
                'success' => false,
                'error' => 'Erreur lors du paiement par carte'
            ];

        } catch (\Exception $e) {
            Log::error('Card payment error', [
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'error' => 'Erreur: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Vérifier la signature du webhook
     */
    public function verifyWebhookSignature($data, $signature): bool
    {
        try {
            $expectedSignature = hash_hmac('sha512', json_encode($data), $this->masterKey);
            return hash_equals($expectedSignature, $signature);
        } catch (\Exception $e) {
            Log::error('PayDunya webhook signature verification error', [
                'error' => $e->getMessage()
            ]);
            return false;
        }
    }
} 