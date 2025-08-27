<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Services\MonerooService;
use App\Services\PayDunyaService;
use App\Services\PawapayService;

class PaymentGatewayService
{
    private $userId;
    private $storeId;

    public function __construct($userId = null, $storeId = null)
    {
        $this->userId = $userId ?? auth()->id();
        $this->storeId = $storeId;
    }

    /**
     * Détecter automatiquement la passerelle de paiement à utiliser
     */
    public function detectPaymentGateway(): array
    {
        // Vérifier si l'utilisateur a configuré Moneroo
        $monerooConfig = $this->getMonerooConfig();
        
        if ($monerooConfig && $monerooConfig->is_connected) {
            return [
                'gateway' => 'moneroo',
                'service' => new MonerooService($this->userId),
                'config' => $monerooConfig,
                'priority' => 'user_configured'
            ];
        }

        // Utiliser les passerelles par défaut (PayDunya + Pawapay)
        return [
            'gateway' => 'default',
            'service' => null, // Sera déterminé selon le contexte
            'config' => null,
            'priority' => 'default'
        ];
    }

    /**
     * Créer un paiement avec la passerelle appropriée
     */
    public function createPayment($paymentData): array
    {
        $gatewayInfo = $this->detectPaymentGateway();
        
        Log::info('Payment gateway detected', [
            'user_id' => $this->userId,
            'gateway' => $gatewayInfo['gateway'],
            'priority' => $gatewayInfo['priority']
        ]);

        switch ($gatewayInfo['gateway']) {
            case 'moneroo':
                return $this->createMonerooPayment($paymentData, $gatewayInfo['service']);
            
            case 'default':
                return $this->createDefaultPayment($paymentData);
            
            default:
                throw new \Exception('Passerelle de paiement non reconnue');
        }
    }

    /**
     * Créer un paiement Moneroo
     */
    private function createMonerooPayment($paymentData, $monerooService): array
    {
        try {
            $result = $monerooService->createPayment($paymentData);
            
            if ($result['success']) {
                // Sauvegarder les informations de paiement
                $this->savePaymentInfo($paymentData, 'moneroo', $result['payment_id'] ?? null);
                
                return [
                    'success' => true,
                    'gateway' => 'moneroo',
                    'redirect_url' => $result['checkout_url'],
                    'payment_id' => $result['payment_id'] ?? null,
                    'message' => 'Paiement Moneroo créé avec succès'
                ];
            }

            return [
                'success' => false,
                'gateway' => 'moneroo',
                'message' => $result['error'] ?? 'Erreur lors de la création du paiement Moneroo'
            ];

        } catch (\Exception $e) {
            Log::error('Moneroo payment creation error', [
                'message' => $e->getMessage(),
                'user_id' => $this->userId
            ]);

            return [
                'success' => false,
                'gateway' => 'moneroo',
                'message' => 'Erreur: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Créer un paiement avec les passerelles par défaut
     */
    private function createDefaultPayment($paymentData): array
    {
        // Pour l'instant, utiliser PayDunya par défaut
        // Plus tard, on pourra implémenter une logique de sélection
        // ou proposer les deux options à l'utilisateur
        
        try {
            $paydunyaService = new PayDunyaService($this->userId);
            $result = $paydunyaService->createPayment($paymentData);
            
            if ($result['success']) {
                // Sauvegarder les informations de paiement
                $this->savePaymentInfo($paymentData, 'paydunya', $result['token'] ?? null);
                
                return [
                    'success' => true,
                    'gateway' => 'paydunya',
                    'redirect_url' => $result['invoice_url'],
                    'payment_id' => $result['token'] ?? null,
                    'message' => 'Paiement PayDunya créé avec succès'
                ];
            }

            return [
                'success' => false,
                'gateway' => 'paydunya',
                'message' => $result['error'] ?? 'Erreur lors de la création du paiement PayDunya'
            ];

        } catch (\Exception $e) {
            Log::error('Default payment creation error', [
                'message' => $e->getMessage(),
                'user_id' => $this->userId
            ]);

            return [
                'success' => false,
                'gateway' => 'default',
                'message' => 'Erreur: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Récupérer la configuration Moneroo de l'utilisateur
     */
    private function getMonerooConfig()
    {
        try {
            return DB::table('moneroo_configs')
                ->where('user_id', $this->userId)
                ->where('is_connected', true)
                ->first();
        } catch (\Exception $e) {
            Log::error('Error retrieving Moneroo config', [
                'user_id' => $this->userId,
                'error' => $e->getMessage()
            ]);
            return null;
        }
    }

    /**
     * Sauvegarder les informations de paiement
     */
    private function savePaymentInfo($paymentData, $gateway, $paymentId): void
    {
        try {
            DB::table('payment_logs')->insert([
                'user_id' => $this->userId,
                'store_id' => $this->storeId,
                'gateway' => $gateway,
                'payment_id' => $paymentId,
                'amount' => $paymentData['amount'] ?? 0,
                'currency' => $paymentData['currency'] ?? 'XOF',
                'description' => $paymentData['description'] ?? '',
                'status' => 'pending',
                'metadata' => json_encode($paymentData),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        } catch (\Exception $e) {
            Log::error('Error saving payment info', [
                'user_id' => $this->userId,
                'gateway' => $gateway,
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Vérifier le statut d'un paiement
     */
    public function checkPaymentStatus($paymentId, $gateway): array
    {
        switch ($gateway) {
            case 'moneroo':
                $monerooService = new MonerooService($this->userId);
                return $monerooService->checkPaymentStatus($paymentId);
            
            case 'paydunya':
                $paydunyaService = new PayDunyaService($this->userId);
                return $paydunyaService->checkPaymentStatus($paymentId);
            
            default:
                return [
                    'success' => false,
                    'message' => 'Passerelle non supportée'
                ];
        }
    }

    /**
     * Obtenir les statistiques de paiement par passerelle
     */
    public function getPaymentStats(): array
    {
        try {
            $stats = DB::table('payment_logs')
                ->where('user_id', $this->userId)
                ->selectRaw('
                    gateway,
                    COUNT(*) as total_payments,
                    SUM(CASE WHEN status = "completed" THEN 1 ELSE 0 END) as successful_payments,
                    SUM(CASE WHEN status = "completed" THEN amount ELSE 0 END) as total_amount
                ')
                ->groupBy('gateway')
                ->get();

            return [
                'success' => true,
                'stats' => $stats
            ];
        } catch (\Exception $e) {
            Log::error('Error getting payment stats', [
                'user_id' => $this->userId,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Erreur lors de la récupération des statistiques'
            ];
        }
    }

    /**
     * Obtenir l'historique des paiements
     */
    public function getPaymentHistory($limit = 10): array
    {
        try {
            $payments = DB::table('payment_logs')
                ->where('user_id', $this->userId)
                ->orderBy('created_at', 'desc')
                ->limit($limit)
                ->get();

            return [
                'success' => true,
                'payments' => $payments
            ];
        } catch (\Exception $e) {
            Log::error('Error getting payment history', [
                'user_id' => $this->userId,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Erreur lors de la récupération de l\'historique'
            ];
        }
    }
} 