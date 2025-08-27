<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class MonerooService
{
    protected $apiKey;
    protected $secretKey;
    protected $environment;
    protected $baseUrl;

    public function __construct($userId = null)
    {
        if ($userId) {
            // Utiliser la configuration de l'utilisateur spécifique
            $userConfig = $this->getUserConfig($userId);
            if ($userConfig) {
                $this->secretKey = decrypt($userConfig->secret_key);
                $this->environment = $userConfig->environment;
            } else {
                // Fallback vers la configuration globale
                $this->secretKey = config('moneroo.secret_key');
                $this->environment = config('moneroo.environment', 'sandbox');
            }
        } else {
            // Utiliser la configuration globale
            $this->secretKey = config('moneroo.secret_key');
            $this->environment = config('moneroo.environment', 'sandbox');
        }
        
        // Utiliser l'API officielle Moneroo
        $this->baseUrl = 'https://api.moneroo.io';
    }

    /**
     * Récupérer la configuration Moneroo d'un utilisateur
     */
    private function getUserConfig($userId)
    {
        return DB::table('moneroo_configs')
            ->where('user_id', $userId)
            ->where('is_active', true)
            ->first();
    }

    /**
     * Valider une clé API Moneroo
     */
    public function validateApiKey($secretKey, $environment): array
    {
        try {
            // Tester la clé en essayant de récupérer les informations du compte
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $secretKey,
                'Content-Type' => 'application/json',
            ])->get($this->baseUrl . '/v1/account');

            if ($response->successful()) {
                return [
                    'valid' => true,
                    'message' => 'Clé API valide'
                ];
            }

            // Si la réponse n'est pas 200, la clé est invalide
            $errorMessage = 'Clé API invalide';
            if ($response->status() === 401) {
                $errorMessage = 'Clé API invalide ou expirée';
            } elseif ($response->status() === 403) {
                $errorMessage = 'Accès refusé avec cette clé API';
            }

            return [
                'valid' => false,
                'error' => $errorMessage,
                'status_code' => $response->status()
            ];

        } catch (\Exception $e) {
            Log::error('Moneroo API key validation error', [
                'error' => $e->getMessage(),
                'environment' => $environment
            ]);

            return [
                'valid' => false,
                'error' => 'Erreur de connexion à l\'API Moneroo: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Créer un paiement
     */
    public function createPayment(array $data)
    {
        try {
            // Préparer les données du client
            $customer = [
                'email' => $data['customer']['email'] ?? $data['customer_email'] ?? '',
                'first_name' => $data['customer']['first_name'] ?? explode(' ', $data['customer_name'] ?? '')[0] ?? '',
                'last_name' => $data['customer']['last_name'] ?? explode(' ', $data['customer_name'] ?? '')[1] ?? '',
                'phone' => $data['customer']['phone'] ?? $data['customer_phone'] ?? '',
                'address' => $data['customer']['address'] ?? '',
                'city' => $data['customer']['city'] ?? '',
                'state' => $data['customer']['state'] ?? '',
                'country' => $data['customer']['country'] ?? 'CI',
                'zip' => $data['customer']['zip'] ?? '',
            ];

            // Préparer les données de paiement
            $paymentData = [
                'amount' => $data['amount'],
                'currency' => $data['currency'] ?? 'XOF',
                'customer' => $customer,
                'description' => $data['description'],
                'return_url' => $data['return_url'] ?? route('payment.success'),
                'metadata' => $data['metadata'] ?? [
                    'order_id' => $data['reference'] ?? uniqid(),
                    'customer_id' => $data['customer_id'] ?? null,
                ],
                'methods' => $data['methods'] ?? ['orange_ci', 'moov_ci', 'mtn_ci'],
            ];

            // Utiliser la classe Moneroo\Payment si disponible
            if (class_exists('Moneroo\Payment')) {
                $monerooPayment = new \Moneroo\Payment();
                $payment = $monerooPayment->init($paymentData);
                
                Log::info('Moneroo payment created successfully', [
                    'payment_id' => $payment->id ?? null,
                    'checkout_url' => $payment->checkout_url ?? null,
                    'reference' => $data['reference'] ?? null
                ]);

                return [
                    'success' => true,
                    'payment_id' => $payment->id ?? null,
                    'checkout_url' => $payment->checkout_url ?? null,
                    'status' => $payment->status ?? null,
                    'reference' => $data['reference'] ?? null
                ];
            }

            // Appel à l'API officielle Moneroo
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->secretKey,
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
            ])->post($this->baseUrl . '/v1/payments/initialize', $paymentData);

            if ($response->successful()) {
                $result = $response->json();
                
                Log::info('Moneroo payment created successfully', [
                    'payment_id' => $result['data']['id'] ?? null,
                    'checkout_url' => $result['data']['checkout_url'] ?? null,
                    'reference' => $data['reference'] ?? null
                ]);

                return $result;
            }

            Log::error('Moneroo payment creation failed', [
                'response' => $response->json(),
                'status' => $response->status()
            ]);

            return null;
        } catch (\Exception $e) {
            Log::error('Moneroo service error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return null;
        }
    }

    /**
     * Vérifier le statut d'un paiement
     */
    public function checkPaymentStatus(string $paymentId)
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->secretKey,
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
            ])->get($this->baseUrl . '/v1/payments/' . $paymentId);

            if ($response->successful()) {
                return $response->json();
            }

            Log::error('Moneroo payment status check failed', [
                'payment_id' => $paymentId,
                'response' => $response->json(),
                'status' => $response->status()
            ]);

            return null;
        } catch (\Exception $e) {
            Log::error('Moneroo service error', [
                'message' => $e->getMessage(),
                'payment_id' => $paymentId
            ]);

            return null;
        }
    }

    /**
     * Traiter un webhook
     */
    public function processWebhook(array $data, string $signature)
    {
        $expectedSignature = hash_hmac('sha256', json_encode($data), $this->secretKey);
        
        if (!hash_equals($expectedSignature, $signature)) {
            Log::error('Moneroo webhook signature verification failed');
            return false;
        }

        // Traiter le webhook selon le type d'événement
        $event = $data['event'] ?? null;
        
        switch ($event) {
            case 'payment.success':
                return $this->handlePaymentSuccess($data);
            case 'payment.failed':
                return $this->handlePaymentFailed($data);
            case 'payment.pending':
                return $this->handlePaymentPending($data);
            default:
                Log::warning('Moneroo webhook event not handled', ['event' => $event]);
                return false;
        }
    }

    /**
     * Gérer un paiement réussi
     */
    protected function handlePaymentSuccess(array $data)
    {
        $paymentId = $data['payment']['id'] ?? null;
        $reference = $data['payment']['reference'] ?? null;
        
        Log::info('Moneroo payment successful', [
            'payment_id' => $paymentId,
            'reference' => $reference
        ]);

        // Ici vous pouvez mettre à jour votre base de données
        // Par exemple, marquer une commande comme payée
        
        return true;
    }

    /**
     * Gérer un paiement échoué
     */
    protected function handlePaymentFailed(array $data)
    {
        $paymentId = $data['payment']['id'] ?? null;
        $reference = $data['payment']['reference'] ?? null;
        
        Log::info('Moneroo payment failed', [
            'payment_id' => $paymentId,
            'reference' => $reference
        ]);

        // Ici vous pouvez mettre à jour votre base de données
        // Par exemple, marquer une commande comme échouée
        
        return true;
    }

    /**
     * Gérer un paiement en attente
     */
    protected function handlePaymentPending(array $data)
    {
        $paymentId = $data['payment']['id'] ?? null;
        $reference = $data['payment']['reference'] ?? null;
        
        Log::info('Moneroo payment pending', [
            'payment_id' => $paymentId,
            'reference' => $reference
        ]);

        // Ici vous pouvez mettre à jour votre base de données
        // Par exemple, marquer une commande comme en attente
        
        return true;
    }
} 