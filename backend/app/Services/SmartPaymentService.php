<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

class SmartPaymentService
{
    protected $paydunyaService;
    protected $pawapayService;
    protected $config;

    public function __construct()
    {
        $this->paydunyaService = new PaydunyaOfficialService();
        $this->pawapayService = new PawapayService();
        $this->config = config('payment-providers');
    }

    /**
     * Initialiser un paiement avec fallback intelligent
     */
    public function initializePayment($data)
    {
        $country = $data['country'];
        $paymentMethod = $data['payment_method'];
        
        // Récupérer la configuration du provider
        $providerConfig = $this->getProviderConfig($country, $paymentMethod);
        
        if (!$providerConfig) {
            return [
                'success' => false,
                'error' => 'Méthode de paiement non supportée pour ce pays'
            ];
        }

        // Essayer le provider principal
        $primaryResult = $this->tryProvider($providerConfig['primary'], $data);
        
        if ($primaryResult['success']) {
            Log::info('SmartPayment: Paiement réussi avec le provider principal', [
                'provider' => $providerConfig['primary'],
                'country' => $country,
                'method' => $paymentMethod
            ]);
            return $primaryResult;
        }

        // Si le provider principal a échoué et qu'il y a un fallback
        if ($providerConfig['fallback'] && $this->shouldTriggerFallback($primaryResult['error'])) {
            Log::info('SmartPayment: Tentative de fallback', [
                'primary_provider' => $providerConfig['primary'],
                'fallback_provider' => $providerConfig['fallback'],
                'primary_error' => $primaryResult['error']
            ]);

            $fallbackResult = $this->tryProvider($providerConfig['fallback'], $data);
            
            if ($fallbackResult['success']) {
                Log::info('SmartPayment: Paiement réussi avec le provider de fallback', [
                    'provider' => $providerConfig['fallback'],
                    'country' => $country,
                    'method' => $paymentMethod
                ]);
                return $fallbackResult;
            } else {
                // Les deux providers ont échoué
                Log::error('SmartPayment: Échec des deux providers', [
                    'primary_provider' => $providerConfig['primary'],
                    'fallback_provider' => $providerConfig['fallback'],
                    'primary_error' => $primaryResult['error'],
                    'fallback_error' => $fallbackResult['error']
                ]);

                return [
                    'success' => false,
                    'error' => 'Tous les providers de paiement sont temporairement indisponibles',
                    'details' => [
                        'primary_error' => $primaryResult['error'],
                        'fallback_error' => $fallbackResult['error']
                    ]
                ];
            }
        }

        // Aucun fallback disponible ou erreur non éligible au fallback
        return $primaryResult;
    }

    /**
     * Essayer un provider spécifique
     */
    private function tryProvider($provider, $data)
    {
        $maxRetries = $this->config['services'][$provider]['max_retries'] ?? 3;
        
        for ($attempt = 1; $attempt <= $maxRetries; $attempt++) {
            try {
                $result = $this->callProvider($provider, $data);
                
                if ($result['success']) {
                    return $result;
                }

                // Si c'est la dernière tentative, retourner l'erreur
                if ($attempt === $maxRetries) {
                    return $result;
                }

                // Attendre avant de réessayer (backoff exponentiel)
                $delay = pow(2, $attempt - 1);
                sleep($delay);

            } catch (\Exception $e) {
                Log::error("SmartPayment: Erreur lors de l'appel au provider $provider", [
                    'attempt' => $attempt,
                    'error' => $e->getMessage()
                ]);

                if ($attempt === $maxRetries) {
                    return [
                        'success' => false,
                        'error' => "Erreur de communication avec $provider: " . $e->getMessage()
                    ];
                }
            }
        }

        return [
            'success' => false,
            'error' => "Échec après $maxRetries tentatives avec $provider"
        ];
    }

    /**
     * Appeler le provider approprié
     */
    private function callProvider($provider, $data)
    {
        switch ($provider) {
            case 'paydunya':
                $mappedData = $this->mapDataForPaydunya($data);
                return $this->paydunyaService->createInvoice($mappedData);
            
            case 'pawapay':
                return $this->pawapayService->createDeposit($data);
            
            default:
                throw new \Exception("Provider non supporté: $provider");
        }
    }

