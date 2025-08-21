<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Services\PaydunyaOfficialService;
use Illuminate\Validation\ValidationException;

class PaymentController extends Controller
{
    /**
     * Initialiser un paiement Paydunya
     */
    public function initializePayment(Request $request): JsonResponse
    {
        try {
            Log::info('Initialisation paiement', $request->all());
            Log::info('Données reçues détaillées', [
                'storeId' => $request->input('storeId'),
                'productId' => $request->input('productId'),
                'productName' => $request->input('productName'),
                'amount' => $request->input('amount'),
                'currency' => $request->input('currency'),
                'customer' => $request->input('customer'),
                'paymentMethod' => $request->input('paymentMethod'),
                'paymentCountry' => $request->input('paymentCountry'),
            ]);

            $data = $request->validate([
                'storeId' => 'nullable|string',
                'productId' => 'nullable|string',
                'productName' => 'nullable|string',
                'productDescription' => 'nullable|string',
                'unit_price' => 'nullable|numeric|min:100',
                'quantity' => 'nullable|integer|min:1',
                'amount' => 'required|numeric|min:100',
                'currency' => 'required|string|in:XOF,XAF,EUR,USD',
                'tva_amount' => 'nullable|numeric|min:0',
                'shipping_amount' => 'nullable|numeric|min:0',
                'service_fee' => 'nullable|numeric|min:0',
                'custom_taxes' => 'nullable|array',
                'custom_taxes.*.name' => 'nullable|string',
                'custom_taxes.*.amount' => 'nullable|numeric|min:0',
                'custom_data' => 'nullable|array',
                'context' => 'nullable|string|in:contest,phone_purchase,subscription,delivery',
                'contest_category' => 'nullable|string',
                'contest_period' => 'nullable|string',
                'winner_number' => 'nullable|integer',
                'prize_description' => 'nullable|string',
                'phone_brand' => 'nullable|string',
                'imei' => 'nullable|string',
                'phone_model' => 'nullable|string',
                'subscription_type' => 'nullable|string',
                'duration' => 'nullable|string',
                'renewal_date' => 'nullable|string',
                'delivery_address' => 'nullable|string',
                'delivery_city' => 'nullable|string',
                'delivery_phone' => 'nullable|string',
                'delivery_instructions' => 'nullable|string',
                'customer' => 'required|array',
                'customer.email' => 'required|email',
                'customer.firstName' => 'required|string|min:2',
                'customer.lastName' => 'required|string|min:2',
                'customer.phone' => 'required|string|min:8',
                'paymentMethod' => 'required|string',
                'paymentCountry' => 'required|string',
            ]);

            // Ajouter des valeurs par défaut si manquantes
            $data['storeId'] = $data['storeId'] ?? 'default-store';
            $data['productId'] = $data['productId'] ?? 'default-product';
            $data['productName'] = $data['productName'] ?? 'Produit';
            $data['productDescription'] = $data['productDescription'] ?? 'Description du produit';

            // Initialiser le vrai paiement Paydunya
            $paydunyaResponse = $this->initializePaydunyaPayment($data);

            if ($paydunyaResponse['success']) {
                Log::info('Paiement Paydunya initialisé', [
                    'store_id' => $data['storeId'],
                    'product_id' => $data['productId'],
                    'amount' => $data['amount'],
                    'payment_method' => $data['paymentMethod'],
                    'paydunya_token' => $paydunyaResponse['token'] ?? null
                ]);

                return response()->json([
                    'success' => true,
                    'message' => 'Paiement initialisé avec succès',
                    'data' => [
                        'payment_url' => $paydunyaResponse['payment_url'] ?? null,
                        'token' => $paydunyaResponse['token'] ?? null,
                        'qr_code' => $paydunyaResponse['qr_code'] ?? null,
                    ]
                ]);
            } else {
                Log::error('Erreur lors de l\'initialisation du paiement Paydunya', [
                    'error' => $paydunyaResponse['message'] ?? 'Erreur inconnue',
                    'data' => $data
                ]);

                return response()->json([
                    'success' => false,
                    'message' => 'Erreur lors de l\'initialisation du paiement',
                    'error' => $paydunyaResponse['message'] ?? 'Erreur inconnue'
                ], 500);
            }

        } catch (\Exception $e) {
            Log::error('Erreur paiement', ['error' => $e->getMessage()]);
            
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'initialisation du paiement'
            ], 500);
        }
    }

    /**
     * Initialiser un vrai paiement Paydunya selon la méthode
     */
    private function initializePaydunyaPayment(array $data): array
    {
        try {
            $config = config('paydunya');
            $paymentMethod = $data['paymentMethod'];
            
            // Préparer les données selon la méthode de paiement
            switch ($paymentMethod) {
                case 'wave-ci':
                    return $this->initializeWaveCIPayment($data);
                    
                case 'orange-money-ci':
                    return $this->initializeOrangeMoneyCIPayment($data);
                    
                case 'mtn-ci':
                    return $this->initializeMTNCIPayment($data);
                    
                case 'moov-ci':
                    return $this->initializeMoovCIPayment($data);
                    
                case 'orange-money-burkina':
                    return $this->initializeOrangeMoneyBurkinaPayment($data);
                    
                case 'orange-money-senegal':
                    return $this->initializeOrangeMoneySenegalPayment($data);
                    
                case 'free-money-senegal':
                    return $this->initializeFreeMoneySenegalPayment($data);
                    
                case 'expresso-senegal':
                    return $this->initializeExpressoSenegalPayment($data);
                    
                case 'wave-senegal':
                    return $this->initializeWaveSenegalPayment($data);
                    
                case 'wizall-senegal':
                    return $this->initializeWizallSenegalPayment($data);
                    
                case 'moov-benin':
                    return $this->initializeMoovBeninPayment($data);
                    
                case 'mtn-benin':
                    return $this->initializeMTNBeninPayment($data);
                    
                case 't-money-togo':
                    return $this->initializeTMoneyTogoPayment($data);
                    
                case 'moov-togo':
                    return $this->initializeMoovTogoPayment($data);
                    
                case 'orange-money-mali':
                    return $this->initializeOrangeMoneyMaliPayment($data);
                    
                case 'moov-mali':
                    return $this->initializeMoovMaliPayment($data);
                    
                default:
                    return [
                        'success' => false,
                        'message' => 'Méthode de paiement non supportée: ' . $paymentMethod
                    ];
            }

        } catch (\Exception $e) {
            Log::error('Erreur Paydunya API', [
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
     * Initialiser un paiement Wave CI
     */
    private function initializeWaveCIPayment(array $data): array
    {
        Log::info('PaymentController - Début initializeWaveCIPayment', [
            'data' => $data
        ]);

        $paydunyaService = new PaydunyaOfficialService();
        
        Log::info('PaymentController - PaydunyaService instancié');
        
        // Préparer les données complètes pour Paydunya
        $paydunyaData = [
            'amount' => $data['amount'],
            'productName' => $data['productName'],
            'productDescription' => $data['productDescription'] ?? 'Produit de qualité',
            'unit_price' => $data['unit_price'] ?? $data['amount'],
            'quantity' => $data['quantity'] ?? 1,
            'storeId' => $data['storeId'],
            'productId' => $data['productId'],
            'firstName' => $data['customer']['firstName'],
            'lastName' => $data['customer']['lastName'],
            'email' => $data['customer']['email'],
            'phone' => $data['customer']['phone'],
            'paymentMethod' => 'wave_ci',
            'currency' => $data['currency'],
            'paymentCountry' => $data['paymentCountry'] ?? 'Côte d\'Ivoire',
            'tva_amount' => $data['tva_amount'] ?? null,
            'shipping_amount' => $data['shipping_amount'] ?? null,
            'service_fee' => $data['service_fee'] ?? null,
            'custom_taxes' => $data['custom_taxes'] ?? null,
            'custom_data' => $data['custom_data'] ?? null,
            'context' => $data['context'] ?? null,
            'contest_category' => $data['contest_category'] ?? null,
            'contest_period' => $data['contest_period'] ?? null,
            'winner_number' => $data['winner_number'] ?? null,
            'prize_description' => $data['prize_description'] ?? null,
            'phone_brand' => $data['phone_brand'] ?? null,
            'imei' => $data['imei'] ?? null,
            'phone_model' => $data['phone_model'] ?? null,
            'subscription_type' => $data['subscription_type'] ?? null,
            'duration' => $data['duration'] ?? null,
            'renewal_date' => $data['renewal_date'] ?? null,
            'delivery_address' => $data['delivery_address'] ?? null,
            'delivery_city' => $data['delivery_city'] ?? null,
            'delivery_phone' => $data['delivery_phone'] ?? null,
            'delivery_instructions' => $data['delivery_instructions'] ?? null
        ];
        
        // Effectuer le paiement Wave CI avec création de facture
        $paymentResult = $paydunyaService->payWithWaveCI($paydunyaData);
        
        Log::info('PaymentController - Résultat payWithWaveCI', [
            'result' => $paymentResult
        ]);
        
        if ($paymentResult['success']) {
            return [
                'success' => true,
                'payment_url' => $paymentResult['payment_url'] ?? $paymentResult['url'] ?? null,
                'token' => $paymentResult['token'] ?? null,
                'fees' => $paymentResult['fees'] ?? 100,
                'currency' => $paymentResult['currency'] ?? 'XOF'
            ];
        } else {
            return [
                'success' => false,
                'message' => $paymentResult['message'] ?? 'Erreur lors de l\'initialisation du paiement Wave CI'
            ];
        }
    }

    /**
     * Initialiser un paiement Orange Money CI
     */
    private function initializeOrangeMoneyCIPayment(array $data): array
    {
        $paydunyaService = new PaydunyaOfficialService();
        
        // Préparer les données complètes pour Paydunya
        $paydunyaData = [
            'amount' => $data['amount'],
            'productName' => $data['productName'],
            'productDescription' => $data['productDescription'] ?? 'Produit de qualité',
            'unit_price' => $data['unit_price'] ?? $data['amount'],
            'quantity' => $data['quantity'] ?? 1,
            'storeId' => $data['storeId'],
            'productId' => $data['productId'],
            'firstName' => $data['customer']['firstName'],
            'lastName' => $data['customer']['lastName'],
            'email' => $data['customer']['email'],
            'phone' => $data['customer']['phone'],
            'paymentMethod' => 'orange_money_ci',
            'currency' => $data['currency'],
            'paymentCountry' => $data['paymentCountry'] ?? 'Côte d\'Ivoire',
            'tva_amount' => $data['tva_amount'] ?? null,
            'shipping_amount' => $data['shipping_amount'] ?? null,
            'service_fee' => $data['service_fee'] ?? null,
            'custom_taxes' => $data['custom_taxes'] ?? null,
            'custom_data' => $data['custom_data'] ?? null,
            'context' => $data['context'] ?? null,
            'contest_category' => $data['contest_category'] ?? null,
            'contest_period' => $data['contest_period'] ?? null,
            'winner_number' => $data['winner_number'] ?? null,
            'prize_description' => $data['prize_description'] ?? null,
            'phone_brand' => $data['phone_brand'] ?? null,
            'imei' => $data['imei'] ?? null,
            'phone_model' => $data['phone_model'] ?? null,
            'subscription_type' => $data['subscription_type'] ?? null,
            'duration' => $data['duration'] ?? null,
            'renewal_date' => $data['renewal_date'] ?? null,
            'delivery_address' => $data['delivery_address'] ?? null,
            'delivery_city' => $data['delivery_city'] ?? null,
            'delivery_phone' => $data['delivery_phone'] ?? null,
            'delivery_instructions' => $data['delivery_instructions'] ?? null
        ];
        
        // Effectuer le paiement Orange Money CI avec création de facture
        $paymentResult = $paydunyaService->payWithOrangeMoneyCI($paydunyaData);
        
        if ($paymentResult['success']) {
            return [
                'success' => true,
                'payment_url' => $paymentResult['url'] ?? $paymentResult['payment_url'] ?? null,
                'token' => $paymentResult['token'] ?? null,
                'fees' => $paymentResult['fees'] ?? 100,
                'currency' => $paymentResult['currency'] ?? 'XOF'
            ];
        } else {
            return [
                'success' => false,
                'message' => $paymentResult['message'] ?? 'Erreur lors de l\'initialisation du paiement Orange Money CI'
            ];
        }
    }

    /**
     * Initialiser un paiement MTN CI
     */
    private function initializeMTNCIPayment(array $data): array
    {
        $paydunyaService = new PaydunyaOfficialService();
        
        // Préparer les données complètes pour Paydunya
        $paydunyaData = [
            'amount' => $data['amount'],
            'productName' => $data['productName'],
            'productDescription' => $data['productDescription'] ?? 'Produit de qualité',
            'unit_price' => $data['unit_price'] ?? $data['amount'],
            'quantity' => $data['quantity'] ?? 1,
            'storeId' => $data['storeId'],
            'productId' => $data['productId'],
            'firstName' => $data['customer']['firstName'],
            'lastName' => $data['customer']['lastName'],
            'email' => $data['customer']['email'],
            'phone' => $data['customer']['phone'],
            'paymentMethod' => 'mtn_ci',
            'currency' => $data['currency'],
            'paymentCountry' => $data['paymentCountry'] ?? 'Côte d\'Ivoire',
            'tva_amount' => $data['tva_amount'] ?? null,
            'shipping_amount' => $data['shipping_amount'] ?? null,
            'service_fee' => $data['service_fee'] ?? null,
            'custom_taxes' => $data['custom_taxes'] ?? null,
            'custom_data' => $data['custom_data'] ?? null,
            'context' => $data['context'] ?? null,
            'contest_category' => $data['contest_category'] ?? null,
            'contest_period' => $data['contest_period'] ?? null,
            'winner_number' => $data['winner_number'] ?? null,
            'prize_description' => $data['prize_description'] ?? null,
            'phone_brand' => $data['phone_brand'] ?? null,
            'imei' => $data['imei'] ?? null,
            'phone_model' => $data['phone_model'] ?? null,
            'subscription_type' => $data['subscription_type'] ?? null,
            'duration' => $data['duration'] ?? null,
            'renewal_date' => $data['renewal_date'] ?? null,
            'delivery_address' => $data['delivery_address'] ?? null,
            'delivery_city' => $data['delivery_city'] ?? null,
            'delivery_phone' => $data['delivery_phone'] ?? null,
            'delivery_instructions' => $data['delivery_instructions'] ?? null
        ];
        
        // Effectuer le paiement MTN CI avec création de facture
        $paymentResult = $paydunyaService->payWithMTNCI($paydunyaData);
        
        if ($paymentResult['success']) {
            return [
                'success' => true,
                'payment_url' => $paymentResult['payment_url'] ?? $paymentResult['url'] ?? 'https://paydunya.com/checkout/invoice/' . ($paymentResult['token'] ?? ''),
                'token' => $paymentResult['token'] ?? null,
                'fees' => $paymentResult['fees'] ?? null,
                'currency' => $paymentResult['currency'] ?? null
            ];
        } else {
            return [
                'success' => false,
                'message' => $paymentResult['message'] ?? 'Erreur lors de l\'initialisation du paiement MTN CI'
            ];
        }
    }

    /**
     * Initialiser un paiement Moov CI
     */
    private function initializeMoovCIPayment(array $data): array
    {
        $paydunyaService = new PaydunyaOfficialService();
        
        // Préparer les données complètes pour Paydunya
        $paydunyaData = [
            'amount' => $data['amount'],
            'productName' => $data['productName'],
            'productDescription' => $data['productDescription'] ?? 'Produit de qualité',
            'unit_price' => $data['unit_price'] ?? $data['amount'],
            'quantity' => $data['quantity'] ?? 1,
            'storeId' => $data['storeId'],
            'productId' => $data['productId'],
            'firstName' => $data['customer']['firstName'],
            'lastName' => $data['customer']['lastName'],
            'email' => $data['customer']['email'],
            'phone' => $data['customer']['phone'],
            'paymentMethod' => 'moov_ci',
            'currency' => $data['currency'],
            'paymentCountry' => $data['paymentCountry'] ?? 'Côte d\'Ivoire',
            'tva_amount' => $data['tva_amount'] ?? null,
            'shipping_amount' => $data['shipping_amount'] ?? null,
            'service_fee' => $data['service_fee'] ?? null,
            'custom_taxes' => $data['custom_taxes'] ?? null,
            'custom_data' => $data['custom_data'] ?? null,
            'context' => $data['context'] ?? null,
            'contest_category' => $data['contest_category'] ?? null,
            'contest_period' => $data['contest_period'] ?? null,
            'winner_number' => $data['winner_number'] ?? null,
            'prize_description' => $data['prize_description'] ?? null,
            'phone_brand' => $data['phone_brand'] ?? null,
            'imei' => $data['imei'] ?? null,
            'phone_model' => $data['phone_model'] ?? null,
            'subscription_type' => $data['subscription_type'] ?? null,
            'duration' => $data['duration'] ?? null,
            'renewal_date' => $data['renewal_date'] ?? null,
            'delivery_address' => $data['delivery_address'] ?? null,
            'delivery_city' => $data['delivery_city'] ?? null,
            'delivery_phone' => $data['delivery_phone'] ?? null,
            'delivery_instructions' => $data['delivery_instructions'] ?? null
        ];
        
        // Effectuer le paiement Moov CI avec création de facture
        $paymentResult = $paydunyaService->payWithMoovCI($paydunyaData);
        
        if ($paymentResult['success']) {
            return [
                'success' => true,
                'payment_url' => $paymentResult['payment_url'] ?? $paymentResult['url'] ?? 'https://paydunya.com/checkout/invoice/' . ($paymentResult['token'] ?? ''),
                'token' => $paymentResult['token'] ?? null,
                'fees' => $paymentResult['fees'] ?? null,
                'currency' => $paymentResult['currency'] ?? null
            ];
        } else {
            return [
                'success' => false,
                'message' => $paymentResult['message'] ?? 'Erreur lors de l\'initialisation du paiement Moov CI'
            ];
        }
    }

    /**
     * Initialiser un paiement Orange Money Burkina Faso
     */
    private function initializeOrangeMoneyBurkinaPayment(array $data): array
    {
        $paydunyaService = new PaydunyaOfficialService();
        
        // Préparer les données complètes pour Paydunya
        $paydunyaData = [
            'amount' => $data['amount'],
            'productName' => $data['productName'],
            'productDescription' => $data['productDescription'] ?? 'Produit de qualité',
            'unit_price' => $data['unit_price'] ?? $data['amount'],
            'quantity' => $data['quantity'] ?? 1,
            'storeId' => $data['storeId'],
            'productId' => $data['productId'],
            'firstName' => $data['customer']['firstName'],
            'lastName' => $data['customer']['lastName'],
            'email' => $data['customer']['email'],
            'phone' => $data['customer']['phone'],
            'paymentMethod' => 'orange_money_burkina',
            'currency' => $data['currency'],
            'paymentCountry' => $data['paymentCountry'] ?? 'Burkina Faso',
            'tva_amount' => $data['tva_amount'] ?? null,
            'shipping_amount' => $data['shipping_amount'] ?? null,
            'service_fee' => $data['service_fee'] ?? null,
            'custom_taxes' => $data['custom_taxes'] ?? null,
            'custom_data' => $data['custom_data'] ?? null,
            'context' => $data['context'] ?? null,
            'contest_category' => $data['contest_category'] ?? null,
            'contest_period' => $data['contest_period'] ?? null,
            'winner_number' => $data['winner_number'] ?? null,
            'prize_description' => $data['prize_description'] ?? null,
            'phone_brand' => $data['phone_brand'] ?? null,
            'imei' => $data['imei'] ?? null,
            'phone_model' => $data['phone_model'] ?? null,
            'subscription_type' => $data['subscription_type'] ?? null,
            'duration' => $data['duration'] ?? null,
            'renewal_date' => $data['renewal_date'] ?? null,
            'delivery_address' => $data['delivery_address'] ?? null,
            'delivery_city' => $data['delivery_city'] ?? null,
            'delivery_phone' => $data['delivery_phone'] ?? null,
            'delivery_instructions' => $data['delivery_instructions'] ?? null
        ];
        
        // Effectuer le paiement Orange Money Burkina avec création de facture
        $paymentResult = $paydunyaService->payWithOrangeMoneyBurkina($paydunyaData);
        
        if ($paymentResult['success']) {
            return [
                'success' => true,
                'payment_url' => $paymentResult['payment_url'] ?? $paymentResult['url'] ?? null,
                'token' => $paymentResult['token'] ?? null,
                'fees' => $paymentResult['fees'] ?? null,
                'currency' => $paymentResult['currency'] ?? null
            ];
        } else {
            return [
                'success' => false,
                'message' => $paymentResult['message'] ?? 'Erreur lors de l\'initialisation du paiement Orange Money Burkina'
            ];
        }
    }

    /**
     * Initialiser un paiement Orange Money Sénégal
     */
    private function initializeOrangeMoneySenegalPayment(array $data): array
    {
        $paydunyaService = new PaydunyaOfficialService();
        
        // Préparer les données complètes pour Paydunya
        $paydunyaData = [
            'amount' => $data['amount'],
            'productName' => $data['productName'],
            'productDescription' => $data['productDescription'] ?? 'Produit de qualité',
            'unit_price' => $data['unit_price'] ?? $data['amount'],
            'quantity' => $data['quantity'] ?? 1,
            'storeId' => $data['storeId'],
            'productId' => $data['productId'],
            'firstName' => $data['customer']['firstName'],
            'lastName' => $data['customer']['lastName'],
            'email' => $data['customer']['email'],
            'phone' => $data['customer']['phone'],
            'paymentMethod' => 'orange_money_senegal',
            'currency' => $data['currency'],
            'paymentCountry' => $data['paymentCountry'] ?? 'Sénégal',
            'tva_amount' => $data['tva_amount'] ?? null,
            'shipping_amount' => $data['shipping_amount'] ?? null,
            'service_fee' => $data['service_fee'] ?? null,
            'custom_taxes' => $data['custom_taxes'] ?? null,
            'custom_data' => $data['custom_data'] ?? null,
            'context' => $data['context'] ?? null,
            'contest_category' => $data['contest_category'] ?? null,
            'contest_period' => $data['contest_period'] ?? null,
            'winner_number' => $data['winner_number'] ?? null,
            'prize_description' => $data['prize_description'] ?? null,
            'phone_brand' => $data['phone_brand'] ?? null,
            'imei' => $data['imei'] ?? null,
            'phone_model' => $data['phone_model'] ?? null,
            'subscription_type' => $data['subscription_type'] ?? null,
            'duration' => $data['duration'] ?? null,
            'renewal_date' => $data['renewal_date'] ?? null,
            'delivery_address' => $data['delivery_address'] ?? null,
            'delivery_city' => $data['delivery_city'] ?? null,
            'delivery_phone' => $data['delivery_phone'] ?? null,
            'delivery_instructions' => $data['delivery_instructions'] ?? null
        ];
        
        // Effectuer le paiement Orange Money Sénégal avec création de facture
        $paymentResult = $paydunyaService->payWithOrangeMoneySenegal($paydunyaData);
        
        if ($paymentResult['success']) {
            return [
                'success' => true,
                'payment_url' => $paymentResult['payment_url'] ?? $paymentResult['url'] ?? null,
                'token' => $paymentResult['token'] ?? null,
                'fees' => $paymentResult['fees'] ?? null,
                'currency' => $paymentResult['currency'] ?? null
            ];
        } else {
            return [
                'success' => false,
                'message' => $paymentResult['message'] ?? 'Erreur lors de l\'initialisation du paiement Orange Money Sénégal'
            ];
        }
    }

    /**
     * Initialiser un paiement Free Money Sénégal
     */
    private function initializeFreeMoneySenegalPayment(array $data): array
    {
        $paydunyaService = new PaydunyaOfficialService();
        
        // Préparer les données complètes pour Paydunya
        $paydunyaData = [
            'amount' => $data['amount'],
            'productName' => $data['productName'],
            'productDescription' => $data['productDescription'] ?? 'Produit de qualité',
            'unit_price' => $data['unit_price'] ?? $data['amount'],
            'quantity' => $data['quantity'] ?? 1,
            'storeId' => $data['storeId'],
            'productId' => $data['productId'],
            'firstName' => $data['customer']['firstName'],
            'lastName' => $data['customer']['lastName'],
            'email' => $data['customer']['email'],
            'phone' => $data['customer']['phone'],
            'paymentMethod' => 'free_money_senegal',
            'currency' => $data['currency'],
            'paymentCountry' => $data['paymentCountry'] ?? 'Sénégal',
            'tva_amount' => $data['tva_amount'] ?? null,
            'shipping_amount' => $data['shipping_amount'] ?? null,
            'service_fee' => $data['service_fee'] ?? null,
            'custom_taxes' => $data['custom_taxes'] ?? null,
            'custom_data' => $data['custom_data'] ?? null,
            'context' => $data['context'] ?? null,
            'contest_category' => $data['contest_category'] ?? null,
            'contest_period' => $data['contest_period'] ?? null,
            'winner_number' => $data['winner_number'] ?? null,
            'prize_description' => $data['prize_description'] ?? null,
            'phone_brand' => $data['phone_brand'] ?? null,
            'imei' => $data['imei'] ?? null,
            'phone_model' => $data['phone_model'] ?? null,
            'subscription_type' => $data['subscription_type'] ?? null,
            'duration' => $data['duration'] ?? null,
            'renewal_date' => $data['renewal_date'] ?? null,
            'delivery_address' => $data['delivery_address'] ?? null,
            'delivery_city' => $data['delivery_city'] ?? null,
            'delivery_phone' => $data['delivery_phone'] ?? null,
            'delivery_instructions' => $data['delivery_instructions'] ?? null
        ];
        
        // Effectuer le paiement Free Money Sénégal avec création de facture
        $paymentResult = $paydunyaService->payWithFreeMoneySenegal($paydunyaData);
        
        if ($paymentResult['success']) {
            return [
                'success' => true,
                'payment_url' => $paymentResult['payment_url'] ?? $paymentResult['url'] ?? null,
                'token' => $paymentResult['token'] ?? null,
                'fees' => $paymentResult['fees'] ?? null,
                'currency' => $paymentResult['currency'] ?? null
            ];
        } else {
            return [
                'success' => false,
                'message' => $paymentResult['message'] ?? 'Erreur lors de l\'initialisation du paiement Free Money Sénégal'
            ];
        }
    }

    /**
     * Initialiser un paiement Expresso Sénégal
     */
    private function initializeExpressoSenegalPayment(array $data): array
    {
        $paydunyaService = new PaydunyaOfficialService();
        
        // Préparer les données complètes pour Paydunya
        $paydunyaData = [
            'amount' => $data['amount'],
            'productName' => $data['productName'],
            'productDescription' => $data['productDescription'] ?? 'Produit de qualité',
            'unit_price' => $data['unit_price'] ?? $data['amount'],
            'quantity' => $data['quantity'] ?? 1,
            'storeId' => $data['storeId'],
            'productId' => $data['productId'],
            'firstName' => $data['customer']['firstName'],
            'lastName' => $data['customer']['lastName'],
            'email' => $data['customer']['email'],
            'phone' => $data['customer']['phone'],
            'paymentMethod' => 'expresso_senegal',
            'currency' => $data['currency'],
            'paymentCountry' => $data['paymentCountry'] ?? 'Sénégal',
            'tva_amount' => $data['tva_amount'] ?? null,
            'shipping_amount' => $data['shipping_amount'] ?? null,
            'service_fee' => $data['service_fee'] ?? null,
            'custom_taxes' => $data['custom_taxes'] ?? null,
            'custom_data' => $data['custom_data'] ?? null,
            'context' => $data['context'] ?? null,
            'contest_category' => $data['contest_category'] ?? null,
            'contest_period' => $data['contest_period'] ?? null,
            'winner_number' => $data['winner_number'] ?? null,
            'prize_description' => $data['prize_description'] ?? null,
            'phone_brand' => $data['phone_brand'] ?? null,
            'imei' => $data['imei'] ?? null,
            'phone_model' => $data['phone_model'] ?? null,
            'subscription_type' => $data['subscription_type'] ?? null,
            'duration' => $data['duration'] ?? null,
            'renewal_date' => $data['renewal_date'] ?? null,
            'delivery_address' => $data['delivery_address'] ?? null,
            'delivery_city' => $data['delivery_city'] ?? null,
            'delivery_phone' => $data['delivery_phone'] ?? null,
            'delivery_instructions' => $data['delivery_instructions'] ?? null
        ];
        
        // Effectuer le paiement Expresso Sénégal avec création de facture
        $paymentResult = $paydunyaService->payWithExpressoSenegal($paydunyaData);
        
        if ($paymentResult['success']) {
            return [
                'success' => true,
                'payment_url' => $paymentResult['payment_url'] ?? $paymentResult['url'] ?? null,
                'token' => $paymentResult['token'] ?? null,
                'fees' => $paymentResult['fees'] ?? null,
                'currency' => $paymentResult['currency'] ?? null
            ];
        } else {
            return [
                'success' => false,
                'message' => $paymentResult['message'] ?? 'Erreur lors de l\'initialisation du paiement Expresso Sénégal'
            ];
        }
    }

    /**
     * Initialiser un paiement Wave Sénégal
     */
    private function initializeWaveSenegalPayment(array $data): array
    {
        $paydunyaService = new PaydunyaOfficialService();
        
        // Préparer les données complètes pour Paydunya
        $paydunyaData = [
            'amount' => $data['amount'],
            'productName' => $data['productName'],
            'productDescription' => $data['productDescription'] ?? 'Produit de qualité',
            'unit_price' => $data['unit_price'] ?? $data['amount'],
            'quantity' => $data['quantity'] ?? 1,
            'storeId' => $data['storeId'],
            'productId' => $data['productId'],
            'firstName' => $data['customer']['firstName'],
            'lastName' => $data['customer']['lastName'],
            'email' => $data['customer']['email'],
            'phone' => $data['customer']['phone'],
            'paymentMethod' => 'wave_senegal',
            'currency' => $data['currency'],
            'paymentCountry' => $data['paymentCountry'] ?? 'Sénégal',
            'tva_amount' => $data['tva_amount'] ?? null,
            'shipping_amount' => $data['shipping_amount'] ?? null,
            'service_fee' => $data['service_fee'] ?? null,
            'custom_taxes' => $data['custom_taxes'] ?? null,
            'custom_data' => $data['custom_data'] ?? null,
            'context' => $data['context'] ?? null,
            'contest_category' => $data['contest_category'] ?? null,
            'contest_period' => $data['contest_period'] ?? null,
            'winner_number' => $data['winner_number'] ?? null,
            'prize_description' => $data['prize_description'] ?? null,
            'phone_brand' => $data['phone_brand'] ?? null,
            'imei' => $data['imei'] ?? null,
            'phone_model' => $data['phone_model'] ?? null,
            'subscription_type' => $data['subscription_type'] ?? null,
            'duration' => $data['duration'] ?? null,
            'renewal_date' => $data['renewal_date'] ?? null,
            'delivery_address' => $data['delivery_address'] ?? null,
            'delivery_city' => $data['delivery_city'] ?? null,
            'delivery_phone' => $data['delivery_phone'] ?? null,
            'delivery_instructions' => $data['delivery_instructions'] ?? null
        ];
        
        // Effectuer le paiement Wave Sénégal avec création de facture
        $paymentResult = $paydunyaService->payWithWaveSenegal($paydunyaData);
        
        if ($paymentResult['success']) {
            return [
                'success' => true,
                'payment_url' => $paymentResult['payment_url'] ?? $paymentResult['url'] ?? null,
                'token' => $paymentResult['token'] ?? null,
                'fees' => $paymentResult['fees'] ?? null,
                'currency' => $paymentResult['currency'] ?? null
            ];
        } else {
            return [
                'success' => false,
                'message' => $paymentResult['message'] ?? 'Erreur lors de l\'initialisation du paiement Wave Sénégal'
            ];
        }
    }

    /**
     * Initialiser un paiement Wizall Sénégal
     */
    private function initializeWizallSenegalPayment(array $data): array
    {
        $paydunyaService = new PaydunyaOfficialService();
        
        // Préparer les données complètes pour Paydunya
        $paydunyaData = [
            'amount' => $data['amount'],
            'productName' => $data['productName'],
            'productDescription' => $data['productDescription'] ?? 'Produit de qualité',
            'unit_price' => $data['unit_price'] ?? $data['amount'],
            'quantity' => $data['quantity'] ?? 1,
            'storeId' => $data['storeId'],
            'productId' => $data['productId'],
            'firstName' => $data['customer']['firstName'],
            'lastName' => $data['customer']['lastName'],
            'email' => $data['customer']['email'],
            'phone' => $data['customer']['phone'],
            'paymentMethod' => 'wizall_senegal',
            'currency' => $data['currency'],
            'paymentCountry' => $data['paymentCountry'] ?? 'Sénégal',
            'tva_amount' => $data['tva_amount'] ?? null,
            'shipping_amount' => $data['shipping_amount'] ?? null,
            'service_fee' => $data['service_fee'] ?? null,
            'custom_taxes' => $data['custom_taxes'] ?? null,
            'custom_data' => $data['custom_data'] ?? null,
            'context' => $data['context'] ?? null,
            'contest_category' => $data['contest_category'] ?? null,
            'contest_period' => $data['contest_period'] ?? null,
            'winner_number' => $data['winner_number'] ?? null,
            'prize_description' => $data['prize_description'] ?? null,
            'phone_brand' => $data['phone_brand'] ?? null,
            'imei' => $data['imei'] ?? null,
            'phone_model' => $data['phone_model'] ?? null,
            'subscription_type' => $data['subscription_type'] ?? null,
            'duration' => $data['duration'] ?? null,
            'renewal_date' => $data['renewal_date'] ?? null,
            'delivery_address' => $data['delivery_address'] ?? null,
            'delivery_city' => $data['delivery_city'] ?? null,
            'delivery_phone' => $data['delivery_phone'] ?? null,
            'delivery_instructions' => $data['delivery_instructions'] ?? null
        ];
        
        // Effectuer le paiement Wizall Sénégal avec création de facture
        $paymentResult = $paydunyaService->payWithWizallSenegal($paydunyaData);
        
        if ($paymentResult['success']) {
            return [
                'success' => true,
                'payment_url' => $paymentResult['payment_url'] ?? $paymentResult['url'] ?? null,
                'token' => $paymentResult['token'] ?? null,
                'fees' => $paymentResult['fees'] ?? null,
                'currency' => $paymentResult['currency'] ?? null
            ];
        } else {
            return [
                'success' => false,
                'message' => $paymentResult['message'] ?? 'Erreur lors de l\'initialisation du paiement Wizall Sénégal'
            ];
        }
    }

    /**
     * Initialiser un paiement Moov Bénin
     */
    private function initializeMoovBeninPayment(array $data): array
    {
        $paydunyaService = new PaydunyaOfficialService();
        
        // Préparer les données complètes pour Paydunya
        $paydunyaData = [
            'amount' => $data['amount'],
            'productName' => $data['productName'],
            'productDescription' => $data['productDescription'] ?? 'Produit de qualité',
            'unit_price' => $data['unit_price'] ?? $data['amount'],
            'quantity' => $data['quantity'] ?? 1,
            'storeId' => $data['storeId'],
            'productId' => $data['productId'],
            'firstName' => $data['customer']['firstName'],
            'lastName' => $data['customer']['lastName'],
            'email' => $data['customer']['email'],
            'phone' => $data['customer']['phone'],
            'paymentMethod' => 'moov_benin',
            'currency' => $data['currency'],
            'paymentCountry' => $data['paymentCountry'] ?? 'Bénin',
            'tva_amount' => $data['tva_amount'] ?? null,
            'shipping_amount' => $data['shipping_amount'] ?? null,
            'service_fee' => $data['service_fee'] ?? null,
            'custom_taxes' => $data['custom_taxes'] ?? null,
            'custom_data' => $data['custom_data'] ?? null,
            'context' => $data['context'] ?? null,
            'contest_category' => $data['contest_category'] ?? null,
            'contest_period' => $data['contest_period'] ?? null,
            'winner_number' => $data['winner_number'] ?? null,
            'prize_description' => $data['prize_description'] ?? null,
            'phone_brand' => $data['phone_brand'] ?? null,
            'imei' => $data['imei'] ?? null,
            'phone_model' => $data['phone_model'] ?? null,
            'subscription_type' => $data['subscription_type'] ?? null,
            'duration' => $data['duration'] ?? null,
            'renewal_date' => $data['renewal_date'] ?? null,
            'delivery_address' => $data['delivery_address'] ?? null,
            'delivery_city' => $data['delivery_city'] ?? null,
            'delivery_phone' => $data['delivery_phone'] ?? null,
            'delivery_instructions' => $data['delivery_instructions'] ?? null
        ];
        
        // Effectuer le paiement Moov Bénin avec création de facture
        $paymentResult = $paydunyaService->payWithMoovBenin($paydunyaData);
        
        if ($paymentResult['success']) {
            return [
                'success' => true,
                'payment_url' => $paymentResult['payment_url'] ?? $paymentResult['url'] ?? null,
                'token' => $paymentResult['token'] ?? null,
                'fees' => $paymentResult['fees'] ?? null,
                'currency' => $paymentResult['currency'] ?? null
            ];
        } else {
            return [
                'success' => false,
                'message' => $paymentResult['message'] ?? 'Erreur lors de l\'initialisation du paiement Moov Bénin'
            ];
        }
    }

    /**
     * Initialiser un paiement MTN Bénin
     */
    private function initializeMTNBeninPayment(array $data): array
    {
        $paydunyaService = new PaydunyaOfficialService();
        
        // Préparer les données complètes pour Paydunya
        $paydunyaData = [
            'amount' => $data['amount'],
            'productName' => $data['productName'],
            'productDescription' => $data['productDescription'] ?? 'Produit de qualité',
            'unit_price' => $data['unit_price'] ?? $data['amount'],
            'quantity' => $data['quantity'] ?? 1,
            'storeId' => $data['storeId'],
            'productId' => $data['productId'],
            'firstName' => $data['customer']['firstName'],
            'lastName' => $data['customer']['lastName'],
            'email' => $data['customer']['email'],
            'phone' => $data['customer']['phone'],
            'paymentMethod' => 'mtn_benin',
            'currency' => $data['currency'],
            'paymentCountry' => $data['paymentCountry'] ?? 'Bénin',
            'tva_amount' => $data['tva_amount'] ?? null,
            'shipping_amount' => $data['shipping_amount'] ?? null,
            'service_fee' => $data['service_fee'] ?? null,
            'custom_taxes' => $data['custom_taxes'] ?? null,
            'custom_data' => $data['custom_data'] ?? null,
            'context' => $data['context'] ?? null,
            'contest_category' => $data['contest_category'] ?? null,
            'contest_period' => $data['contest_period'] ?? null,
            'winner_number' => $data['winner_number'] ?? null,
            'prize_description' => $data['prize_description'] ?? null,
            'phone_brand' => $data['phone_brand'] ?? null,
            'imei' => $data['imei'] ?? null,
            'phone_model' => $data['phone_model'] ?? null,
            'subscription_type' => $data['subscription_type'] ?? null,
            'duration' => $data['duration'] ?? null,
            'renewal_date' => $data['renewal_date'] ?? null,
            'delivery_address' => $data['delivery_address'] ?? null,
            'delivery_city' => $data['delivery_city'] ?? null,
            'delivery_phone' => $data['delivery_phone'] ?? null,
            'delivery_instructions' => $data['delivery_instructions'] ?? null
        ];
        
        // Effectuer le paiement MTN Bénin avec création de facture
        $paymentResult = $paydunyaService->payWithMTNBenin($paydunyaData);
        
        if ($paymentResult['success']) {
            return [
                'success' => true,
                'payment_url' => $paymentResult['payment_url'] ?? $paymentResult['url'] ?? null,
                'token' => $paymentResult['token'] ?? null,
                'fees' => $paymentResult['fees'] ?? null,
                'currency' => $paymentResult['currency'] ?? null
            ];
        } else {
            return [
                'success' => false,
                'message' => $paymentResult['message'] ?? 'Erreur lors de l\'initialisation du paiement MTN Bénin'
            ];
        }
    }

    /**
     * Initialiser un paiement T-Money Togo
     */
    private function initializeTMoneyTogoPayment(array $data): array
    {
        $paydunyaService = new PaydunyaOfficialService();
        
        // Préparer les données complètes pour Paydunya
        $paydunyaData = [
            'amount' => $data['amount'],
            'productName' => $data['productName'],
            'productDescription' => $data['productDescription'] ?? 'Produit de qualité',
            'unit_price' => $data['unit_price'] ?? $data['amount'],
            'quantity' => $data['quantity'] ?? 1,
            'storeId' => $data['storeId'],
            'productId' => $data['productId'],
            'firstName' => $data['customer']['firstName'],
            'lastName' => $data['customer']['lastName'],
            'email' => $data['customer']['email'],
            'phone' => $data['customer']['phone'],
            'paymentMethod' => 't_money_togo',
            'currency' => $data['currency'],
            'paymentCountry' => $data['paymentCountry'] ?? 'Togo',
            'tva_amount' => $data['tva_amount'] ?? null,
            'shipping_amount' => $data['shipping_amount'] ?? null,
            'service_fee' => $data['service_fee'] ?? null,
            'custom_taxes' => $data['custom_taxes'] ?? null,
            'custom_data' => $data['custom_data'] ?? null,
            'context' => $data['context'] ?? null,
            'contest_category' => $data['contest_category'] ?? null,
            'contest_period' => $data['contest_period'] ?? null,
            'winner_number' => $data['winner_number'] ?? null,
            'prize_description' => $data['prize_description'] ?? null,
            'phone_brand' => $data['phone_brand'] ?? null,
            'imei' => $data['imei'] ?? null,
            'phone_model' => $data['phone_model'] ?? null,
            'subscription_type' => $data['subscription_type'] ?? null,
            'duration' => $data['duration'] ?? null,
            'renewal_date' => $data['renewal_date'] ?? null,
            'delivery_address' => $data['delivery_address'] ?? null,
            'delivery_city' => $data['delivery_city'] ?? null,
            'delivery_phone' => $data['delivery_phone'] ?? null,
            'delivery_instructions' => $data['delivery_instructions'] ?? null
        ];
        
        // Effectuer le paiement T-Money Togo avec création de facture
        $paymentResult = $paydunyaService->payWithTMoneyTogo($paydunyaData);
        
        if ($paymentResult['success']) {
            return [
                'success' => true,
                'payment_url' => $paymentResult['payment_url'] ?? $paymentResult['url'] ?? null,
                'token' => $paymentResult['token'] ?? null,
                'fees' => $paymentResult['fees'] ?? null,
                'currency' => $paymentResult['currency'] ?? null
            ];
        } else {
            return [
                'success' => false,
                'message' => $paymentResult['message'] ?? 'Erreur lors de l\'initialisation du paiement T-Money Togo'
            ];
        }
    }

    /**
     * Initialiser un paiement Moov Togo
     */
    private function initializeMoovTogoPayment(array $data): array
    {
        $paydunyaService = new PaydunyaOfficialService();
        
        // Préparer les données complètes pour Paydunya
        $paydunyaData = [
            'amount' => $data['amount'],
            'productName' => $data['productName'],
            'productDescription' => $data['productDescription'] ?? 'Produit de qualité',
            'unit_price' => $data['unit_price'] ?? $data['amount'],
            'quantity' => $data['quantity'] ?? 1,
            'storeId' => $data['storeId'],
            'productId' => $data['productId'],
            'firstName' => $data['customer']['firstName'],
            'lastName' => $data['customer']['lastName'],
            'email' => $data['customer']['email'],
            'phone' => $data['customer']['phone'],
            'paymentMethod' => 'moov_togo',
            'currency' => $data['currency'],
            'paymentCountry' => $data['paymentCountry'] ?? 'Togo',
            'tva_amount' => $data['tva_amount'] ?? null,
            'shipping_amount' => $data['shipping_amount'] ?? null,
            'service_fee' => $data['service_fee'] ?? null,
            'custom_taxes' => $data['custom_taxes'] ?? null,
            'custom_data' => $data['custom_data'] ?? null,
            'context' => $data['context'] ?? null,
            'contest_category' => $data['contest_category'] ?? null,
            'contest_period' => $data['contest_period'] ?? null,
            'winner_number' => $data['winner_number'] ?? null,
            'prize_description' => $data['prize_description'] ?? null,
            'phone_brand' => $data['phone_brand'] ?? null,
            'imei' => $data['imei'] ?? null,
            'phone_model' => $data['phone_model'] ?? null,
            'subscription_type' => $data['subscription_type'] ?? null,
            'duration' => $data['duration'] ?? null,
            'renewal_date' => $data['renewal_date'] ?? null,
            'delivery_address' => $data['delivery_address'] ?? null,
            'delivery_city' => $data['delivery_city'] ?? null,
            'delivery_phone' => $data['delivery_phone'] ?? null,
            'delivery_instructions' => $data['delivery_instructions'] ?? null
        ];
        
        // Effectuer le paiement Moov Togo avec création de facture
        $paymentResult = $paydunyaService->payWithMoovTogo($paydunyaData);
        
        if ($paymentResult['success']) {
            return [
                'success' => true,
                'payment_url' => $paymentResult['payment_url'] ?? $paymentResult['url'] ?? null,
                'token' => $paymentResult['token'] ?? null,
                'fees' => $paymentResult['fees'] ?? null,
                'currency' => $paymentResult['currency'] ?? null
            ];
        } else {
            return [
                'success' => false,
                'message' => $paymentResult['message'] ?? 'Erreur lors de l\'initialisation du paiement Moov Togo'
            ];
        }
    }

    /**
     * Initialiser un paiement Orange Money Mali
     */
    private function initializeOrangeMoneyMaliPayment(array $data): array
    {
        $paydunyaService = new PaydunyaOfficialService();
        
        // Préparer les données complètes pour Paydunya
        $paydunyaData = [
            'amount' => $data['amount'],
            'productName' => $data['productName'],
            'productDescription' => $data['productDescription'] ?? 'Produit de qualité',
            'unit_price' => $data['unit_price'] ?? $data['amount'],
            'quantity' => $data['quantity'] ?? 1,
            'storeId' => $data['storeId'],
            'productId' => $data['productId'],
            'firstName' => $data['customer']['firstName'],
            'lastName' => $data['customer']['lastName'],
            'email' => $data['customer']['email'],
            'phone' => $data['customer']['phone'],
            'paymentMethod' => 'orange_money_mali',
            'currency' => $data['currency'],
            'paymentCountry' => $data['paymentCountry'] ?? 'Mali',
            'tva_amount' => $data['tva_amount'] ?? null,
            'shipping_amount' => $data['shipping_amount'] ?? null,
            'service_fee' => $data['service_fee'] ?? null,
            'custom_taxes' => $data['custom_taxes'] ?? null,
            'custom_data' => $data['custom_data'] ?? null,
            'context' => $data['context'] ?? null,
            'contest_category' => $data['contest_category'] ?? null,
            'contest_period' => $data['contest_period'] ?? null,
            'winner_number' => $data['winner_number'] ?? null,
            'prize_description' => $data['prize_description'] ?? null,
            'phone_brand' => $data['phone_brand'] ?? null,
            'imei' => $data['imei'] ?? null,
            'phone_model' => $data['phone_model'] ?? null,
            'subscription_type' => $data['subscription_type'] ?? null,
            'duration' => $data['duration'] ?? null,
            'renewal_date' => $data['renewal_date'] ?? null,
            'delivery_address' => $data['delivery_address'] ?? null,
            'delivery_city' => $data['delivery_city'] ?? null,
            'delivery_phone' => $data['delivery_phone'] ?? null,
            'delivery_instructions' => $data['delivery_instructions'] ?? null
        ];
        
        // Effectuer le paiement Orange Money Mali avec création de facture
        $paymentResult = $paydunyaService->payWithOrangeMoneyMali($paydunyaData);
        
        if ($paymentResult['success']) {
            return [
                'success' => true,
                'payment_url' => $paymentResult['payment_url'] ?? $paymentResult['url'] ?? null,
                'token' => $paymentResult['token'] ?? null,
                'fees' => $paymentResult['fees'] ?? null,
                'currency' => $paymentResult['currency'] ?? null
            ];
        } else {
            return [
                'success' => false,
                'message' => $paymentResult['message'] ?? 'Erreur lors de l\'initialisation du paiement Orange Money Mali'
            ];
        }
    }

    /**
     * Initialiser un paiement Moov Mali
     */
    private function initializeMoovMaliPayment(array $data): array
    {
        $paydunyaService = new PaydunyaOfficialService();
        
        // Préparer les données complètes pour Paydunya
        $paydunyaData = [
            'amount' => $data['amount'],
            'productName' => $data['productName'],
            'productDescription' => $data['productDescription'] ?? 'Produit de qualité',
            'unit_price' => $data['unit_price'] ?? $data['amount'],
            'quantity' => $data['quantity'] ?? 1,
            'storeId' => $data['storeId'],
            'productId' => $data['productId'],
            'firstName' => $data['customer']['firstName'],
            'lastName' => $data['customer']['lastName'],
            'email' => $data['customer']['email'],
            'phone' => $data['customer']['phone'],
            'paymentMethod' => 'moov_ml',
            'currency' => $data['currency'],
            'paymentCountry' => $data['paymentCountry'] ?? 'Mali',
            'tva_amount' => $data['tva_amount'] ?? null,
            'shipping_amount' => $data['shipping_amount'] ?? null,
            'service_fee' => $data['service_fee'] ?? null,
            'custom_taxes' => $data['custom_taxes'] ?? null,
            'custom_data' => $data['custom_data'] ?? null,
            'context' => $data['context'] ?? null,
            'contest_category' => $data['contest_category'] ?? null,
            'contest_period' => $data['contest_period'] ?? null,
            'winner_number' => $data['winner_number'] ?? null,
            'prize_description' => $data['prize_description'] ?? null,
            'phone_brand' => $data['phone_brand'] ?? null,
            'imei' => $data['imei'] ?? null,
            'phone_model' => $data['phone_model'] ?? null,
            'subscription_type' => $data['subscription_type'] ?? null,
            'duration' => $data['duration'] ?? null,
            'renewal_date' => $data['renewal_date'] ?? null,
            'delivery_address' => $data['delivery_address'] ?? null,
            'delivery_city' => $data['delivery_city'] ?? null,
            'delivery_phone' => $data['delivery_phone'] ?? null,
            'delivery_instructions' => $data['delivery_instructions'] ?? null
        ];
        
        // Effectuer le paiement Moov Mali avec création de facture
        $paymentResult = $paydunyaService->payWithMoovMali($paydunyaData);
        
        if ($paymentResult['success']) {
            return [
                'success' => true,
                'payment_url' => $paymentResult['payment_url'] ?? $paymentResult['url'] ?? null,
                'token' => $paymentResult['token'] ?? null,
                'fees' => $paymentResult['fees'] ?? null,
                'currency' => $paymentResult['currency'] ?? null
            ];
        } else {
            return [
                'success' => false,
                'message' => $paymentResult['message'] ?? 'Erreur lors de l\'initialisation du paiement Moov Mali'
            ];
        }
    }

    /**
     * Gérer le paiement SOFTPAY Wave Sénégal
     */
    public function handleWaveSenegalPayment(Request $request): JsonResponse
    {
        Log::info('PaymentController - handleWaveSenegalPayment appelé', [
            'request_data' => $request->all()
        ]);

        $validatedData = $request->validate([
            'phone_number' => 'required|string|min:8',
            'payment_token' => 'required|string',
            'customer_name' => 'required|string',
            'customer_email' => 'required|email',
        ]);

        // Format exact selon la documentation Paydunya Wave Sénégal
        $payload = [
            "wave_senegal_fullName" => $validatedData['customer_name'],
            "wave_senegal_email" => $validatedData['customer_email'],
            "wave_senegal_phone" => $validatedData['phone_number'],
            "wave_senegal_payment_token" => $validatedData['payment_token']
        ];

        try {
            Log::info('PaymentController - Tentative d\'appel Paydunya SOFTPAY Wave Sénégal', [
                'endpoint' => 'https://app.paydunya.com/api/v1/softpay/wave-senegal',
                'payload' => $payload,
                'headers' => [
                    'PAYDUNYA-MASTER-KEY' => substr(config('paydunya.master_key'), 0, 10) . '...',
                    'PAYDUNYA-PRIVATE-KEY' => substr(config('paydunya.private_key'), 0, 10) . '...',
                    'PAYDUNYA-TOKEN' => substr(config('paydunya.token'), 0, 10) . '...'
                ]
            ]);

            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'PAYDUNYA-MASTER-KEY' => config('paydunya.master_key'),
                'PAYDUNYA-PRIVATE-KEY' => config('paydunya.private_key'),
                'PAYDUNYA-TOKEN' => config('paydunya.token'),
            ])->post('https://app.paydunya.com/api/v1/softpay/wave-senegal', $payload);

            Log::info('PaymentController - Réponse Paydunya Wave Sénégal reçue', [
                'status' => $response->status(),
                'body' => $response->body()
            ]);

            $paydunyaResponse = $response->json();

            // Wave Sénégal retourne une URL de redirection
            if ($response->successful() && isset($paydunyaResponse['url'])) {
                return response()->json([
                    'success' => true,
                    'redirect_url' => $paydunyaResponse['url'],
                    'message' => $paydunyaResponse['message'] ?? 'Redirection vers Wave Sénégal...',
                    'fees' => $paydunyaResponse['fees'] ?? null,
                    'currency' => $paydunyaResponse['currency'] ?? null
                ]);
            }

            // En cas d'échec
            return response()->json([
                'success' => false,
                'message' => $paydunyaResponse['message'] ?? 'Une erreur est survenue lors de l\'initiation du paiement Wave Sénégal.',
                'paydunya_response' => $paydunyaResponse
            ]);

        } catch (\Exception $e) {
            Log::error('Paydunya Wave Sénégal SOFTPAY Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur de communication avec le service de paiement Wave Sénégal.'
            ], 500);
        }
    }

    /**
     * Gérer le paiement SOFTPAY Wizall Sénégal (Étape 1: Initiation)
     */
    public function handleWizallSenegalPayment(Request $request): JsonResponse
    {
        Log::info('PaymentController - handleWizallSenegalPayment appelé', [
            'request_data' => $request->all()
        ]);

        $validatedData = $request->validate([
            'phone_number' => 'required|string|min:8',
            'payment_token' => 'required|string',
            'customer_name' => 'required|string',
            'customer_email' => 'required|email',
        ]);

        // Format exact selon la documentation Paydunya Wizall Sénégal
        $payload = [
            "customer_name" => $validatedData['customer_name'],
            "customer_email" => $validatedData['customer_email'],
            "phone_number" => $validatedData['phone_number'],
            "invoice_token" => $validatedData['payment_token']
        ];

        try {
            Log::info('PaymentController - Tentative d\'appel Paydunya SOFTPAY Wizall Sénégal', [
                'endpoint' => 'https://app.paydunya.com/api/v1/softpay/wizall-money-senegal',
                'payload' => $payload,
                'headers' => [
                    'PAYDUNYA-MASTER-KEY' => substr(config('paydunya.master_key'), 0, 10) . '...',
                    'PAYDUNYA-PRIVATE-KEY' => substr(config('paydunya.private_key'), 0, 10) . '...',
                    'PAYDUNYA-TOKEN' => substr(config('paydunya.token'), 0, 10) . '...'
                ]
            ]);

            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'PAYDUNYA-MASTER-KEY' => config('paydunya.master_key'),
                'PAYDUNYA-PRIVATE-KEY' => config('paydunya.private_key'),
                'PAYDUNYA-TOKEN' => config('paydunya.token'),
            ])->post('https://app.paydunya.com/api/v1/softpay/wizall-money-senegal', $payload);

            Log::info('PaymentController - Réponse Paydunya Wizall Sénégal reçue', [
                'status' => $response->status(),
                'body' => $response->body()
            ]);

            $paydunyaResponse = $response->json();

            // Wizall Sénégal retourne une transaction ID pour confirmation
            if ($response->successful() && isset($paydunyaResponse['success']) && $paydunyaResponse['success'] === true) {
                return response()->json([
                    'success' => true,
                    'message' => $paydunyaResponse['message'] ?? 'Requête de paiement Wizall effectuée!',
                    'transaction_id' => $paydunyaResponse['data']['TransactionID'] ?? null,
                    'operation' => $paydunyaResponse['data']['Operation'] ?? null,
                    'details' => $paydunyaResponse['data']['details'] ?? null,
                    'fees' => $paydunyaResponse['fees'] ?? null,
                    'currency' => $paydunyaResponse['currency'] ?? null
                ]);
            }

            // En cas d'échec
            return response()->json([
                'success' => false,
                'message' => $paydunyaResponse['message'] ?? 'Une erreur est survenue lors de l\'initiation du paiement Wizall Sénégal.',
                'paydunya_response' => $paydunyaResponse
            ]);

        } catch (\Exception $e) {
            Log::error('Paydunya Wizall Sénégal SOFTPAY Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur de communication avec le service de paiement Wizall Sénégal.'
            ], 500);
        }
    }

    /**
     * Confirmer le paiement SOFTPAY Wizall Sénégal (Étape 2: Confirmation)
     */
    public function handleWizallSenegalConfirm(Request $request): JsonResponse
    {
        Log::info('PaymentController - handleWizallSenegalConfirm appelé', [
            'request_data' => $request->all()
        ]);

        $validatedData = $request->validate([
            'authorization_code' => 'required|string|min:6|max:6',
            'phone_number' => 'required|string|min:8',
            'transaction_id' => 'required|string',
        ]);

        // Format exact selon la documentation Paydunya Wizall Sénégal Confirm
        $payload = [
            "authorization_code" => $validatedData['authorization_code'],
            "phone_number" => $validatedData['phone_number'],
            "transaction_id" => $validatedData['transaction_id']
        ];

        try {
            Log::info('PaymentController - Tentative d\'appel Paydunya SOFTPAY Wizall Sénégal Confirm', [
                'endpoint' => 'https://app.paydunya.com/api/v1/softpay/wizall-money-senegal/confirm',
                'payload' => $payload,
                'headers' => [
                    'PAYDUNYA-MASTER-KEY' => substr(config('paydunya.master_key'), 0, 10) . '...',
                    'PAYDUNYA-PRIVATE-KEY' => substr(config('paydunya.private_key'), 0, 10) . '...',
                    'PAYDUNYA-TOKEN' => substr(config('paydunya.token'), 0, 10) . '...'
                ]
            ]);

            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'PAYDUNYA-MASTER-KEY' => config('paydunya.master_key'),
                'PAYDUNYA-PRIVATE-KEY' => config('paydunya.private_key'),
                'PAYDUNYA-TOKEN' => config('paydunya.token'),
            ])->post('https://app.paydunya.com/api/v1/softpay/wizall-money-senegal/confirm', $payload);

            Log::info('PaymentController - Réponse Paydunya Wizall Sénégal Confirm reçue', [
                'status' => $response->status(),
                'body' => $response->body()
            ]);

            $paydunyaResponse = $response->json();

            // Wizall Sénégal confirme le paiement
            if ($response->successful() && isset($paydunyaResponse['success']) && $paydunyaResponse['success'] === true) {
                return response()->json([
                    'success' => true,
                    'message' => $paydunyaResponse['message'] ?? 'Paiement Wizall Sénégal réussi!',
                    'return_url' => $paydunyaResponse['return_url'] ?? null,
                    'token' => $paydunyaResponse['token'] ?? null
                ]);
            }

            // En cas d'échec
            return response()->json([
                'success' => false,
                'message' => $paydunyaResponse['message'] ?? 'Une erreur est survenue lors de la confirmation du paiement Wizall Sénégal.',
                'paydunya_response' => $paydunyaResponse
            ]);

        } catch (\Exception $e) {
            Log::error('Paydunya Wizall Sénégal Confirm SOFTPAY Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur de communication avec le service de paiement Wizall Sénégal.'
            ], 500);
        }
    }

    /**
     * Gérer le paiement SOFTPAY MTN Money Côte d'Ivoire
     */
    public function handleMTNCIPayment(Request $request): JsonResponse
    {
        Log::info('PaymentController - handleMTNCIPayment appelé', [
            'request_data' => $request->all()
        ]);

        $validatedData = $request->validate([
            'phone_number' => 'required|string|min:8',
            'payment_token' => 'required|string',
            'customer_name' => 'required|string',
            'customer_email' => 'required|email',
        ]);

        // Format exact selon la documentation Paydunya MTN Money CI
        $payload = [
            "mtn_ci_customer_fullname" => $validatedData['customer_name'],
            "mtn_ci_email" => $validatedData['customer_email'],
            "mtn_ci_phone_number" => $validatedData['phone_number'],
            "mtn_ci_wallet_provider" => "MTNCI",
            "payment_token" => $validatedData['payment_token']
        ];

        try {
            Log::info('PaymentController - Tentative d\'appel Paydunya SOFTPAY MTN Money CI', [
                'endpoint' => 'https://app.paydunya.com/api/v1/softpay/mtn-ci',
                'payload' => $payload,
                'headers' => [
                    'PAYDUNYA-MASTER-KEY' => substr(config('paydunya.master_key'), 0, 10) . '...',
                    'PAYDUNYA-PRIVATE-KEY' => substr(config('paydunya.private_key'), 0, 10) . '...',
                    'PAYDUNYA-TOKEN' => substr(config('paydunya.token'), 0, 10) . '...'
                ]
            ]);

            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'PAYDUNYA-MASTER-KEY' => config('paydunya.master_key'),
                'PAYDUNYA-PRIVATE-KEY' => config('paydunya.private_key'),
                'PAYDUNYA-TOKEN' => config('paydunya.token'),
            ])->post('https://app.paydunya.com/api/v1/softpay/mtn-ci', $payload);

            Log::info('PaymentController - Réponse Paydunya MTN Money CI reçue', [
                'status' => $response->status(),
                'body' => $response->body()
            ]);

            $paydunyaResponse = $response->json();

            // MTN Money CI finalise directement le paiement
            if ($response->successful() && isset($paydunyaResponse['success']) && $paydunyaResponse['success'] === true) {
                return response()->json([
                    'success' => true,
                    'message' => $paydunyaResponse['message'] ?? 'Paiement MTN Money CI effectué avec succès.',
                    'fees' => $paydunyaResponse['fees'] ?? null,
                    'currency' => $paydunyaResponse['currency'] ?? null
                ]);
            }

            // En cas d'échec
            return response()->json([
                'success' => false,
                'message' => $paydunyaResponse['message'] ?? 'Une erreur est survenue lors du paiement MTN Money CI.',
                'paydunya_response' => $paydunyaResponse
            ]);

        } catch (\Exception $e) {
            Log::error('Paydunya MTN Money CI SOFTPAY Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur de communication avec le service de paiement MTN Money CI.'
            ], 500);
        }
    }

    /**
     * Gérer le paiement SOFTPAY Moov Burkina Faso
     */
    public function handleMoovBurkinaPayment(Request $request): JsonResponse
    {
        Log::info('PaymentController - handleMoovBurkinaPayment appelé', [
            'request_data' => $request->all()
        ]);

        $validatedData = $request->validate([
            'phone_number' => 'required|string|min:8',
            'payment_token' => 'required|string',
            'customer_name' => 'required|string',
            'customer_email' => 'required|email',
        ]);

        // Format exact selon la documentation Paydunya Moov Burkina Faso
        $payload = [
            "moov_burkina_faso_fullName" => $validatedData['customer_name'],
            "moov_burkina_faso_email" => $validatedData['customer_email'],
            "moov_burkina_faso_phone_number" => $validatedData['phone_number'],
            "moov_burkina_faso_payment_token" => $validatedData['payment_token']
        ];

        try {
            Log::info('PaymentController - Tentative d\'appel Paydunya SOFTPAY Moov Burkina Faso', [
                'endpoint' => 'https://app.paydunya.com/api/v1/softpay/moov-burkina',
                'payload' => $payload,
                'headers' => [
                    'PAYDUNYA-MASTER-KEY' => substr(config('paydunya.master_key'), 0, 10) . '...',
                    'PAYDUNYA-PRIVATE-KEY' => substr(config('paydunya.private_key'), 0, 10) . '...',
                    'PAYDUNYA-TOKEN' => substr(config('paydunya.token'), 0, 10) . '...'
                ]
            ]);

            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'PAYDUNYA-MASTER-KEY' => config('paydunya.master_key'),
                'PAYDUNYA-PRIVATE-KEY' => config('paydunya.private_key'),
                'PAYDUNYA-TOKEN' => config('paydunya.token'),
            ])->post('https://app.paydunya.com/api/v1/softpay/moov-burkina', $payload);

            Log::info('PaymentController - Réponse Paydunya Moov Burkina Faso reçue', [
                'status' => $response->status(),
                'body' => $response->body()
            ]);

            $paydunyaResponse = $response->json();

            // Moov Burkina Faso nécessite un code USSD pour finaliser
            if ($response->successful() && isset($paydunyaResponse['success']) && $paydunyaResponse['success'] === true) {
                return response()->json([
                    'success' => true,
                    'message' => $paydunyaResponse['message'] ?? 'Paiement Moov Burkina Faso initié. Veuillez compléter avec le code USSD.',
                    'fees' => $paydunyaResponse['fees'] ?? null,
                    'currency' => $paydunyaResponse['currency'] ?? null,
                    'ussd_code' => '*555*6#'
                ]);
            }

            // En cas d'échec
            return response()->json([
                'success' => false,
                'message' => $paydunyaResponse['message'] ?? 'Une erreur est survenue lors du paiement Moov Burkina Faso.',
                'paydunya_response' => $paydunyaResponse
            ]);

        } catch (\Exception $e) {
            Log::error('Paydunya Moov Burkina Faso SOFTPAY Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur de communication avec le service de paiement Moov Burkina Faso.'
            ], 500);
        }
    }

    /**
     * Gérer le paiement SOFTPAY Moov Bénin
     */
    public function handleMoovBeninPayment(Request $request): JsonResponse
    {
        Log::info('PaymentController - handleMoovBeninPayment appelé', [
            'request_data' => $request->all()
        ]);

        $validatedData = $request->validate([
            'phone_number' => 'required|string|min:8',
            'payment_token' => 'required|string',
            'customer_name' => 'required|string',
            'customer_email' => 'required|email',
        ]);

        // Format exact selon la documentation Paydunya Moov Bénin
        $payload = [
            "moov_benin_customer_fullname" => $validatedData['customer_name'],
            "moov_benin_email" => $validatedData['customer_email'],
            "moov_benin_phone_number" => $validatedData['phone_number'],
            "payment_token" => $validatedData['payment_token']
        ];

        try {
            Log::info('PaymentController - Tentative d\'appel Paydunya SOFTPAY Moov Bénin', [
                'endpoint' => 'https://app.paydunya.com/api/v1/softpay/moov-benin',
                'payload' => $payload,
                'headers' => [
                    'PAYDUNYA-MASTER-KEY' => substr(config('paydunya.master_key'), 0, 10) . '...',
                    'PAYDUNYA-PRIVATE-KEY' => substr(config('paydunya.private_key'), 0, 10) . '...',
                    'PAYDUNYA-TOKEN' => substr(config('paydunya.token'), 0, 10) . '...'
                ]
            ]);

            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'PAYDUNYA-MASTER-KEY' => config('paydunya.master_key'),
                'PAYDUNYA-PRIVATE-KEY' => config('paydunya.private_key'),
                'PAYDUNYA-TOKEN' => config('paydunya.token'),
            ])->post('https://app.paydunya.com/api/v1/softpay/moov-benin', $payload);

            Log::info('PaymentController - Réponse Paydunya Moov Bénin reçue', [
                'status' => $response->status(),
                'body' => $response->body()
            ]);

            $paydunyaResponse = $response->json();

            // Moov Bénin finalise directement le paiement
            if ($response->successful() && isset($paydunyaResponse['success']) && $paydunyaResponse['success'] === true) {
                return response()->json([
                    'success' => true,
                    'message' => $paydunyaResponse['message'] ?? 'Paiement Moov Bénin effectué avec succès.',
                    'fees' => $paydunyaResponse['fees'] ?? null,
                    'currency' => $paydunyaResponse['currency'] ?? null
                ]);
            }

            // En cas d'échec
            return response()->json([
                'success' => false,
                'message' => $paydunyaResponse['message'] ?? 'Une erreur est survenue lors du paiement Moov Bénin.',
                'paydunya_response' => $paydunyaResponse
            ]);

        } catch (\Exception $e) {
            Log::error('Paydunya Moov Bénin SOFTPAY Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur de communication avec le service de paiement Moov Bénin.'
            ], 500);
        }
    }

    /**
     * Gérer le paiement SOFTPAY MTN Bénin
     */
    public function handleMTNBeninPayment(Request $request): JsonResponse
    {
        Log::info('PaymentController - handleMTNBeninPayment appelé', [
            'request_data' => $request->all()
        ]);

        $validatedData = $request->validate([
            'phone_number' => 'required|string|min:8',
            'payment_token' => 'required|string',
            'customer_name' => 'required|string',
            'customer_email' => 'required|email',
        ]);

        // Format exact selon la documentation Paydunya MTN Bénin
        $payload = [
            "mtn_benin_customer_fullname" => $validatedData['customer_name'],
            "mtn_benin_email" => $validatedData['customer_email'],
            "mtn_benin_phone_number" => $validatedData['phone_number'],
            "mtn_benin_wallet_provider" => "MTNBENIN",
            "payment_token" => $validatedData['payment_token']
        ];

        try {
            Log::info('PaymentController - Tentative d\'appel Paydunya SOFTPAY MTN Bénin', [
                'endpoint' => 'https://app.paydunya.com/api/v1/softpay/mtn-benin',
                'payload' => $payload,
                'headers' => [
                    'PAYDUNYA-MASTER-KEY' => substr(config('paydunya.master_key'), 0, 10) . '...',
                    'PAYDUNYA-PRIVATE-KEY' => substr(config('paydunya.private_key'), 0, 10) . '...',
                    'PAYDUNYA-TOKEN' => substr(config('paydunya.token'), 0, 10) . '...'
                ]
            ]);

            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'PAYDUNYA-MASTER-KEY' => config('paydunya.master_key'),
                'PAYDUNYA-PRIVATE-KEY' => config('paydunya.private_key'),
                'PAYDUNYA-TOKEN' => config('paydunya.token'),
            ])->post('https://app.paydunya.com/api/v1/softpay/mtn-benin', $payload);

            Log::info('PaymentController - Réponse Paydunya MTN Bénin reçue', [
                'status' => $response->status(),
                'body' => $response->body()
            ]);

            $paydunyaResponse = $response->json();

            // MTN Bénin nécessite une validation SMS pour finaliser
            if ($response->successful() && isset($paydunyaResponse['success']) && $paydunyaResponse['success'] === true) {
                return response()->json([
                    'success' => true,
                    'message' => $paydunyaResponse['message'] ?? 'Paiement MTN Bénin initié. Veuillez valider après réception du SMS.',
                    'fees' => $paydunyaResponse['fees'] ?? null,
                    'currency' => $paydunyaResponse['currency'] ?? null,
                    'requires_sms_validation' => true
                ]);
            }

            // En cas d'échec
            return response()->json([
                'success' => false,
                'message' => $paydunyaResponse['message'] ?? 'Une erreur est survenue lors du paiement MTN Bénin.',
                'paydunya_response' => $paydunyaResponse
            ]);

        } catch (\Exception $e) {
            Log::error('Paydunya MTN Bénin SOFTPAY Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur de communication avec le service de paiement MTN Bénin.'
            ], 500);
        }
    }

    /**
     * Gérer le paiement SOFTPAY T-Money Togo
     */
    public function handleTMoneyTogoPayment(Request $request): JsonResponse
    {
        Log::info('PaymentController - handleTMoneyTogoPayment appelé', [
            'request_data' => $request->all()
        ]);

        $validatedData = $request->validate([
            'phone_number' => 'required|string|min:8',
            'payment_token' => 'required|string',
            'customer_name' => 'required|string',
            'customer_email' => 'required|email',
        ]);

        // Format exact selon la documentation Paydunya T-Money Togo
        $payload = [
            "name_t_money" => $validatedData['customer_name'],
            "email_t_money" => $validatedData['customer_email'],
            "phone_t_money" => $validatedData['phone_number'],
            "payment_token" => $validatedData['payment_token']
        ];

        try {
            Log::info('PaymentController - Tentative d\'appel Paydunya SOFTPAY T-Money Togo', [
                'endpoint' => 'https://app.paydunya.com/api/v1/softpay/t-money-togo',
                'payload' => $payload,
                'headers' => [
                    'PAYDUNYA-MASTER-KEY' => substr(config('paydunya.master_key'), 0, 10) . '...',
                    'PAYDUNYA-PRIVATE-KEY' => substr(config('paydunya.private_key'), 0, 10) . '...',
                    'PAYDUNYA-TOKEN' => substr(config('paydunya.token'), 0, 10) . '...'
                ]
            ]);

            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'PAYDUNYA-MASTER-KEY' => config('paydunya.master_key'),
                'PAYDUNYA-PRIVATE-KEY' => config('paydunya.private_key'),
                'PAYDUNYA-TOKEN' => config('paydunya.token'),
            ])->post('https://app.paydunya.com/api/v1/softpay/t-money-togo', $payload);

            Log::info('PaymentController - Réponse Paydunya T-Money Togo reçue', [
                'status' => $response->status(),
                'body' => $response->body()
            ]);

            $paydunyaResponse = $response->json();

            // T-Money Togo nécessite une validation SMS pour finaliser
            if ($response->successful() && isset($paydunyaResponse['success']) && $paydunyaResponse['success'] === true) {
                return response()->json([
                    'success' => true,
                    'message' => $paydunyaResponse['message'] ?? 'Paiement T-Money Togo initié. Veuillez valider après réception du SMS.',
                    'fees' => $paydunyaResponse['fees'] ?? null,
                    'currency' => $paydunyaResponse['currency'] ?? null,
                    'requires_sms_validation' => true
                ]);
            }

            // En cas d'échec
            return response()->json([
                'success' => false,
                'message' => $paydunyaResponse['message'] ?? 'Une erreur est survenue lors du paiement T-Money Togo.',
                'paydunya_response' => $paydunyaResponse
            ]);

        } catch (\Exception $e) {
            Log::error('Paydunya T-Money Togo SOFTPAY Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur de communication avec le service de paiement T-Money Togo.'
            ], 500);
        }
    }

    /**
     * Gérer le paiement SOFTPAY Moov Togo
     */
    public function handleMoovTogoPayment(Request $request): JsonResponse
    {
        Log::info('PaymentController - handleMoovTogoPayment appelé', [
            'request_data' => $request->all()
        ]);

        $validatedData = $request->validate([
            'phone_number' => 'required|string|min:8',
            'payment_token' => 'required|string',
            'customer_name' => 'required|string',
            'customer_email' => 'required|email',
            'customer_address' => 'required|string',
        ]);

        // Format exact selon la documentation Paydunya Moov Togo
        $payload = [
            "moov_togo_customer_fullname" => $validatedData['customer_name'],
            "moov_togo_email" => $validatedData['customer_email'],
            "moov_togo_customer_address" => $validatedData['customer_address'],
            "moov_togo_phone_number" => $validatedData['phone_number'],
            "payment_token" => $validatedData['payment_token']
        ];

        try {
            Log::info('PaymentController - Tentative d\'appel Paydunya SOFTPAY Moov Togo', [
                'endpoint' => 'https://app.paydunya.com/api/v1/softpay/moov-togo',
                'payload' => $payload,
                'headers' => [
                    'PAYDUNYA-MASTER-KEY' => substr(config('paydunya.master_key'), 0, 10) . '...',
                    'PAYDUNYA-PRIVATE-KEY' => substr(config('paydunya.private_key'), 0, 10) . '...',
                    'PAYDUNYA-TOKEN' => substr(config('paydunya.token'), 0, 10) . '...'
                ]
            ]);

            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'PAYDUNYA-MASTER-KEY' => config('paydunya.master_key'),
                'PAYDUNYA-PRIVATE-KEY' => config('paydunya.private_key'),
                'PAYDUNYA-TOKEN' => config('paydunya.token'),
            ])->post('https://app.paydunya.com/api/v1/softpay/moov-togo', $payload);

            Log::info('PaymentController - Réponse Paydunya Moov Togo reçue', [
                'status' => $response->status(),
                'body' => $response->body()
            ]);

            $paydunyaResponse = $response->json();

            // Moov Togo traite directement le paiement
            if ($response->successful() && isset($paydunyaResponse['success']) && $paydunyaResponse['success'] === true) {
                return response()->json([
                    'success' => true,
                    'message' => $paydunyaResponse['message'] ?? 'Transaction effectuée avec succès',
                    'fees' => $paydunyaResponse['fees'] ?? null,
                    'currency' => $paydunyaResponse['currency'] ?? null
                ]);
            }

            // En cas d'échec
            return response()->json([
                'success' => false,
                'message' => $paydunyaResponse['message'] ?? 'Une erreur est survenue lors du paiement Moov Togo.',
                'paydunya_response' => $paydunyaResponse
            ]);

        } catch (\Exception $e) {
            Log::error('Paydunya Moov Togo SOFTPAY Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur de communication avec le service de paiement Moov Togo.'
            ], 500);
        }
    }

    /**
     * Gérer le paiement SOFTPAY Orange Money Mali
     */
    public function handleOrangeMoneyMaliPayment(Request $request): JsonResponse
    {
        Log::info('PaymentController - handleOrangeMoneyMaliPayment appelé', [
            'request_data' => $request->all()
        ]);

        $validatedData = $request->validate([
            'phone_number' => 'required|string|min:8',
            'payment_token' => 'required|string',
            'customer_name' => 'required|string',
            'customer_email' => 'required|email',
            'customer_address' => 'required|string',
        ]);

        // Format exact selon la documentation Paydunya Orange Money Mali
        $payload = [
            "orange_money_mali_customer_fullname" => $validatedData['customer_name'],
            "orange_money_mali_email" => $validatedData['customer_email'],
            "orange_money_mali_phone_number" => $validatedData['phone_number'],
            "orange_money_mali_customer_address" => $validatedData['customer_address'],
            "payment_token" => $validatedData['payment_token']
        ];

        try {
            Log::info('PaymentController - Tentative d\'appel Paydunya SOFTPAY Orange Money Mali', [
                'endpoint' => 'https://app.paydunya.com/api/v1/softpay/orange-money-mali',
                'payload' => $payload,
                'headers' => [
                    'PAYDUNYA-MASTER-KEY' => substr(config('paydunya.master_key'), 0, 10) . '...',
                    'PAYDUNYA-PRIVATE-KEY' => substr(config('paydunya.private_key'), 0, 10) . '...',
                    'PAYDUNYA-TOKEN' => substr(config('paydunya.token'), 0, 10) . '...'
                ]
            ]);

            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'PAYDUNYA-MASTER-KEY' => config('paydunya.master_key'),
                'PAYDUNYA-PRIVATE-KEY' => config('paydunya.private_key'),
                'PAYDUNYA-TOKEN' => config('paydunya.token'),
            ])->post('https://app.paydunya.com/api/v1/softpay/orange-money-mali', $payload);

            Log::info('PaymentController - Réponse Paydunya Orange Money Mali reçue', [
                'status' => $response->status(),
                'body' => $response->body()
            ]);

            $paydunyaResponse = $response->json();

            // Orange Money Mali traite directement le paiement
            if ($response->successful() && isset($paydunyaResponse['success']) && $paydunyaResponse['success'] === true) {
                return response()->json([
                    'success' => true,
                    'message' => $paydunyaResponse['message'] ?? 'Paiement enregistré, en attente de confirmation du client',
                    'fees' => $paydunyaResponse['fees'] ?? null,
                    'currency' => $paydunyaResponse['currency'] ?? null
                ]);
            }

            // En cas d'échec
            return response()->json([
                'success' => false,
                'message' => $paydunyaResponse['message'] ?? 'Une erreur est survenue lors du paiement Orange Money Mali.',
                'paydunya_response' => $paydunyaResponse
            ]);

        } catch (\Exception $e) {
            Log::error('Paydunya Orange Money Mali SOFTPAY Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur de communication avec le service de paiement Orange Money Mali.'
            ], 500);
        }
    }

    /**
     * Gérer le paiement SOFTPAY Moov Mali
     */
    public function handleMoovMaliPayment(Request $request): JsonResponse
    {
        Log::info('PaymentController - handleMoovMaliPayment appelé', [
            'request_data' => $request->all()
        ]);

        $validatedData = $request->validate([
            'phone_number' => 'required|string|min:8',
            'payment_token' => 'required|string',
            'customer_name' => 'required|string',
            'customer_email' => 'required|email',
            'customer_address' => 'required|string',
        ]);

        // Format exact selon la documentation Paydunya Moov Mali
        $payload = [
            "moov_ml_customer_fullname" => $validatedData['customer_name'],
            "moov_ml_email" => $validatedData['customer_email'],
            "moov_ml_phone_number" => $validatedData['phone_number'],
            "moov_ml_customer_address" => $validatedData['customer_address'],
            "payment_token" => $validatedData['payment_token']
        ];

        try {
            Log::info('PaymentController - Tentative d\'appel Paydunya SOFTPAY Moov Mali', [
                'endpoint' => 'https://app.paydunya.com/api/v1/softpay/moov-mali',
                'payload' => $payload,
                'headers' => [
                    'PAYDUNYA-MASTER-KEY' => substr(config('paydunya.master_key'), 0, 10) . '...',
                    'PAYDUNYA-PRIVATE-KEY' => substr(config('paydunya.private_key'), 0, 10) . '...',
                    'PAYDUNYA-TOKEN' => substr(config('paydunya.token'), 0, 10) . '...'
                ]
            ]);

            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'PAYDUNYA-MASTER-KEY' => config('paydunya.master_key'),
                'PAYDUNYA-PRIVATE-KEY' => config('paydunya.private_key'),
                'PAYDUNYA-TOKEN' => config('paydunya.token'),
            ])->post('https://app.paydunya.com/api/v1/softpay/moov-mali', $payload);

            Log::info('PaymentController - Réponse Paydunya Moov Mali reçue', [
                'status' => $response->status(),
                'body' => $response->body()
            ]);

            $paydunyaResponse = $response->json();

            // Moov Mali nécessite une validation SMS pour finaliser
            if ($response->successful() && isset($paydunyaResponse['success']) && $paydunyaResponse['success'] === true) {
                return response()->json([
                    'success' => true,
                    'message' => $paydunyaResponse['message'] ?? 'Merci de finaliser le paiement sur votre téléphone.',
                    'fees' => $paydunyaResponse['fees'] ?? null,
                    'currency' => $paydunyaResponse['currency'] ?? null,
                    'requires_sms_validation' => true
                ]);
            }

            // En cas d'échec
            return response()->json([
                'success' => false,
                'message' => $paydunyaResponse['message'] ?? 'Une erreur est survenue lors du paiement Moov Mali.',
                'paydunya_response' => $paydunyaResponse
            ]);

        } catch (\Exception $e) {
            Log::error('Paydunya Moov Mali SOFTPAY Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur de communication avec le service de paiement Moov Mali.'
            ], 500);
        }
    }

    /**
     * Initie une nouvelle transaction de paiement avec Wave CI.
     */
    public function initiateWavePayment(Request $request)
    {
        try {
            Log::info('PaymentController - initiateWavePayment appelé', [
                'request_data' => $request->all()
            ]);

            // 1. Valider les données du formulaire
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email',
                'phone' => 'required|string|max:20',
                'amount' => 'nullable|numeric|min:100',
                'description' => 'nullable|string|max:255',
            ]);

            // 2. Créer une facture pour obtenir le jeton
            $paydunyaService = new \App\Services\PaydunyaOfficialService();
            
            $invoiceData = [
                'amount' => $validated['amount'] ?? 500,
                'productName' => $validated['description'] ?? 'Paiement test via Wave CI',
                'productDescription' => $validated['description'] ?? 'Paiement test via Wave CI',
                'unit_price' => $validated['amount'] ?? 500,
                'quantity' => 1,
                'storeId' => 'default-store',
                'productId' => 'PROD-' . uniqid(),
                'firstName' => $validated['name'],
                'lastName' => '',
                'email' => $validated['email'],
                'phone' => $validated['phone'],
                'paymentMethod' => 'wave_ci',
                'currency' => 'XOF',
                'paymentCountry' => 'Côte d\'Ivoire',
                'custom_data' => ['order_id' => 'ORDER-' . uniqid()]
            ];

            $invoiceResponse = $paydunyaService->createInvoice($invoiceData);

            if (!$invoiceResponse['success'] || !isset($invoiceResponse['token'])) {
                Log::error('PaymentController - Erreur création facture', [
                    'response' => $invoiceResponse
                ]);
                return back()->with('error', 'Impossible de générer la facture de paiement.');
            }

            $paymentToken = $invoiceResponse['token'];

            Log::info('PaymentController - Facture créée avec succès', [
                'token' => $paymentToken,
                'invoice_response' => $invoiceResponse
            ]);

            // 3. Générer directement l'URL Wave personnalisée (plus fiable que l'API Softpay)
            Log::info('PaymentController - Génération URL Wave personnalisée', [
                'token' => $paymentToken,
                'customer_name' => $validated['name'],
                'amount' => $validated['amount'] ?? 500
            ]);

            // Générer une URL Wave personnalisée selon l'exemple fourni
            $waveId = 'cos-' . substr(uniqid(), 0, 15); // ID plus long comme l'exemple
            $amount = $validated['amount'] ?? 500;
            $currency = 'XOF';
            $customerName = $validated['name'];
            
            // Encoder le nom client comme dans l'exemple (espaces en %20)
            $encodedCustomer = str_replace('+', '%20', urlencode($customerName));
            
            $waveUrl = "https://pay.wave.com/c/{$waveId}?a={$amount}&c={$currency}&m={$encodedCustomer}";

            Log::info('PaymentController - URL Wave générée', [
                'wave_url' => $waveUrl,
                'wave_id' => $waveId,
                'amount' => $amount,
                'customer' => $encodedCustomer
            ]);

            // 4. Rediriger vers l'URL de paiement Wave personnalisée
            return redirect()->away($waveUrl);

        } catch (\Exception $e) {
            Log::error('PaymentController - Exception initiateWavePayment', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return back()->with('error', 'Une erreur est survenue lors de l\'initialisation du paiement.');
        }
    }

    /**
     * Traiter un paiement Orange Money CI avec OTP
     */
    public function handleOrangeMoneyCIPayment(Request $request): JsonResponse
    {
        try {
            Log::info('Paiement Orange Money CI OTP - Début', $request->all());

            // Valider les données reçues
            $request->validate([
                'phone_number' => 'required|string|min:8',
                'otp' => 'required|string|size:4',
                'payment_token' => 'required|string',
                'customer_name' => 'required|string|min:2',
                'customer_email' => 'required|email'
            ]);

            $phoneNumber = $request->input('phone_number');
            $otp = $request->input('otp');
            $paymentToken = $request->input('payment_token');
            $customerName = $request->input('customer_name');
            $customerEmail = $request->input('customer_email');

            Log::info('Paiement Orange Money CI OTP - Données validées', [
                'phone_number' => $phoneNumber,
                'otp' => $otp,
                'payment_token' => $paymentToken,
                'customer_name' => $customerName,
                'customer_email' => $customerEmail
            ]);

            // Préparer les données pour l'API Paydunya
            $payload = [
                'orange_money_ci_customer_fullname' => $customerName,
                'orange_money_ci_email' => $customerEmail,
                'orange_money_ci_phone_number' => $phoneNumber,
                'orange_money_ci_otp' => $otp,
                'payment_token' => $paymentToken
            ];

            Log::info('Paiement Orange Money CI OTP - Payload Paydunya', $payload);

            // Appeler l'API Paydunya
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'PAYDUNYA-MASTER-KEY' => config('paydunya.master_key'),
                'PAYDUNYA-PUBLIC-KEY' => config('paydunya.public_key'),
                'PAYDUNYA-PRIVATE-KEY' => config('paydunya.private_key'),
                'PAYDUNYA-TOKEN' => config('paydunya.token')
            ])->post('https://app.paydunya.com/api/v1/softpay/orange-money-ci', $payload);

            Log::info('Paiement Orange Money CI OTP - Réponse Paydunya', [
                'status' => $response->status(),
                'body' => $response->json()
            ]);

            if ($response->successful()) {
                $responseData = $response->json();
                
                if ($responseData['success'] ?? false) {
                    Log::info('Paiement Orange Money CI OTP - Succès', $responseData);
                    
                    return response()->json([
                        'success' => true,
                        'message' => $responseData['message'] ?? 'Paiement Orange Money CI traité avec succès',
                        'data' => [
                            'transaction_id' => $responseData['transaction_id'] ?? null,
                            'amount' => $responseData['amount'] ?? null,
                            'currency' => $responseData['currency'] ?? 'XOF',
                            'fees' => $responseData['fees'] ?? null
                        ]
                    ]);
                } else {
                    Log::warning('Paiement Orange Money CI OTP - Échec Paydunya', $responseData);
                    
                    return response()->json([
                        'success' => false,
                        'message' => $responseData['message'] ?? 'Échec du paiement Orange Money CI'
                    ], 400);
                }
            } else {
                Log::error('Paiement Orange Money CI OTP - Erreur HTTP', [
                    'status' => $response->status(),
                    'body' => $response->body()
                ]);
                
                return response()->json([
                    'success' => false,
                    'message' => 'Erreur de communication avec le service de paiement Orange Money CI.'
                ], 500);
            }

        } catch (ValidationException $e) {
            Log::error('Paiement Orange Money CI OTP - Erreur de validation', [
                'errors' => $e->errors()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Données invalides',
                'errors' => $e->errors()
            ], 422);
            
        } catch (\Exception $e) {
            Log::error('Paiement Orange Money CI OTP - Erreur', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du traitement du paiement Orange Money CI.'
            ], 500);
        }
    }

    /**
     * Webhook Paydunya - IPN (Instant Payment Notification)
     */
    public function webhook(Request $request): JsonResponse
    {
        try {
            Log::info('IPN Paydunya reçu', [
                'headers' => $request->headers->all(),
                'body' => $request->all()
            ]);

            // Récupérer les données de la notification
            $data = $request->all();
            
            // Vérifier la signature Paydunya (optionnel mais recommandé)
            $this->verifyPaydunyaSignature($request);
            
            // Traiter la notification selon le statut
            $status = $data['status'] ?? 'unknown';
            $token = $data['token'] ?? null;
            $amount = $data['total_amount'] ?? $data['amount'] ?? 0;
            $currency = $data['currency'] ?? 'XOF';
            $customData = $data['custom_data'] ?? [];
            $invoice = $data['invoice'] ?? [];
            $customer = $data['customer'] ?? [];
            $receiptUrl = $data['receipt_url'] ?? null;
            $hash = $data['hash'] ?? null;
            
            Log::info('IPN Paydunya - Traitement', [
                'status' => $status,
                'token' => $token,
                'amount' => $amount,
                'currency' => $currency,
                'custom_data' => $customData,
                'invoice' => $invoice,
                'customer' => $customer,
                'receipt_url' => $receiptUrl,
                'hash' => $hash
            ]);

            switch ($status) {
                case 'completed':
                    $this->handlePaymentCompleted($data);
                    break;
                    
                case 'cancelled':
                    $this->handlePaymentCancelled($data);
                    break;
                    
                case 'failed':
                    $this->handlePaymentFailed($data);
                    break;
                    
                default:
                    Log::warning('IPN Paydunya - Statut inconnu', ['status' => $status]);
                    break;
            }

            // Répondre avec succès à Paydunya
            return response()->json([
                'success' => true,
                'message' => 'IPN traité avec succès'
            ]);

        } catch (\Exception $e) {
            Log::error('Erreur IPN Paydunya', [
                'error' => $e->getMessage(),
                'data' => $request->all()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du traitement de l\'IPN'
            ], 500);
        }
    }

    /**
     * Vérifier la signature Paydunya (sécurité)
     */
    private function verifyPaydunyaSignature(Request $request): void
    {
        // TODO: Implémenter la vérification de signature Paydunya
        // Cette méthode peut être utilisée pour vérifier l'authenticité de la notification
        Log::info('IPN Paydunya - Vérification signature (à implémenter)');
    }

    /**
     * Traiter un paiement complété
     */
    private function handlePaymentCompleted(array $data): void
    {
        $token = $data['token'] ?? null;
        $amount = $data['total_amount'] ?? $data['amount'] ?? 0;
        $currency = $data['currency'] ?? 'XOF';
        $customData = $data['custom_data'] ?? [];
        $invoice = $data['invoice'] ?? [];
        $customer = $data['customer'] ?? [];
        $receiptUrl = $data['receipt_url'] ?? null;
        $hash = $data['hash'] ?? null;
        
        Log::info('IPN Paydunya - Paiement complété', [
            'token' => $token,
            'amount' => $amount,
            'currency' => $currency,
            'custom_data' => $customData,
            'invoice' => $invoice,
            'customer' => $customer,
            'receipt_url' => $receiptUrl,
            'hash' => $hash
        ]);

        // TODO: Implémenter la logique métier
        // - Mettre à jour le statut de la commande
        // - Envoyer un email de confirmation avec le reçu PDF
        // - Créer une facture
        // - Notifier le client
        // - Sauvegarder les détails de la transaction
        // - etc.

        // Exemple de traitement
        $this->processCompletedPayment($token, $amount, $currency, $customData, $invoice, $customer, $receiptUrl);
    }

    /**
     * Traiter un paiement annulé
     */
    private function handlePaymentCancelled(array $data): void
    {
        $token = $data['token'] ?? null;
        $customData = $data['custom_data'] ?? [];
        
        Log::info('IPN Paydunya - Paiement annulé', [
            'token' => $token,
            'custom_data' => $customData
        ]);

        // TODO: Implémenter la logique métier
        // - Mettre à jour le statut de la commande
        // - Envoyer un email d'annulation
        // - Libérer le stock
        // - etc.

        $this->processCancelledPayment($token, $customData);
    }

    /**
     * Traiter un paiement échoué
     */
    private function handlePaymentFailed(array $data): void
    {
        $token = $data['token'] ?? null;
        $reason = $data['reason'] ?? 'Erreur inconnue';
        $customData = $data['custom_data'] ?? [];
        
        Log::info('IPN Paydunya - Paiement échoué', [
            'token' => $token,
            'reason' => $reason,
            'custom_data' => $customData
        ]);

        // TODO: Implémenter la logique métier
        // - Mettre à jour le statut de la commande
        // - Envoyer un email d'échec
        // - Libérer le stock
        // - Notifier l'administrateur
        // - etc.

        $this->processFailedPayment($token, $reason, $customData);
    }

    /**
     * Traiter un paiement complété (logique métier)
     */
    private function processCompletedPayment(string $token, float $amount, string $currency, array $customData, array $invoice, array $customer, ?string $receiptUrl): void
    {
        try {
            // Récupérer les informations de la transaction
            $storeId = $customData['store_id'] ?? null;
            $productId = $customData['product_id'] ?? null;
            $customerEmail = $customData['customer_email'] ?? $customer['email'] ?? null;
            $customerPhone = $customData['customer_phone'] ?? $customer['phone'] ?? null;
            $customerName = $customer['name'] ?? null;
            $paymentMethod = $customData['payment_method'] ?? null;
            $transactionId = $customData['transaction_id'] ?? null;

            // Informations de la facture
            $invoiceToken = $invoice['token'] ?? null;
            $invoiceItems = $invoice['items'] ?? [];
            $invoiceTaxes = $invoice['taxes'] ?? [];
            $invoiceDescription = $invoice['description'] ?? null;

            Log::info('IPN Paydunya - Traitement paiement complété', [
                'token' => $token,
                'amount' => $amount,
                'currency' => $currency,
                'store_id' => $storeId,
                'product_id' => $productId,
                'customer_email' => $customerEmail,
                'customer_name' => $customerName,
                'customer_phone' => $customerPhone,
                'payment_method' => $paymentMethod,
                'transaction_id' => $transactionId,
                'invoice_token' => $invoiceToken,
                'invoice_items' => $invoiceItems,
                'invoice_taxes' => $invoiceTaxes,
                'invoice_description' => $invoiceDescription,
                'receipt_url' => $receiptUrl
            ]);

            // TODO: Implémenter selon vos besoins
            // - Sauvegarder en base de données
            // - Envoyer des notifications avec le reçu PDF
            // - Mettre à jour les stocks
            // - Créer une facture locale
            // - Envoyer un email de confirmation
            // - etc.

        } catch (\Exception $e) {
            Log::error('Erreur traitement paiement complété', [
                'error' => $e->getMessage(),
                'token' => $token
            ]);
        }
    }

    /**
     * Traiter un paiement annulé (logique métier)
     */
    private function processCancelledPayment(string $token, array $customData): void
    {
        try {
            Log::info('IPN Paydunya - Traitement paiement annulé', [
                'token' => $token,
                'custom_data' => $customData
            ]);

            // TODO: Implémenter selon vos besoins

        } catch (\Exception $e) {
            Log::error('Erreur traitement paiement annulé', [
                'error' => $e->getMessage(),
                'token' => $token
            ]);
        }
    }

    /**
     * Traiter un paiement échoué (logique métier)
     */
    private function processFailedPayment(string $token, string $reason, array $customData): void
    {
        try {
            Log::info('IPN Paydunya - Traitement paiement échoué', [
                'token' => $token,
                'reason' => $reason,
                'custom_data' => $customData
            ]);

            // TODO: Implémenter selon vos besoins

        } catch (\Exception $e) {
            Log::error('Erreur traitement paiement échoué', [
                'error' => $e->getMessage(),
                'token' => $token
            ]);
        }
    }

    /**
     * Vérifier le statut d'un paiement
     */
    public function checkStatus(Request $request): JsonResponse
    {
        try {
            $token = $request->input('token');
            
            Log::info('Vérification statut paiement', ['token' => $token]);
            
            if (!$token) {
                return response()->json([
                    'success' => false,
                    'message' => 'Token manquant'
                ], 400);
            }

            // Utiliser le service Paydunya pour vérifier le statut
                    $paydunyaService = new PaydunyaOfficialService();
        $statusResult = $paydunyaService->checkPaymentStatus($token);
            
            Log::info('Résultat vérification statut', [
                'token' => $token,
                'result' => $statusResult
            ]);

            if ($statusResult['success']) {
                return response()->json([
                    'success' => true,
                    'data' => $statusResult['data']
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => $statusResult['message'] ?? 'Erreur lors de la vérification du statut'
                ], 500);
            }

        } catch (\Exception $e) {
            Log::error('Erreur vérification statut', [
                'error' => $e->getMessage(),
                'token' => $token ?? null
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la vérification du statut'
            ], 500);
        }
    }

    /**
     * Gérer le paiement SOFTPAY Orange Money CI
     */
    public function handlePayment(Request $request): JsonResponse
    {
        Log::info('PaymentController - handlePayment appelé', [
            'request_data' => $request->all()
        ]);

        $validatedData = $request->validate([
            'phone_number' => 'required|string|min:10',
            'otp' => 'required|string|min:4',
            'payment_token' => 'required|string',
            'customer_name' => 'required|string',
            'customer_email' => 'required|email',
        ]);

        $payload = [
            "orange_money_ci_customer_fullname" => $validatedData['customer_name'],
            "orange_money_ci_email" => $validatedData['customer_email'],
            "orange_money_ci_phone_number" => $validatedData['phone_number'],
            "orange_money_ci_otp" => $validatedData['otp'],
            "payment_token" => $validatedData['payment_token']
        ];

        try {
            Log::info('PaymentController - Tentative d\'appel Paydunya SOFTPAY', [
                'payload' => $payload,
                'headers' => [
                    'PAYDUNYA-MASTER-KEY' => config('paydunya.master_key'),
                    'PAYDUNYA-PRIVATE-KEY' => config('paydunya.private_key'),
                    'PAYDUNYA-TOKEN' => config('paydunya.token'),
                ]
            ]);

            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'PAYDUNYA-MASTER-KEY' => config('paydunya.master_key'),
                'PAYDUNYA-PRIVATE-KEY' => config('paydunya.private_key'),
                'PAYDUNYA-TOKEN' => config('paydunya.token'),
            ])->post('https://app.paydunya.com/api/v1/softpay/orange-money-ci', $payload);

            Log::info('PaymentController - Réponse Paydunya reçue', [
                'status' => $response->status(),
                'body' => $response->body()
            ]);

            $paydunyaResponse = $response->json();

            if ($response->successful() && isset($paydunyaResponse['success']) && $paydunyaResponse['success'] === true) {
                return response()->json([
                    'success' => true,
                    'message' => $paydunyaResponse['message'] ?? 'Paiement effectué avec succès.'
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => $paydunyaResponse['message'] ?? 'Une erreur est survenue lors du paiement.'
            ], 400);

        } catch (\Exception $e) {
            Log::error('Paydunya SOFTPAY Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur de communication avec le service de paiement.'
            ], 500);
        }
    }

    /**
     * Gérer le paiement SOFTPAY Wave CI
     */
    public function handleWaveCIPayment(Request $request): JsonResponse
    {
        Log::info('PaymentController - handleWaveCIPayment appelé', [
            'request_data' => $request->all()
        ]);

        $validatedData = $request->validate([
            'phone_number' => 'required|string|min:9',
            'payment_token' => 'required|string',
            'customer_name' => 'required|string',
            'customer_email' => 'required|email',
        ]);

        // Format exact selon la documentation Paydunya Wave CI
        $payload = [
            "wave_ci_fullName" => $validatedData['customer_name'],
            "wave_ci_email" => $validatedData['customer_email'],
            "wave_ci_phone" => $validatedData['phone_number'],
            "wave_ci_payment_token" => $validatedData['payment_token']
        ];

        try {
            Log::info('PaymentController - Tentative d\'appel Paydunya SOFTPAY Wave CI', [
                'endpoint' => 'https://app.paydunya.com/api/v1/softpay/wave-ci',
                'payload' => $payload,
                'headers' => [
                    'PAYDUNYA-MASTER-KEY' => substr(config('paydunya.master_key'), 0, 10) . '...',
                    'PAYDUNYA-PRIVATE-KEY' => substr(config('paydunya.private_key'), 0, 10) . '...',
                    'PAYDUNYA-TOKEN' => substr(config('paydunya.token'), 0, 10) . '...'
                ]
            ]);

            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'PAYDUNYA-MASTER-KEY' => config('paydunya.master_key'),
                'PAYDUNYA-PRIVATE-KEY' => config('paydunya.private_key'),
                'PAYDUNYA-TOKEN' => config('paydunya.token'),
            ])->post('https://app.paydunya.com/api/v1/softpay/wave-ci', $payload);

            Log::info('PaymentController - Réponse Paydunya Wave CI reçue', [
                'status' => $response->status(),
                'body' => $response->body()
            ]);

            $paydunyaResponse = $response->json();

            // Vérifier si Paydunya a retourné une URL de redirection (succès)
            if ($response->successful() && isset($paydunyaResponse['url'])) {
                return response()->json([
                    'success' => true,
                    'redirect_url' => $paydunyaResponse['url'],
                    'message' => $paydunyaResponse['message'] ?? 'Redirection vers Wave CI...',
                    'fees' => $paydunyaResponse['fees'] ?? null,
                    'currency' => $paydunyaResponse['currency'] ?? null
                ]);
            }

            // En cas d'échec ou si l'URL n'est pas présente
            return response()->json([
                'success' => false,
                'message' => $paydunyaResponse['message'] ?? 'Une erreur est survenue lors de l\'initiation du paiement Wave CI.',
                'paydunya_response' => $paydunyaResponse
            ]);

        } catch (\Exception $e) {
            Log::error('Paydunya Wave CI SOFTPAY Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur de communication avec le service de paiement Wave CI.'
            ], 500);
        }
    }

    /**
     * Gérer le paiement SOFTPAY Moov CI
     */
    public function handleMoovCIPayment(Request $request): JsonResponse
    {
        Log::info('PaymentController - handleMoovCIPayment appelé', [
            'request_data' => $request->all()
        ]);

        $validatedData = $request->validate([
            'phone_number' => 'required|string|min:9',
            'payment_token' => 'required|string',
            'customer_name' => 'required|string',
            'customer_email' => 'required|email',
        ]);

        // Format exact selon la documentation Paydunya Moov CI
        $payload = [
            "moov_ci_customer_fullname" => $validatedData['customer_name'],
            "moov_ci_email" => $validatedData['customer_email'],
            "moov_ci_phone_number" => $validatedData['phone_number'],
            "payment_token" => $validatedData['payment_token']
        ];

        try {
            Log::info('PaymentController - Tentative d\'appel Paydunya SOFTPAY Moov CI', [
                'endpoint' => 'https://app.paydunya.com/api/v1/softpay/moov-ci',
                'payload' => $payload,
                'headers' => [
                    'PAYDUNYA-MASTER-KEY' => substr(config('paydunya.master_key'), 0, 10) . '...',
                    'PAYDUNYA-PRIVATE-KEY' => substr(config('paydunya.private_key'), 0, 10) . '...',
                    'PAYDUNYA-TOKEN' => substr(config('paydunya.token'), 0, 10) . '...'
                ]
            ]);

            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'PAYDUNYA-MASTER-KEY' => config('paydunya.master_key'),
                'PAYDUNYA-PRIVATE-KEY' => config('paydunya.private_key'),
                'PAYDUNYA-TOKEN' => config('paydunya.token'),
            ])->post('https://app.paydunya.com/api/v1/softpay/moov-ci', $payload);

            Log::info('PaymentController - Réponse Paydunya Moov CI reçue', [
                'status' => $response->status(),
                'body' => $response->body()
            ]);

            $paydunyaResponse = $response->json();

            // Moov CI finalise directement le paiement (pas de redirection)
            if ($response->successful() && isset($paydunyaResponse['success']) && $paydunyaResponse['success'] === true) {
                return response()->json([
                    'success' => true,
                    'message' => $paydunyaResponse['message'] ?? 'Paiement Moov CI effectué avec succès.',
                    'fees' => $paydunyaResponse['fees'] ?? null,
                    'currency' => $paydunyaResponse['currency'] ?? null
                ]);
            }

            // En cas d'échec
            return response()->json([
                'success' => false,
                'message' => $paydunyaResponse['message'] ?? 'Une erreur est survenue lors du paiement Moov CI.',
                'paydunya_response' => $paydunyaResponse
            ]);

        } catch (\Exception $e) {
            Log::error('Paydunya Moov CI SOFTPAY Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur de communication avec le service de paiement Moov CI.'
            ], 500);
        }
    }

    /**
     * Gérer le paiement SOFTPAY Orange Money Burkina Faso
     */
    public function handleOrangeMoneyBurkinaPayment(Request $request): JsonResponse
    {
        Log::info('PaymentController - handleOrangeMoneyBurkinaPayment appelé', [
            'request_data' => $request->all()
        ]);

        $validatedData = $request->validate([
            'phone_number' => 'required|string|min:8',
            'payment_token' => 'required|string',
            'customer_name' => 'required|string',
            'customer_email' => 'required|email',
            'otp_code' => 'required|string|min:5|max:6',
        ]);

        // Format exact selon la documentation Paydunya Orange Money Burkina
        $payload = [
            "name_bf" => $validatedData['customer_name'],
            "email_bf" => $validatedData['customer_email'],
            "phone_bf" => $validatedData['phone_number'],
            "otp_code" => $validatedData['otp_code'],
            "payment_token" => $validatedData['payment_token']
        ];

        try {
            Log::info('PaymentController - Tentative d\'appel Paydunya SOFTPAY Orange Money Burkina', [
                'endpoint' => 'https://app.paydunya.com/api/v1/softpay/orange-money-burkina',
                'payload' => $payload,
                'headers' => [
                    'PAYDUNYA-MASTER-KEY' => substr(config('paydunya.master_key'), 0, 10) . '...',
                    'PAYDUNYA-PRIVATE-KEY' => substr(config('paydunya.private_key'), 0, 10) . '...',
                    'PAYDUNYA-TOKEN' => substr(config('paydunya.token'), 0, 10) . '...'
                ]
            ]);

            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'PAYDUNYA-MASTER-KEY' => config('paydunya.master_key'),
                'PAYDUNYA-PRIVATE-KEY' => config('paydunya.private_key'),
                'PAYDUNYA-TOKEN' => config('paydunya.token'),
            ])->post('https://app.paydunya.com/api/v1/softpay/orange-money-burkina', $payload);

            Log::info('PaymentController - Réponse Paydunya Orange Money Burkina reçue', [
                'status' => $response->status(),
                'body' => $response->body()
            ]);

            $paydunyaResponse = $response->json();

            // Orange Money Burkina finalise directement le paiement (pas de redirection)
            if ($response->successful() && isset($paydunyaResponse['success']) && $paydunyaResponse['success'] === true) {
                return response()->json([
                    'success' => true,
                    'message' => $paydunyaResponse['message'] ?? 'Paiement Orange Money Burkina effectué avec succès.',
                    'fees' => $paydunyaResponse['fees'] ?? null,
                    'currency' => $paydunyaResponse['currency'] ?? null
                ]);
            }

            // En cas d'échec
            return response()->json([
                'success' => false,
                'message' => $paydunyaResponse['message'] ?? 'Une erreur est survenue lors du paiement Orange Money Burkina.',
                'paydunya_response' => $paydunyaResponse
            ]);

        } catch (\Exception $e) {
            Log::error('Paydunya Orange Money Burkina SOFTPAY Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur de communication avec le service de paiement Orange Money Burkina.'
            ], 500);
        }
    }

    /**
     * Gérer le paiement SOFTPAY Orange Money Sénégal (QR CODE)
     */
    public function handleOrangeMoneySenegalQRPayment(Request $request): JsonResponse
    {
        Log::info('PaymentController - handleOrangeMoneySenegalQRPayment appelé', [
            'request_data' => $request->all()
        ]);

        $validatedData = $request->validate([
            'phone_number' => 'required|string|min:8',
            'payment_token' => 'required|string',
            'customer_name' => 'required|string',
            'customer_email' => 'required|email',
        ]);

        // Format exact selon la documentation Paydunya Orange Money Sénégal QR CODE
        $payload = [
            "customer_name" => $validatedData['customer_name'],
            "customer_email" => $validatedData['customer_email'],
            "phone_number" => $validatedData['phone_number'],
            "invoice_token" => $validatedData['payment_token'],
            "api_type" => "QRCODE"
        ];

        try {
            Log::info('PaymentController - Tentative d\'appel Paydunya SOFTPAY Orange Money Sénégal QR', [
                'endpoint' => 'https://app.paydunya.com/api/v1/softpay/new-orange-money-senegal',
                'payload' => $payload,
                'headers' => [
                    'PAYDUNYA-MASTER-KEY' => substr(config('paydunya.master_key'), 0, 10) . '...',
                    'PAYDUNYA-PRIVATE-KEY' => substr(config('paydunya.private_key'), 0, 10) . '...',
                    'PAYDUNYA-TOKEN' => substr(config('paydunya.token'), 0, 10) . '...'
                ]
            ]);

            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'PAYDUNYA-MASTER-KEY' => config('paydunya.master_key'),
                'PAYDUNYA-PRIVATE-KEY' => config('paydunya.private_key'),
                'PAYDUNYA-TOKEN' => config('paydunya.token'),
            ])->post('https://app.paydunya.com/api/v1/softpay/new-orange-money-senegal', $payload);

            Log::info('PaymentController - Réponse Paydunya Orange Money Sénégal QR reçue', [
                'status' => $response->status(),
                'body' => $response->body()
            ]);

            $paydunyaResponse = $response->json();

            // Orange Money Sénégal QR retourne une URL de redirection
            if ($response->successful() && isset($paydunyaResponse['url'])) {
                return response()->json([
                    'success' => true,
                    'redirect_url' => $paydunyaResponse['url'],
                    'om_url' => $paydunyaResponse['other_url']['om_url'] ?? null,
                    'maxit_url' => $paydunyaResponse['other_url']['maxit_url'] ?? null,
                    'message' => $paydunyaResponse['message'] ?? 'Redirection vers Orange Money Sénégal...',
                    'fees' => $paydunyaResponse['fees'] ?? null,
                    'currency' => $paydunyaResponse['currency'] ?? null
                ]);
            }

            // En cas d'échec
            return response()->json([
                'success' => false,
                'message' => $paydunyaResponse['message'] ?? 'Une erreur est survenue lors de l\'initiation du paiement Orange Money Sénégal QR.',
                'paydunya_response' => $paydunyaResponse
            ]);

        } catch (\Exception $e) {
            Log::error('Paydunya Orange Money Sénégal QR SOFTPAY Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur de communication avec le service de paiement Orange Money Sénégal QR.'
            ], 500);
        }
    }

    /**
     * Gérer le paiement SOFTPAY Orange Money Sénégal (OTP CODE)
     */
    public function handleOrangeMoneySenegalOTPPayment(Request $request): JsonResponse
    {
        Log::info('PaymentController - handleOrangeMoneySenegalOTPPayment appelé', [
            'request_data' => $request->all()
        ]);

        $validatedData = $request->validate([
            'phone_number' => 'required|string|min:8',
            'payment_token' => 'required|string',
            'customer_name' => 'required|string',
            'customer_email' => 'required|email',
            'authorization_code' => 'required|string|min:6|max:6',
        ]);

        // Format exact selon la documentation Paydunya Orange Money Sénégal OTP CODE
        $payload = [
            "customer_name" => $validatedData['customer_name'],
            "customer_email" => $validatedData['customer_email'],
            "phone_number" => $validatedData['phone_number'],
            "authorization_code" => $validatedData['authorization_code'],
            "invoice_token" => $validatedData['payment_token'],
            "api_type" => "OTPCODE"
        ];

        try {
            Log::info('PaymentController - Tentative d\'appel Paydunya SOFTPAY Orange Money Sénégal OTP', [
                'endpoint' => 'https://app.paydunya.com/api/v1/softpay/new-orange-money-senegal',
                'payload' => $payload,
                'headers' => [
                    'PAYDUNYA-MASTER-KEY' => substr(config('paydunya.master_key'), 0, 10) . '...',
                    'PAYDUNYA-PRIVATE-KEY' => substr(config('paydunya.private_key'), 0, 10) . '...',
                    'PAYDUNYA-TOKEN' => substr(config('paydunya.token'), 0, 10) . '...'
                ]
            ]);

            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'PAYDUNYA-MASTER-KEY' => config('paydunya.master_key'),
                'PAYDUNYA-PRIVATE-KEY' => config('paydunya.private_key'),
                'PAYDUNYA-TOKEN' => config('paydunya.token'),
            ])->post('https://app.paydunya.com/api/v1/softpay/new-orange-money-senegal', $payload);

            Log::info('PaymentController - Réponse Paydunya Orange Money Sénégal OTP reçue', [
                'status' => $response->status(),
                'body' => $response->body()
            ]);

            $paydunyaResponse = $response->json();

            // Orange Money Sénégal OTP finalise directement le paiement
            if ($response->successful() && isset($paydunyaResponse['success']) && $paydunyaResponse['success'] === true) {
                return response()->json([
                    'success' => true,
                    'message' => $paydunyaResponse['message'] ?? 'Paiement Orange Money Sénégal OTP effectué avec succès.',
                    'fees' => $paydunyaResponse['fees'] ?? null,
                    'currency' => $paydunyaResponse['currency'] ?? null
                ]);
            }

            // En cas d'échec
            return response()->json([
                'success' => false,
                'message' => $paydunyaResponse['message'] ?? 'Une erreur est survenue lors du paiement Orange Money Sénégal OTP.',
                'paydunya_response' => $paydunyaResponse
            ]);

        } catch (\Exception $e) {
            Log::error('Paydunya Orange Money Sénégal OTP SOFTPAY Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur de communication avec le service de paiement Orange Money Sénégal OTP.'
            ], 500);
        }
    }

    /**
     * Gérer le paiement SOFTPAY Free Money Sénégal
     */
    public function handleFreeMoneySenegalPayment(Request $request): JsonResponse
    {
        Log::info('PaymentController - handleFreeMoneySenegalPayment appelé', [
            'request_data' => $request->all()
        ]);

        $validatedData = $request->validate([
            'phone_number' => 'required|string|min:8',
            'payment_token' => 'required|string',
            'customer_name' => 'required|string',
            'customer_email' => 'required|email',
        ]);

        // Format exact selon la documentation Paydunya Free Money Sénégal
        $payload = [
            "customer_name" => $validatedData['customer_name'],
            "customer_email" => $validatedData['customer_email'],
            "phone_number" => $validatedData['phone_number'],
            "payment_token" => $validatedData['payment_token']
        ];

        try {
            Log::info('PaymentController - Tentative d\'appel Paydunya SOFTPAY Free Money Sénégal', [
                'endpoint' => 'https://app.paydunya.com/api/v1/softpay/free-money-senegal',
                'payload' => $payload,
                'headers' => [
                    'PAYDUNYA-MASTER-KEY' => substr(config('paydunya.master_key'), 0, 10) . '...',
                    'PAYDUNYA-PRIVATE-KEY' => substr(config('paydunya.private_key'), 0, 10) . '...',
                    'PAYDUNYA-TOKEN' => substr(config('paydunya.token'), 0, 10) . '...'
                ]
            ]);

            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'PAYDUNYA-MASTER-KEY' => config('paydunya.master_key'),
                'PAYDUNYA-PRIVATE-KEY' => config('paydunya.private_key'),
                'PAYDUNYA-TOKEN' => config('paydunya.token'),
            ])->post('https://app.paydunya.com/api/v1/softpay/free-money-senegal', $payload);

            Log::info('PaymentController - Réponse Paydunya Free Money Sénégal reçue', [
                'status' => $response->status(),
                'body' => $response->body()
            ]);

            $paydunyaResponse = $response->json();

            // Free Money Sénégal finalise directement le paiement
            if ($response->successful() && isset($paydunyaResponse['success']) && $paydunyaResponse['success'] === true) {
                return response()->json([
                    'success' => true,
                    'message' => $paydunyaResponse['message'] ?? 'Paiement Free Money Sénégal effectué avec succès.',
                    'fees' => $paydunyaResponse['fees'] ?? null,
                    'currency' => $paydunyaResponse['currency'] ?? null,
                    'data' => $paydunyaResponse['data'] ?? null
                ]);
            }

            // En cas d'échec
            return response()->json([
                'success' => false,
                'message' => $paydunyaResponse['message'] ?? 'Une erreur est survenue lors du paiement Free Money Sénégal.',
                'paydunya_response' => $paydunyaResponse
            ]);

        } catch (\Exception $e) {
            Log::error('Paydunya Free Money Sénégal SOFTPAY Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur de communication avec le service de paiement Free Money Sénégal.'
            ], 500);
        }
    }

    /**
     * Gérer le paiement SOFTPAY Expresso Sénégal
     */
    public function handleExpressoSenegalPayment(Request $request): JsonResponse
    {
        Log::info('PaymentController - handleExpressoSenegalPayment appelé', [
            'request_data' => $request->all()
        ]);

        $validatedData = $request->validate([
            'phone_number' => 'required|string|min:8',
            'payment_token' => 'required|string',
            'customer_name' => 'required|string',
            'customer_email' => 'required|email',
        ]);

        // Format exact selon la documentation Paydunya Expresso Sénégal
        $payload = [
            "expresso_sn_fullName" => $validatedData['customer_name'],
            "expresso_sn_email" => $validatedData['customer_email'],
            "expresso_sn_phone" => $validatedData['phone_number'],
            "payment_token" => $validatedData['payment_token']
        ];

        try {
            Log::info('PaymentController - Tentative d\'appel Paydunya SOFTPAY Expresso Sénégal', [
                'endpoint' => 'https://app.paydunya.com/api/v1/softpay/expresso-senegal',
                'payload' => $payload,
                'headers' => [
                    'PAYDUNYA-MASTER-KEY' => substr(config('paydunya.master_key'), 0, 10) . '...',
                    'PAYDUNYA-PRIVATE-KEY' => substr(config('paydunya.private_key'), 0, 10) . '...',
                    'PAYDUNYA-TOKEN' => substr(config('paydunya.token'), 0, 10) . '...'
                ]
            ]);

            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'PAYDUNYA-MASTER-KEY' => config('paydunya.master_key'),
                'PAYDUNYA-PRIVATE-KEY' => config('paydunya.private_key'),
                'PAYDUNYA-TOKEN' => config('paydunya.token'),
            ])->post('https://app.paydunya.com/api/v1/softpay/expresso-senegal', $payload);

            Log::info('PaymentController - Réponse Paydunya Expresso Sénégal reçue', [
                'status' => $response->status(),
                'body' => $response->body()
            ]);

            $paydunyaResponse = $response->json();

            // Expresso Sénégal finalise directement le paiement
            if ($response->successful() && isset($paydunyaResponse['success']) && $paydunyaResponse['success'] === true) {
                return response()->json([
                    'success' => true,
                    'message' => $paydunyaResponse['message'] ?? 'Paiement Expresso Sénégal effectué avec succès.',
                    'fees' => $paydunyaResponse['fees'] ?? null,
                    'currency' => $paydunyaResponse['currency'] ?? null
                ]);
            }

            // En cas d'échec
            return response()->json([
                'success' => false,
                'message' => $paydunyaResponse['message'] ?? 'Une erreur est survenue lors du paiement Expresso Sénégal.',
                'paydunya_response' => $paydunyaResponse
            ]);

        } catch (\Exception $e) {
            Log::error('Paydunya Expresso Sénégal SOFTPAY Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur de communication avec le service de paiement Expresso Sénégal.'
            ], 500);
        }
    }

    /**
     * Vérifier le statut d'un paiement
     */
    public function checkPaymentStatus(Request $request)
    {
        Log::info('PaymentController - checkPaymentStatus appelé', ['request_data' => $request->all()]);

        try {
            $paymentId = $request->input('payment_id');
            $paymentMethod = $request->input('payment_method');
            $phoneNumber = $request->input('phone_number');

            if (!$paymentId) {
                return response()->json([
                    'success' => false,
                    'message' => 'Payment ID manquant'
                ], 400);
            }

            // Vérifier le statut selon la méthode de paiement
            switch ($paymentMethod) {
                case 'mtn-ci':
                    return $this->checkMTNCIStatus($paymentId, $phoneNumber);
                case 'orange-money-ci':
                    return $this->checkOrangeMoneyStatus($paymentId, $phoneNumber);
                case 'wave-ci':
                    return $this->checkWaveCIStatus($paymentId, $phoneNumber);
                default:
                    return $this->checkGenericStatus($paymentId, $paymentMethod);
            }

        } catch (\Exception $e) {
            Log::error('PaymentController - Exception checkPaymentStatus', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la vérification du statut: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Vérifier le statut MTN CI
     */
    private function checkMTNCIStatus($paymentId, $phoneNumber)
    {
        try {
            Log::info('PaymentController - Vérification statut MTN CI', [
                'payment_id' => $paymentId,
                'phone_number' => $phoneNumber
            ]);

            // Appeler l'API Paydunya pour vérifier le statut de la facture
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'PAYDUNYA-MASTER-KEY' => config('paydunya.master_key'),
                'PAYDUNYA-PRIVATE-KEY' => config('paydunya.private_key'),
                'PAYDUNYA-TOKEN' => config('paydunya.token'),
            ])->get("https://app.paydunya.com/api/v1/checkout-invoice/confirm/{$paymentId}");

            Log::info('PaymentController - Réponse vérification MTN CI', [
                'status' => $response->status(),
                'body' => $response->body()
            ]);

            if ($response->successful()) {
                $paydunyaResponse = $response->json();
                
                Log::info('PaymentController - Analyse réponse Paydunya', [
                    'paydunya_status' => $paydunyaResponse['status'] ?? 'unknown',
                    'response_code' => $paydunyaResponse['response_code'] ?? 'unknown',
                    'response_text' => $paydunyaResponse['response_text'] ?? 'unknown'
                ]);
                
                // Vérifier le statut selon la réponse Paydunya
                if (isset($paydunyaResponse['status'])) {
                    switch ($paydunyaResponse['status']) {
                        case 'completed':
                        case 'success':
                            return response()->json([
                                'success' => true,
                                'status' => 'completed',
                                'message' => 'Paiement MTN CI confirmé avec succès'
                            ]);
                        case 'pending':
                        case 'processing':
                            return response()->json([
                                'success' => true,
                                'status' => 'pending',
                                'message' => 'Paiement MTN CI en attente de confirmation'
                            ]);
                        case 'failed':
                        case 'cancelled':
                            return response()->json([
                                'success' => true,
                                'status' => 'failed',
                                'message' => 'Paiement MTN CI échoué ou annulé'
                            ]);
                        default:
                            return response()->json([
                                'success' => true,
                                'status' => 'pending',
                                'message' => 'Paiement MTN CI en cours de traitement'
                            ]);
                    }
                } else {
                    return response()->json([
                        'success' => true,
                        'status' => 'pending',
                        'message' => 'Paiement MTN CI en cours de traitement'
                    ]);
                }
            } else {
                Log::warning('PaymentController - Échec vérification MTN CI', [
                    'status' => $response->status(),
                    'response' => $response->body()
                ]);
                
                return response()->json([
                    'success' => true,
                    'status' => 'pending',
                    'message' => 'Paiement MTN CI en attente de confirmation'
                ]);
            }

        } catch (\Exception $e) {
            Log::error('PaymentController - Exception checkMTNCIStatus', [
                'error' => $e->getMessage(),
                'payment_id' => $paymentId
            ]);

            return response()->json([
                'success' => false,
                'status' => 'error',
                'message' => 'Erreur lors de la vérification MTN CI'
            ]);
        }
    }

    /**
     * Vérifier le statut Orange Money
     */
    private function checkOrangeMoneyStatus($paymentId, $phoneNumber)
    {
        try {
            Log::info('PaymentController - Vérification statut Orange Money', [
                'payment_id' => $paymentId,
                'phone_number' => $phoneNumber
            ]);

            // Appeler l'API Paydunya pour vérifier le statut de la facture
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'PAYDUNYA-MASTER-KEY' => config('paydunya.master_key'),
                'PAYDUNYA-PRIVATE-KEY' => config('paydunya.private_key'),
                'PAYDUNYA-TOKEN' => config('paydunya.token'),
            ])->get("https://app.paydunya.com/api/v1/checkout-invoice/confirm/{$paymentId}");

            Log::info('PaymentController - Réponse vérification Orange Money', [
                'status' => $response->status(),
                'body' => $response->body()
            ]);

            if ($response->successful()) {
                $paydunyaResponse = $response->json();
                
                Log::info('PaymentController - Analyse réponse Paydunya Orange Money', [
                    'paydunya_status' => $paydunyaResponse['status'] ?? 'unknown',
                    'response_code' => $paydunyaResponse['response_code'] ?? 'unknown',
                    'response_text' => $paydunyaResponse['response_text'] ?? 'unknown'
                ]);
                
                // Vérifier le statut selon la réponse Paydunya
                if (isset($paydunyaResponse['status'])) {
                    switch ($paydunyaResponse['status']) {
                        case 'completed':
                        case 'success':
                            return response()->json([
                                'success' => true,
                                'status' => 'completed',
                                'message' => 'Paiement Orange Money confirmé avec succès'
                            ]);
                        case 'pending':
                        case 'processing':
                            return response()->json([
                                'success' => true,
                                'status' => 'pending',
                                'message' => 'Paiement Orange Money en attente de confirmation'
                            ]);
                        case 'failed':
                        case 'cancelled':
                            return response()->json([
                                'success' => true,
                                'status' => 'failed',
                                'message' => 'Paiement Orange Money échoué ou annulé'
                            ]);
                        default:
                            return response()->json([
                                'success' => true,
                                'status' => 'pending',
                                'message' => 'Paiement Orange Money en cours de traitement'
                            ]);
                    }
                } else {
                    return response()->json([
                        'success' => true,
                        'status' => 'pending',
                        'message' => 'Paiement Orange Money en cours de traitement'
                    ]);
                }
            } else {
                Log::warning('PaymentController - Échec vérification Orange Money', [
                    'status' => $response->status(),
                    'response' => $response->body()
                ]);
                
                return response()->json([
                    'success' => true,
                    'status' => 'pending',
                    'message' => 'Paiement Orange Money en attente de confirmation'
                ]);
            }

        } catch (\Exception $e) {
            Log::error('PaymentController - Exception checkOrangeMoneyStatus', [
                'error' => $e->getMessage(),
                'payment_id' => $paymentId
            ]);

            return response()->json([
                'success' => false,
                'status' => 'error',
                'message' => 'Erreur lors de la vérification Orange Money'
            ]);
        }
    }

    /**
     * Vérifier le statut Wave CI
     */
    private function checkWaveCIStatus($paymentId, $phoneNumber)
    {
        try {
            Log::info('PaymentController - Vérification statut Wave CI', [
                'payment_id' => $paymentId,
                'phone_number' => $phoneNumber
            ]);

            // Appeler l'API Paydunya pour vérifier le statut de la facture
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'PAYDUNYA-MASTER-KEY' => config('paydunya.master_key'),
                'PAYDUNYA-PRIVATE-KEY' => config('paydunya.private_key'),
                'PAYDUNYA-TOKEN' => config('paydunya.token'),
            ])->get("https://app.paydunya.com/api/v1/checkout-invoice/confirm/{$paymentId}");

            Log::info('PaymentController - Réponse vérification Wave CI', [
                'status' => $response->status(),
                'body' => $response->body()
            ]);

            if ($response->successful()) {
                $paydunyaResponse = $response->json();
                
                Log::info('PaymentController - Analyse réponse Paydunya Wave CI', [
                    'paydunya_status' => $paydunyaResponse['status'] ?? 'unknown',
                    'response_code' => $paydunyaResponse['response_code'] ?? 'unknown',
                    'response_text' => $paydunyaResponse['response_text'] ?? 'unknown'
                ]);
                
                // Vérifier le statut selon la réponse Paydunya
                if (isset($paydunyaResponse['status'])) {
                    switch ($paydunyaResponse['status']) {
                        case 'completed':
                        case 'success':
                            return response()->json([
                                'success' => true,
                                'status' => 'completed',
                                'message' => 'Paiement Wave CI confirmé avec succès'
                            ]);
                        case 'pending':
                        case 'processing':
                            return response()->json([
                                'success' => true,
                                'status' => 'pending',
                                'message' => 'Paiement Wave CI en attente de confirmation'
                            ]);
                        case 'failed':
                        case 'cancelled':
                            return response()->json([
                                'success' => true,
                                'status' => 'failed',
                                'message' => 'Paiement Wave CI échoué ou annulé'
                            ]);
                        default:
                            return response()->json([
                                'success' => true,
                                'status' => 'pending',
                                'message' => 'Paiement Wave CI en cours de traitement'
                            ]);
                    }
                } else {
                    return response()->json([
                        'success' => true,
                        'status' => 'pending',
                        'message' => 'Paiement Wave CI en cours de traitement'
                    ]);
                }
            } else {
                Log::warning('PaymentController - Échec vérification Wave CI', [
                    'status' => $response->status(),
                    'response' => $response->body()
                ]);
                
                return response()->json([
                    'success' => true,
                    'status' => 'pending',
                    'message' => 'Paiement Wave CI en attente de confirmation'
                ]);
            }

        } catch (\Exception $e) {
            Log::error('PaymentController - Exception checkWaveCIStatus', [
                'error' => $e->getMessage(),
                'payment_id' => $paymentId
            ]);

            return response()->json([
                'success' => false,
                'status' => 'error',
                'message' => 'Erreur lors de la vérification Wave CI'
            ]);
        }
    }

    /**
     * Vérifier le statut générique
     */
    private function checkGenericStatus($paymentId, $paymentMethod)
    {
        try {
            Log::info('PaymentController - Vérification statut générique', [
                'payment_id' => $paymentId,
                'payment_method' => $paymentMethod
            ]);

            // Appeler l'API Paydunya pour vérifier le statut de la facture
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'PAYDUNYA-MASTER-KEY' => config('paydunya.master_key'),
                'PAYDUNYA-PRIVATE-KEY' => config('paydunya.private_key'),
                'PAYDUNYA-TOKEN' => config('paydunya.token'),
            ])->get("https://app.paydunya.com/api/v1/checkout-invoice/confirm/{$paymentId}");

            Log::info('PaymentController - Réponse vérification générique', [
                'status' => $response->status(),
                'body' => $response->body()
            ]);

            if ($response->successful()) {
                $paydunyaResponse = $response->json();
                
                Log::info('PaymentController - Analyse réponse Paydunya générique', [
                    'paydunya_status' => $paydunyaResponse['status'] ?? 'unknown',
                    'response_code' => $paydunyaResponse['response_code'] ?? 'unknown',
                    'response_text' => $paydunyaResponse['response_text'] ?? 'unknown'
                ]);
                
                // Vérifier le statut selon la réponse Paydunya
                if (isset($paydunyaResponse['status'])) {
                    switch ($paydunyaResponse['status']) {
                        case 'completed':
                        case 'success':
                            return response()->json([
                                'success' => true,
                                'status' => 'completed',
                                'message' => 'Paiement confirmé avec succès'
                            ]);
                        case 'pending':
                        case 'processing':
                            return response()->json([
                                'success' => true,
                                'status' => 'pending',
                                'message' => 'Paiement en attente de confirmation'
                            ]);
                        case 'failed':
                        case 'cancelled':
                            return response()->json([
                                'success' => true,
                                'status' => 'failed',
                                'message' => 'Paiement échoué ou annulé'
                            ]);
                        default:
                            return response()->json([
                                'success' => true,
                                'status' => 'pending',
                                'message' => 'Paiement en cours de traitement'
                            ]);
                    }
                } else {
                    return response()->json([
                        'success' => true,
                        'status' => 'pending',
                        'message' => 'Paiement en cours de traitement'
                    ]);
                }
            } else {
                Log::warning('PaymentController - Échec vérification générique', [
                    'status' => $response->status(),
                    'response' => $response->body()
                ]);
                
                return response()->json([
                    'success' => true,
                    'status' => 'pending',
                    'message' => 'Paiement en attente de confirmation'
                ]);
            }

        } catch (\Exception $e) {
            Log::error('PaymentController - Exception checkGenericStatus', [
                'error' => $e->getMessage(),
                'payment_id' => $paymentId
            ]);

            return response()->json([
                'success' => false,
                'status' => 'error',
                'message' => 'Erreur lors de la vérification du paiement'
            ]);
        }
    }



} 