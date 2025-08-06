<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PawapayService
{
    private $baseUrl;
    private $token;
    private $isSandbox;

    public function __construct()
    {
        $this->isSandbox = config('services.pawapay.sandbox', true);
        $this->baseUrl = $this->isSandbox 
            ? 'https://api.sandbox.pawapay.io'
            : 'https://api.pawapay.io';
        $this->token = config('services.pawapay.token');
        
        Log::info('Pawapay Service Initialized', [
            'sandbox' => $this->isSandbox,
            'base_url' => $this->baseUrl,
            'token_length' => strlen($this->token),
            'token_preview' => substr($this->token, 0, 50) . '...'
        ]);
    }

    /**
     * Créer un dépôt (paiement) via Pawapay
     */
    public function createDeposit($data)
    {
        try {
            // Nettoyer le numéro de téléphone (supprimer les préfixes +, 0, espaces)
            $phoneNumber = $this->cleanPhoneNumber($data['phone_number']);
            
            $payload = [
                'depositId' => $this->generateDepositId(),
                'payer' => [
                    'type' => 'MMO',
                    'accountDetails' => [
                        'phoneNumber' => $phoneNumber,
                        'provider' => $this->getProviderFromCountry($data['country'], $data['payment_method'])
                    ]
                ],
                'clientReferenceId' => $data['client_reference_id'] ?? 'INV-' . time(),
                'customerMessage' => $data['customer_message'] ?? 'Paiement via Pawapay',
                'amount' => (string) $data['amount'],
                'currency' => $this->getCurrencyFromCountry($data['country']),
                'metadata' => [
                    [
                        'orderId' => $data['order_id'] ?? 'ORD-' . time()
                    ],
                    [
                        'customerId' => $data['customer_email'],
                        'isPII' => true
                    ]
                ]
            ];

            Log::info('Pawapay API Request', [
                'url' => $this->baseUrl . '/deposits',
                'payload' => $payload
            ]);

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->token,
                'Content-Type' => 'application/json'
            ])->post($this->baseUrl . '/v2/deposits', $payload);

            Log::info('Pawapay API Response', [
                'status' => $response->status(),
                'body' => $response->body()
            ]);

            if ($response->successful()) {
                return [
                    'success' => true,
                    'data' => $response->json(),
                    'deposit_id' => $payload['depositId']
                ];
            } else {
                return [
                    'success' => false,
                    'error' => $response->json(),
                    'status' => $response->status()
                ];
            }

        } catch (\Exception $e) {
            Log::error('Pawapay API Error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return [
                'success' => false,
                'error' => 'Erreur de communication avec Pawapay: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Vérifier le statut d'un dépôt
     */
    public function checkDepositStatus($depositId)
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->token,
                'Content-Type' => 'application/json'
            ])->get($this->baseUrl . '/v2/deposits/' . $depositId);

            Log::info('Pawapay Status Check Response', [
                'deposit_id' => $depositId,
                'status' => $response->status(),
                'body' => $response->body()
            ]);

            if ($response->successful()) {
                $data = $response->json();
                
                // Ajouter des informations supplémentaires pour faciliter le traitement
                $data['deposit_id'] = $depositId;
                $data['checked_at'] = now()->toISOString();
                
                // Ajouter des informations de statut avec gestion des erreurs résolues
                $failureReason = $data['failureReason'] ?? null;
                $data['status_info'] = $this->getStatusInfoWithResolvedErrors($data['status'] ?? 'UNKNOWN', $failureReason);
                
                // Ajouter des informations d'erreur si le statut est REJECTED
                if (($data['status'] ?? '') === 'REJECTED' && isset($data['failureReason'])) {
                    $data['failure_info'] = $this->getFailureInfo($data['failureReason']['failureCode'] ?? 'UNKNOWN_ERROR');
                }
                
                return [
                    'success' => true,
                    'data' => $data
                ];
            } else {
                Log::error('Pawapay check status failed', [
                    'deposit_id' => $depositId,
                    'status_code' => $response->status(),
                    'response' => $response->json()
                ]);

                return [
                    'success' => false,
                    'error' => $response->json(),
                    'status_code' => $response->status()
                ];
            }

        } catch (\Exception $e) {
            Log::error('Pawapay check status error', [
                'deposit_id' => $depositId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Renvoyer un callback pour un dépôt
     */
    public function resendCallback($depositId)
    {
        try {
            Log::info('Pawapay: Renvoi de callback pour le dépôt', [
                'deposit_id' => $depositId,
                'endpoint' => $this->baseUrl . '/v2/deposits/resend-callback/' . $depositId
            ]);

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->token,
                'Content-Type' => 'application/json'
            ])->post($this->baseUrl . '/v2/deposits/resend-callback/' . $depositId);

            Log::info('Pawapay: Réponse du renvoi de callback', [
                'status_code' => $response->status(),
                'response' => $response->json()
            ]);

            if ($response->successful()) {
                $data = $response->json();
                
                return [
                    'success' => true,
                    'data' => $data,
                    'message' => 'Callback renvoyé avec succès'
                ];
            } else {
                Log::error('Pawapay: Erreur lors du renvoi de callback', [
                    'status_code' => $response->status(),
                    'response' => $response->json(),
                    'deposit_id' => $depositId
                ]);

                return [
                    'success' => false,
                    'error' => $response->json()
                ];
            }
        } catch (\Exception $e) {
            Log::error('Pawapay: Exception lors du renvoi de callback', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'deposit_id' => $depositId
            ]);

            return [
                'success' => false,
                'error' => [
                    'message' => 'Erreur lors du renvoi de callback',
                    'details' => $e->getMessage()
                ]
            ];
        }
    }

    /**
     * Créer une page de paiement
     */
    public function createPaymentPage($data)
    {
        try {
            Log::info('Pawapay: Création de page de paiement', [
                'data' => $data,
                'endpoint' => $this->baseUrl . '/v2/paymentpage'
            ]);

            $payload = [
                'depositId' => $data['deposit_id'],
                'returnUrl' => $data['return_url'] ?? 'https://coovia.com/payment-success',
                'customerMessage' => $data['customer_message'] ?? 'Paiement Coovia',
                'amountDetails' => [
                    'amount' => $data['amount'],
                    'currency' => $data['currency']
                ],
                'phoneNumber' => $data['phone_number'],
                'language' => $data['language'] ?? 'EN',
                'country' => $data['country'],
                'reason' => $data['reason'] ?? 'Paiement en ligne',
                'metadata' => $data['metadata'] ?? []
            ];

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->token,
                'Content-Type' => 'application/json'
            ])->post($this->baseUrl . '/v2/paymentpage', $payload);

            Log::info('Pawapay: Réponse de création de page de paiement', [
                'status_code' => $response->status(),
                'response' => $response->json()
            ]);

            if ($response->successful()) {
                $data = $response->json();
                
                return [
                    'success' => true,
                    'data' => $data,
                    'message' => 'Page de paiement créée avec succès'
                ];
            } else {
                Log::error('Pawapay: Erreur lors de la création de page de paiement', [
                    'status_code' => $response->status(),
                    'response' => $response->json(),
                    'payload' => $payload
                ]);

                return [
                    'success' => false,
                    'error' => $response->json()
                ];
            }
        } catch (\Exception $e) {
            Log::error('Pawapay: Exception lors de la création de page de paiement', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'data' => $data
            ]);

            return [
                'success' => false,
                'error' => [
                    'message' => 'Erreur lors de la création de page de paiement',
                    'details' => $e->getMessage()
                ]
            ];
        }
    }

    /**
     * Récupérer la configuration active
     */
    public function getActiveConfiguration()
    {
        try {
            Log::info('Pawapay: Récupération de la configuration active', [
                'endpoint' => $this->baseUrl . '/v2/active-conf'
            ]);

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->token,
                'Content-Type' => 'application/json'
            ])->get($this->baseUrl . '/v2/active-conf');

            Log::info('Pawapay: Réponse de la configuration active', [
                'status_code' => $response->status(),
                'response' => $response->json()
            ]);

            if ($response->successful()) {
                $data = $response->json();
                
                // Ajouter des informations utiles pour le frontend
                $data['retrieved_at'] = now()->toISOString();
                $data['environment'] = $this->isSandbox ? 'sandbox' : 'production';
                
                return [
                    'success' => true,
                    'data' => $data,
                    'message' => 'Configuration active récupérée avec succès'
                ];
            } else {
                Log::error('Pawapay: Erreur lors de la récupération de la configuration active', [
                    'status_code' => $response->status(),
                    'response' => $response->json()
                ]);

                return [
                    'success' => false,
                    'error' => $response->json()
                ];
            }
        } catch (\Exception $e) {
            Log::error('Pawapay: Exception lors de la récupération de la configuration active', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return [
                'success' => false,
                'error' => [
                    'message' => 'Erreur lors de la récupération de la configuration active',
                    'details' => $e->getMessage()
                ]
            ];
        }
    }

    /**
     * Générer un ID de dépôt unique (36 caractères requis par Pawapay)
     */
    private function generateDepositId()
    {
        return sprintf(
            '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
            mt_rand(0, 0xffff), mt_rand(0, 0xffff),
            mt_rand(0, 0xffff),
            mt_rand(0, 0x0fff) | 0x4000,
            mt_rand(0, 0x3fff) | 0x8000,
            mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
        );
    }

    /**
     * Obtenir le provider Pawapay selon le pays et la méthode de paiement
     */
    private function getProviderFromCountry($country, $paymentMethod)
    {
        $providers = [
            'ZMB' => [
                'mtn-momo-zambia' => 'MTN_MOMO_ZMB',
                'airtel-money-zambia' => 'AIRTEL_MONEY_ZMB',
                'zamtel-money-zambia' => 'ZAMTEL_MONEY_ZMB'
            ],
            'UG' => [
                'mtn-momo-uganda' => 'MTN_MOMO_UGA',
                'airtel-money-uganda' => 'AIRTEL_MONEY_UGA'
            ],
            'TZ' => [
                'mpesa-tanzania' => 'MPESA_TZA',
                'airtel-money-tanzania' => 'AIRTEL_MONEY_TZA',
                'tigo-pesa-tanzania' => 'TIGO_PESA_TZA'
            ],
            'KE' => [
                'mpesa-kenya' => 'MPESA_KEN',
                'airtel-money-kenya' => 'AIRTEL_MONEY_KEN'
            ],
            'NG' => [
                'mtn-momo-nigeria' => 'MTN_MOMO_NGA',
                'airtel-money-nigeria' => 'AIRTEL_MONEY_NGA'
            ]
        ];

        return $providers[$country][$paymentMethod] ?? 'MTN_MOMO_ZMB';
    }

    /**
     * Nettoyer le numéro de téléphone pour Pawapay
     */
    private function cleanPhoneNumber($phoneNumber)
    {
        // Supprimer seulement les préfixes + et les espaces, garder le préfixe pays
        $cleaned = preg_replace('/[^0-9]/', '', $phoneNumber);
        
        // S'assurer que le numéro commence par le préfixe pays
        $countryPrefixes = [
            '260' => 'ZMB', // Zambie
            '256' => 'UG',  // Ouganda
            '255' => 'TZ',  // Tanzanie
            '254' => 'KE',  // Kenya
            '234' => 'NG'   // Nigeria
        ];
        
        // Vérifier si le numéro a déjà le préfixe pays
        foreach ($countryPrefixes as $prefix => $country) {
            if (strpos($cleaned, $prefix) === 0) {
                return $cleaned; // Garder le préfixe pays
            }
        }
        
        // Si pas de préfixe pays, ajouter celui de la Zambie par défaut
        return '260' . $cleaned;
    }

    /**
     * Obtenir les informations détaillées d'un statut
     */
    private function getStatusInfo($status)
    {
        $statusInfo = [
            'ACCEPTED' => [
                'title' => 'Paiement Accepté',
                'description' => 'Le paiement a été accepté et est en cours de traitement',
                'color' => 'blue',
                'icon' => 'check-circle'
            ],
            'PENDING' => [
                'title' => 'Paiement en Attente',
                'description' => 'Le paiement est en attente de confirmation',
                'color' => 'yellow',
                'icon' => 'clock'
            ],
            'COMPLETED' => [
                'title' => 'Paiement Complété',
                'description' => 'Le paiement a été complété avec succès',
                'color' => 'green',
                'icon' => 'check-circle'
            ],
            'FAILED' => [
                'title' => 'Paiement Échoué',
                'description' => 'Le paiement a échoué',
                'color' => 'red',
                'icon' => 'x-circle'
            ],
            'REJECTED' => [
                'title' => 'Paiement Rejeté',
                'description' => 'Le paiement a été rejeté',
                'color' => 'red',
                'icon' => 'x-circle'
            ],
            'CANCELLED' => [
                'title' => 'Paiement Annulé',
                'description' => 'Le paiement a été annulé',
                'color' => 'gray',
                'icon' => 'x-circle'
            ]
        ];

        return $statusInfo[$status] ?? [
            'title' => 'Statut Inconnu',
            'description' => 'Statut non reconnu: ' . $status,
            'color' => 'gray',
            'icon' => 'help-circle'
        ];
    }

    /**
     * Obtenir les informations détaillées d'un statut avec gestion des erreurs résolues
     */
    private function getStatusInfoWithResolvedErrors($status, $failureReason = null)
    {
        $baseInfo = $this->getStatusInfo($status);
        
        // Si le statut est COMPLETED mais qu'il y a un failureReason, c'est un cas spécial
        if ($status === 'COMPLETED' && $failureReason) {
            $baseInfo['title'] = 'Paiement Complété (Problème Résolu)';
            $baseInfo['description'] = 'Le paiement a été complété avec succès après résolution d\'un problème initial.';
            $baseInfo['hasResolvedError'] = true;
            $baseInfo['resolvedError'] = $failureReason;
        }
        
        return $baseInfo;
    }

    /**
     * Obtenir les informations détaillées d'une erreur
     */
    private function getFailureInfo($failureCode)
    {
        $failureInfo = [
            'PROVIDER_TEMPORARILY_UNAVAILABLE' => [
                'title' => 'Provider Temporairement Indisponible',
                'description' => 'Le service mobile money est temporairement indisponible. Veuillez réessayer plus tard.',
                'color' => 'yellow',
                'icon' => 'warning',
                'suggested_actions' => [
                    'Attendre quelques minutes et réessayer',
                    'Essayer un autre provider mobile money',
                    'Consulter la page de statut des providers',
                    'Contacter le support si le problème persiste'
                ]
            ],
            'INSUFFICIENT_BALANCE' => [
                'title' => 'Solde Insuffisant',
                'description' => 'Le solde du compte mobile money est insuffisant pour effectuer ce paiement.',
                'color' => 'red',
                'icon' => 'money',
                'suggested_actions' => [
                    'Recharger le compte mobile money',
                    'Essayer avec un montant inférieur',
                    'Utiliser un autre compte mobile money',
                    'Contacter le provider pour plus d\'informations'
                ]
            ],
            'INVALID_PAYER_FORMAT' => [
                'title' => 'Format de Numéro Invalide',
                'description' => 'Le format du numéro de téléphone est invalide. Veuillez vérifier le numéro.',
                'color' => 'orange',
                'icon' => 'phone',
                'suggested_actions' => [
                    'Vérifier le format du numéro de téléphone',
                    'S\'assurer que le préfixe pays est inclus',
                    'Supprimer les espaces et caractères spéciaux',
                    'Utiliser un autre numéro de téléphone'
                ]
            ],
            'UNKNOWN_ERROR' => [
                'title' => 'Erreur Inconnue',
                'description' => 'Une erreur inconnue est survenue lors du traitement du paiement.',
                'color' => 'red',
                'icon' => 'error',
                'suggested_actions' => [
                    'Vérifier les informations de paiement',
                    'Réessayer le paiement',
                    'Contacter le support client',
                    'Essayer une autre méthode de paiement'
                ]
            ]
        ];

        return $failureInfo[$failureCode] ?? [
            'title' => 'Erreur de Paiement',
            'description' => 'Une erreur est survenue lors du traitement du paiement.',
            'color' => 'red',
            'icon' => 'error',
            'suggested_actions' => [
                'Vérifier les informations de paiement',
                'Réessayer le paiement',
                'Contacter le support client',
                'Essayer une autre méthode de paiement'
            ]
        ];
    }

    /**
     * Obtenir la devise selon le pays
     */
    private function getCurrencyFromCountry($country)
    {
        $currencies = [
            'ZMB' => 'ZMW',
            'UG' => 'UGX',
            'TZ' => 'TZS',
            'KE' => 'KES',
            'NG' => 'NGN'
        ];

        return $currencies[$country] ?? 'ZMW';
    }
} 