    /**
     * Mapper les données pour Paydunya
     */
    private function mapDataForPaydunya($data)
    {
        return [
            'productName' => $data['product_name'] ?? 'Produit par défaut',
            'email' => $data['customer_email'] ?? '',
            'phone' => $data['phone_number'] ?? '',
            'amount' => $data['amount'] ?? 0,
            'currency' => $data['currency'] ?? 'XOF',
            'country' => $this->getCountryName($data['country'] ?? ''),
            'paymentMethod' => $data['payment_method'] ?? '',
            'customerName' => $data['customer_name'] ?? '',
            'orderId' => $data['order_id'] ?? null,
            'customerMessage' => $data['customer_message'] ?? null
        ];
    }

    /**
     * Obtenir le nom complet du pays
     */
    private function getCountryName($countryCode)
    {
        $countries = [
            'CI' => 'Côte d\'Ivoire',
            'CIV' => 'Côte d\'Ivoire',
            'SN' => 'Sénégal',
            'TG' => 'Togo'
        ];
        
        return $countries[$countryCode] ?? $countryCode;
    }

    /**
     * Déterminer si un fallback doit être déclenché
     */
    private function shouldTriggerFallback($error)
    {
        $errorMessage = strtolower($error);
        
        // Erreurs réseau
        foreach ($this->config['fallback_triggers']['network_errors'] as $networkError) {
            if (strpos($errorMessage, $networkError) !== false) {
                return true;
            }
        }

        // Erreurs API
        foreach ($this->config['fallback_triggers']['api_errors'] as $apiError) {
            if (strpos($errorMessage, $apiError) !== false) {
                return true;
            }
        }

        // Erreurs de validation spécifiques
        foreach ($this->config['fallback_triggers']['validation_errors'] as $validationError) {
            if (strpos($errorMessage, $validationError) !== false) {
                return true;
            }
        }

        return false;
    }

    /**
     * Récupérer la configuration d'un provider
     */
    private function getProviderConfig($country, $paymentMethod)
    {
        return $this->config['providers'][$country][$paymentMethod] ?? null;
    }

    /**
     * Vérifier le statut d'un paiement
     */
    public function checkPaymentStatus($provider, $data)
    {
        switch ($provider) {
            case 'paydunya':
                return $this->paydunyaService->checkPaymentStatus($data);
            
            case 'pawapay':
                return $this->pawapayService->checkDepositStatus($data['deposit_id']);
            
            default:
                return [
                    'success' => false,
                    'error' => "Provider non supporté: $provider"
                ];
        }
    }

    /**
     * Obtenir les méthodes de paiement disponibles par pays
     */
    public function getAvailableMethods($country)
    {
        $methods = $this->config['providers'][$country] ?? [];
        
        $availableMethods = [];
        foreach ($methods as $method => $config) {
            if ($config['enabled']) {
                $availableMethods[$method] = [
                    'primary' => $config['primary'],
                    'fallback' => $config['fallback']
                ];
            }
        }

        return $availableMethods;
    }

    /**
     * Obtenir les statistiques de performance des providers
     */
    public function getProviderStats()
    {
        $stats = Cache::get('payment_provider_stats', []);
        
        return [
            'paydunya' => $stats['paydunya'] ?? ['success_rate' => 0, 'total_attempts' => 0],
            'pawapay' => $stats['pawapay'] ?? ['success_rate' => 0, 'total_attempts' => 0]
        ];
    }

    /**
     * Mettre à jour les statistiques d'un provider
     */
    public function updateProviderStats($provider, $success)
    {
        $stats = Cache::get('payment_provider_stats', []);
        
        if (!isset($stats[$provider])) {
            $stats[$provider] = ['success_count' => 0, 'total_attempts' => 0];
        }

        $stats[$provider]['total_attempts']++;
        if ($success) {
            $stats[$provider]['success_count']++;
        }

        $stats[$provider]['success_rate'] = 
            ($stats[$provider]['success_count'] / $stats[$provider]['total_attempts']) * 100;

        Cache::put('payment_provider_stats', $stats, 3600); // Cache 1 heure
    }
} 