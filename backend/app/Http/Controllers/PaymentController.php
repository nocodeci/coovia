<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Services\PaydunyaOfficialService;

class PaymentController extends Controller
{
    /**
     * Initialiser un paiement Paydunya
     */
    public function initializePayment(Request $request): JsonResponse
    {
        try {
            Log::info('Initialisation paiement', $request->all());

            $data = $request->validate([
                'storeId' => 'required|string',
                'productId' => 'required|string',
                'productName' => 'required|string',
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
                'payment_url' => $paymentResult['url'] ?? null,
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
                'payment_url' => $paymentResult['url'],
                'token' => $paymentResult['token'] ?? null,
                'fees' => $paymentResult['fees'],
                'currency' => $paymentResult['currency']
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
                'payment_url' => $paymentResult['url'],
                'token' => $paymentResult['token'] ?? null,
                'fees' => $paymentResult['fees'],
                'currency' => $paymentResult['currency']
            ];
        } else {
            return [
                'success' => false,
                'message' => $paymentResult['message'] ?? 'Erreur lors de l\'initialisation du paiement Moov CI'
            ];
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
} 