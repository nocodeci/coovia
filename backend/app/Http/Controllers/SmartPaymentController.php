<?php

namespace App\Http\Controllers;

use App\Services\SmartPaymentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class SmartPaymentController extends Controller
{
    protected $smartPaymentService;

    public function __construct(SmartPaymentService $smartPaymentService)
    {
        $this->smartPaymentService = $smartPaymentService;
    }

    /**
     * Initialiser un paiement intelligent avec fallback
     */
    public function initializePayment(Request $request)
    {
        try {
            $request->validate([
                'amount' => 'required|numeric|min:1',
                'currency' => 'required|string',
                'phone_number' => 'required|string',
                'country' => 'required|string',
                'payment_method' => 'required|string',
                'customer_name' => 'required|string',
                'customer_email' => 'required|email',
                'order_id' => 'nullable|string',
                'customer_message' => 'nullable|string'
            ]);

            $data = [
                'amount' => $request->amount,
                'currency' => $request->currency,
                'phone_number' => $request->phone_number,
                'country' => $request->country,
                'payment_method' => $request->payment_method,
                'customer_name' => $request->customer_name,
                'customer_email' => $request->customer_email,
                'order_id' => $request->order_id,
                'customer_message' => $request->customer_message
            ];

            Log::info('SmartPayment: Initialisation de paiement', [
                'country' => $data['country'],
                'method' => $data['payment_method'],
                'amount' => $data['amount'],
                'currency' => $data['currency']
            ]);

            $result = $this->smartPaymentService->initializePayment($data);

            if ($result['success']) {
                // Mettre à jour les statistiques
                $this->smartPaymentService->updateProviderStats($result['provider'] ?? 'unknown', true);

                return response()->json([
                    'success' => true,
                    'message' => 'Paiement initialisé avec succès',
                    'data' => [
                        'payment_id' => $result['payment_id'] ?? $result['deposit_id'] ?? null,
                        'status' => 'pending',
                        'provider' => $result['provider'] ?? 'unknown',
                        'amount' => $request->amount,
                        'currency' => $request->currency,
                        'fallback_used' => $result['fallback_used'] ?? false
                    ]
                ]);
            } else {
                // Mettre à jour les statistiques d'échec
                $this->smartPaymentService->updateProviderStats($result['provider'] ?? 'unknown', false);

                return response()->json([
                    'success' => false,
                    'message' => 'Erreur lors de l\'initialisation du paiement',
                    'error' => $result['error'],
                    'details' => $result['details'] ?? null
                ], 400);
            }

        } catch (\Exception $e) {
            Log::error('SmartPayment: Erreur lors de l\'initialisation', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'initialisation du paiement',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Vérifier le statut d'un paiement
     */
    public function checkPaymentStatus(Request $request)
    {
        try {
            $request->validate([
                'payment_id' => 'required|string',
                'provider' => 'required|string|in:paydunya,pawapay'
            ]);

            $data = [
                'payment_id' => $request->payment_id,
                'deposit_id' => $request->payment_id // Pour Pawapay
            ];

            $result = $this->smartPaymentService->checkPaymentStatus($request->provider, $data);

            return response()->json($result);

        } catch (\Exception $e) {
            Log::error('SmartPayment: Erreur lors de la vérification du statut', [
                'message' => $e->getMessage(),
                'payment_id' => $request->payment_id ?? null,
                'provider' => $request->provider ?? null
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la vérification du statut',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtenir les méthodes de paiement disponibles par pays
     */
    public function getAvailableMethods(Request $request)
    {
        try {
            $request->validate([
                'country' => 'required|string'
            ]);

            $methods = $this->smartPaymentService->getAvailableMethods($request->country);

            return response()->json([
                'success' => true,
                'data' => $methods
            ]);

        } catch (\Exception $e) {
            Log::error('SmartPayment: Erreur lors de la récupération des méthodes', [
                'message' => $e->getMessage(),
                'country' => $request->country ?? null
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des méthodes',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtenir les statistiques des providers
     */
    public function getProviderStats()
    {
        try {
            $stats = $this->smartPaymentService->getProviderStats();

            return response()->json([
                'success' => true,
                'data' => $stats
            ]);

        } catch (\Exception $e) {
            Log::error('SmartPayment: Erreur lors de la récupération des statistiques', [
                'message' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des statistiques',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Traiter un paiement spécifique par pays et méthode
     */
    public function processPayment(Request $request, $country, $method)
    {
        try {
            $request->validate([
                'amount' => 'required|numeric|min:1',
                'currency' => 'required|string',
                'phone_number' => 'required|string',
                'customer_name' => 'required|string',
                'customer_email' => 'required|email',
                'order_id' => 'nullable|string',
                'customer_message' => 'nullable|string'
            ]);

            $data = [
                'amount' => $request->amount,
                'currency' => $request->currency,
                'phone_number' => $request->phone_number,
                'country' => $country,
                'payment_method' => $method,
                'customer_name' => $request->customer_name,
                'customer_email' => $request->customer_email,
                'order_id' => $request->order_id,
                'customer_message' => $request->customer_message
            ];

            Log::info('SmartPayment: Traitement de paiement spécifique', [
                'country' => $country,
                'method' => $method,
                'amount' => $data['amount']
            ]);

            $result = $this->smartPaymentService->initializePayment($data);

            return response()->json($result);

        } catch (\Exception $e) {
            Log::error('SmartPayment: Erreur lors du traitement du paiement', [
                'message' => $e->getMessage(),
                'country' => $country,
                'method' => $method
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du traitement du paiement',
                'error' => $e->getMessage()
            ], 500);
        }
    }
} 