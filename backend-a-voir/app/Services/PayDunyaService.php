<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PaydunyaService
{
    private $config;
    private $baseUrl;
    private $headers;

    public function __construct()
    {
        Log::info('PaydunyaService - Constructeur appelé');
        
        $this->config = config('paydunya');
        $this->baseUrl = $this->config['environment'] === 'live' 
            ? 'https://app.paydunya.com/api/v1/'
            : 'https://app.paydunya.com/sandbox-api/v1/';
        
        $this->headers = [
            'Content-Type' => 'application/json',
            'PAYDUNYA-MASTER-KEY' => $this->config['master_key'],
            'PAYDUNYA-PRIVATE-KEY' => $this->config['private_key'],
            'PAYDUNYA-PUBLIC-KEY' => $this->config['public_key'],
            'PAYDUNYA-TOKEN' => $this->config['token']
        ];
        
        Log::info('PaydunyaService - Configuration chargée', [
            'baseUrl' => $this->baseUrl,
            'environment' => $this->config['environment']
        ]);
    }

    public function createInvoice(array $data): array
    {
        try {
            Log::info('PaydunyaService - Création de facture', [
                'data' => $data
            ]);

            $invoiceData = [
                'invoice' => [
                    'items' => [
                        [
                            'name' => $data['productName'],
                            'quantity' => 1,
                            'unit_price' => $data['amount'],
                            'total_price' => $data['amount'],
                            'description' => 'Achat en ligne'
                        ]
                    ],
                    'total_amount' => $data['amount'],
                    'description' => 'Achat: ' . $data['productName']
                ],
                
                'store' => [
                    'name' => 'Boutique ' . $data['storeId']
                ],
                
                'custom_data' => [
                    'store_id' => $data['storeId'],
                    'product_id' => $data['productId'],
                    'payment_method' => $data['paymentMethod'],
                    'payment_country' => $data['paymentCountry']
                ],
                
                'actions' => [
                    'callback_url' => $this->config['webhook_url'],
                    'return_url' => $this->config['success_url'],
                    'cancel_url' => $this->config['cancel_url']
                ],
                
                'mode' => $this->config['environment'] === 'live' ? 'live' : 'test'
            ];

            Log::info('PaydunyaService - Requête création facture', [
                'url' => $this->baseUrl . 'checkout/invoice',
                'data' => $invoiceData
            ]);

            $response = Http::withHeaders($this->headers)
                ->post($this->baseUrl . 'checkout/invoice', $invoiceData);

            Log::info('Paydunya Invoice Response', [
                'status' => $response->status(),
                'body' => $response->json()
            ]);

            if ($response->successful()) {
                $responseData = $response->json();
                return [
                    'success' => true,
                    'token' => $responseData['token'] ?? null,
                    'url' => $responseData['url'] ?? null,
                    'data' => $responseData
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'Erreur lors de la création de la facture: ' . $response->body(),
                    'status' => $response->status()
                ];
            }

        } catch (\Exception $e) {
            Log::error('Paydunya Invoice Error', [
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
            Log::info('Paydunya Wave CI - Début du processus', [
                'data' => $data
            ]);
            
            // Créer d'abord une facture
            $invoiceResult = $this->createInvoice($data);
            
            Log::info('Paydunya Wave CI - Résultat création facture', [
                'invoiceResult' => $invoiceResult
            ]);
            
            if (!$invoiceResult['success']) {
                return $invoiceResult;
            }
            
            $token = $invoiceResult['token'];
            
            Log::info('Paydunya Wave CI - Token de facture obtenu', [
                'token' => $token
            ]);
            
            // Préparer les données selon l'API Wave CI
            $paymentData = [
                'wave_ci_fullName' => $data['customer']['firstName'] . ' ' . $data['customer']['lastName'],
                'wave_ci_email' => $data['customer']['email'],
                'wave_ci_phone' => $data['customer']['phone'],
                'wave_ci_payment_token' => $token
            ];

            Log::info('Paydunya Wave CI Request', [
                'url' => $this->baseUrl . 'softpay/wave-ci',
                'data' => $paymentData
            ]);

            $response = Http::withHeaders($this->headers)
                ->post($this->baseUrl . 'softpay/wave-ci', $paymentData);

            Log::info('Paydunya Wave CI Response', [
                'status' => $response->status(),
                'body' => $response->json()
            ]);

            if ($response->successful()) {
                $responseData = $response->json();
                
                if (isset($responseData['success']) && $responseData['success']) {
                    return [
                        'success' => true,
                        'url' => $responseData['url'] ?? null,
                        'token' => $token,
                        'fees' => $responseData['fees'] ?? 100,
                        'currency' => $responseData['currency'] ?? 'XOF',
                        'message' => $responseData['message'] ?? 'Paiement Wave CI initialisé avec succès'
                    ];
                } else {
                    return [
                        'success' => false,
                        'message' => $responseData['message'] ?? 'Erreur lors du paiement Wave CI'
                    ];
                }
            } else {
                return [
                    'success' => false,
                    'message' => 'Erreur lors du paiement Wave CI: ' . $response->body(),
                    'status' => $response->status()
                ];
            }

        } catch (\Exception $e) {
            Log::error('Paydunya Wave CI Error', [
                'error' => $e->getMessage(),
                'data' => $data
            ]);

            return [
                'success' => false,
                'message' => 'Erreur de communication avec Paydunya: ' . $e->getMessage()
            ];
        }
    }

    public function payWithOrangeMoneyCI(array $data): array
    {
        try {
            Log::info('Paydunya Orange Money CI - Début du processus', [
                'data' => $data
            ]);
            
            // Créer d'abord une facture
            $invoiceResult = $this->createInvoice($data);
            
            Log::info('Paydunya Orange Money CI - Résultat création facture', [
                'invoiceResult' => $invoiceResult
            ]);
            
            if (!$invoiceResult['success']) {
                return $invoiceResult;
            }
            
            $token = $invoiceResult['token'];
            
            Log::info('Paydunya Orange Money CI - Token de facture obtenu', [
                'token' => $token
            ]);
            
            // Préparer les données selon l'API Orange Money CI
            $paymentData = [
                'orange_money_ci_fullName' => $data['customer']['firstName'] . ' ' . $data['customer']['lastName'],
                'orange_money_ci_email' => $data['customer']['email'],
                'orange_money_ci_phone' => $data['customer']['phone'],
                'orange_money_ci_payment_token' => $token
            ];

            Log::info('Paydunya Orange Money CI Request', [
                'url' => $this->baseUrl . 'softpay/orange-money-ci',
                'data' => $paymentData
            ]);

            $response = Http::withHeaders($this->headers)
                ->post($this->baseUrl . 'softpay/orange-money-ci', $paymentData);

            Log::info('Paydunya Orange Money CI Response', [
                'status' => $response->status(),
                'body' => $response->json()
            ]);

            if ($response->successful()) {
                $responseData = $response->json();
                
                if (isset($responseData['success']) && $responseData['success']) {
                    return [
                        'success' => true,
                        'url' => $responseData['url'] ?? null,
                        'token' => $token,
                        'fees' => $responseData['fees'] ?? 100,
                        'currency' => $responseData['currency'] ?? 'XOF',
                        'message' => $responseData['message'] ?? 'Paiement Orange Money CI initialisé avec succès'
                    ];
                } else {
                    return [
                        'success' => false,
                        'message' => $responseData['message'] ?? 'Erreur lors du paiement Orange Money CI'
                    ];
                }
            } else {
                return [
                    'success' => false,
                    'message' => 'Erreur lors du paiement Orange Money CI: ' . $response->body(),
                    'status' => $response->status()
                ];
            }

        } catch (\Exception $e) {
            Log::error('Paydunya Orange Money CI Error', [
                'error' => $e->getMessage(),
                'data' => $data
            ]);

            return [
                'success' => false,
                'message' => 'Erreur de communication avec Paydunya: ' . $e->getMessage()
            ];
        }
    }

    public function payWithMTNCI(array $data): array
    {
        try {
            Log::info('Paydunya MTN CI - Début du processus', [
                'data' => $data
            ]);
            
            // Créer d'abord une facture
            $invoiceResult = $this->createInvoice($data);
            
            Log::info('Paydunya MTN CI - Résultat création facture', [
                'invoiceResult' => $invoiceResult
            ]);
            
            if (!$invoiceResult['success']) {
                return $invoiceResult;
            }
            
            $token = $invoiceResult['token'];
            
            Log::info('Paydunya MTN CI - Token de facture obtenu', [
                'token' => $token
            ]);
            
            // Préparer les données selon l'API MTN CI
            $paymentData = [
                'mtn_ci_fullName' => $data['customer']['firstName'] . ' ' . $data['customer']['lastName'],
                'mtn_ci_email' => $data['customer']['email'],
                'mtn_ci_phone' => $data['customer']['phone'],
                'mtn_ci_payment_token' => $token
            ];

            Log::info('Paydunya MTN CI Request', [
                'url' => $this->baseUrl . 'softpay/mtn-ci',
                'data' => $paymentData
            ]);

            $response = Http::withHeaders($this->headers)
                ->post($this->baseUrl . 'softpay/mtn-ci', $paymentData);

            Log::info('Paydunya MTN CI Response', [
                'status' => $response->status(),
                'body' => $response->json()
            ]);

            if ($response->successful()) {
                $responseData = $response->json();
                
                if (isset($responseData['success']) && $responseData['success']) {
                    return [
                        'success' => true,
                        'url' => $responseData['url'] ?? null,
                        'token' => $token,
                        'fees' => $responseData['fees'] ?? 100,
                        'currency' => $responseData['currency'] ?? 'XOF',
                        'message' => $responseData['message'] ?? 'Paiement MTN CI initialisé avec succès'
                    ];
                } else {
                    return [
                        'success' => false,
                        'message' => $responseData['message'] ?? 'Erreur lors du paiement MTN CI'
                    ];
                }
            } else {
                return [
                    'success' => false,
                    'message' => 'Erreur lors du paiement MTN CI: ' . $response->body(),
                    'status' => $response->status()
                ];
            }

        } catch (\Exception $e) {
            Log::error('Paydunya MTN CI Error', [
                'error' => $e->getMessage(),
                'data' => $data
            ]);

            return [
                'success' => false,
                'message' => 'Erreur de communication avec Paydunya: ' . $e->getMessage()
            ];
        }
    }

    public function payWithMoovCI(array $data): array
    {
        try {
            Log::info('Paydunya Moov CI - Début du processus', [
                'data' => $data
            ]);
            
            // Créer d'abord une facture
            $invoiceResult = $this->createInvoice($data);
            
            Log::info('Paydunya Moov CI - Résultat création facture', [
                'invoiceResult' => $invoiceResult
            ]);
            
            if (!$invoiceResult['success']) {
                return $invoiceResult;
            }
            
            $token = $invoiceResult['token'];
            
            Log::info('Paydunya Moov CI - Token de facture obtenu', [
                'token' => $token
            ]);
            
            // Préparer les données selon l'API Moov CI
            $paymentData = [
                'moov_ci_fullName' => $data['customer']['firstName'] . ' ' . $data['customer']['lastName'],
                'moov_ci_email' => $data['customer']['email'],
                'moov_ci_phone' => $data['customer']['phone'],
                'moov_ci_payment_token' => $token
            ];

            Log::info('Paydunya Moov CI Request', [
                'url' => $this->baseUrl . 'softpay/moov-ci',
                'data' => $paymentData
            ]);

            $response = Http::withHeaders($this->headers)
                ->post($this->baseUrl . 'softpay/moov-ci', $paymentData);

            Log::info('Paydunya Moov CI Response', [
                'status' => $response->status(),
                'body' => $response->json()
            ]);

            if ($response->successful()) {
                $responseData = $response->json();
                
                if (isset($responseData['success']) && $responseData['success']) {
                    return [
                        'success' => true,
                        'url' => $responseData['url'] ?? null,
                        'token' => $token,
                        'fees' => $responseData['fees'] ?? 100,
                        'currency' => $responseData['currency'] ?? 'XOF',
                        'message' => $responseData['message'] ?? 'Paiement Moov CI initialisé avec succès'
                    ];
                } else {
                    return [
                        'success' => false,
                        'message' => $responseData['message'] ?? 'Erreur lors du paiement Moov CI'
                    ];
                }
            } else {
                return [
                    'success' => false,
                    'message' => 'Erreur lors du paiement Moov CI: ' . $response->body(),
                    'status' => $response->status()
                ];
            }

        } catch (\Exception $e) {
            Log::error('Paydunya Moov CI Error', [
                'error' => $e->getMessage(),
                'data' => $data
            ]);

            return [
                'success' => false,
                'message' => 'Erreur de communication avec Paydunya: ' . $e->getMessage()
            ];
        }
    }

    public function checkPaymentStatus(string $token): array
    {
        try {
            $response = Http::withHeaders($this->headers)
                ->get($this->baseUrl . 'checkout/invoice/' . $token);

            if ($response->successful()) {
                $responseData = $response->json();
                return [
                    'success' => true,
                    'status' => $responseData['status'] ?? 'unknown',
                    'data' => $responseData
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'Erreur lors de la vérification du statut: ' . $response->body(),
                    'status' => $response->status()
                ];
            }

        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => 'Erreur de communication avec Paydunya: ' . $e->getMessage()
            ];
        }
    }
}
