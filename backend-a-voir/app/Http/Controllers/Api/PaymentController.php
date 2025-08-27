<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\PaymentGatewayService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    private $paymentGatewayService;

    public function __construct()
    {
        $this->paymentGatewayService = new PaymentGatewayService();
    }

    /**
     * Créer un paiement avec détection automatique de la passerelle
     */
    public function createPayment(Request $request): JsonResponse
    {
        $request->validate([
            'amount' => 'required|numeric|min:1',
            'currency' => 'string|in:XOF,XAF,EUR,USD',
            'description' => 'required|string|max:255',
            'store_id' => 'nullable|uuid',
            'customer_info' => 'nullable|array',
            'customer_info.firstName' => 'nullable|string|max:255',
            'customer_info.lastName' => 'nullable|string|max:255',
            'customer_info.email' => 'nullable|email',
            'customer_info.phone' => 'nullable|string|max:20',
            'items' => 'nullable|array',
            'items.*.name' => 'required|string',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
            'items.*.total_price' => 'required|numeric|min:0',
        ]);

        try {
            $userId = Auth::id() ?? '9f8a9e5c-8f18-4163-9b55-c56b6fa61389';
            $storeId = $request->store_id;
            
            $this->paymentGatewayService = new PaymentGatewayService($userId, $storeId);
            
            $paymentData = [
                'amount' => $request->amount,
                'currency' => $request->currency ?? 'XOF',
                'description' => $request->description,
                'customer_info' => $request->customer_info,
                'items' => $request->items ?? [],
                'store_id' => $storeId,
            ];

            $result = $this->paymentGatewayService->createPayment($paymentData);

            if ($result['success']) {
                return response()->json([
                    'success' => true,
                    'data' => $result,
                    'message' => $result['message'],
                    'gateway_used' => $result['gateway'],
                    'redirect_url' => $result['redirect_url']
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => $result['message'],
                'gateway_used' => $result['gateway'] ?? 'unknown'
            ], 500);

        } catch (\Exception $e) {
            Log::error('Payment creation error', [
                'message' => $e->getMessage(),
                'user_id' => Auth::id()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création du paiement: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Vérifier le statut d'un paiement
     */
    public function checkPaymentStatus(Request $request): JsonResponse
    {
        $request->validate([
            'payment_id' => 'required|string',
            'gateway' => 'required|string|in:moneroo,paydunya,pawapay'
        ]);

        try {
            $userId = Auth::id() ?? '9f8a9e5c-8f18-4163-9b55-c56b6fa61389';
            $this->paymentGatewayService = new PaymentGatewayService($userId);
            
            $result = $this->paymentGatewayService->checkPaymentStatus(
                $request->payment_id,
                $request->gateway
            );

            return response()->json($result);

        } catch (\Exception $e) {
            Log::error('Payment status check error', [
                'message' => $e->getMessage(),
                'payment_id' => $request->payment_id,
                'gateway' => $request->gateway
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la vérification du statut: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtenir les statistiques de paiement
     */
    public function getPaymentStats(): JsonResponse
    {
        try {
            $userId = Auth::id() ?? '9f8a9e5c-8f18-4163-9b55-c56b6fa61389';
            $this->paymentGatewayService = new PaymentGatewayService($userId);
            
            $result = $this->paymentGatewayService->getPaymentStats();

            return response()->json($result);

        } catch (\Exception $e) {
            Log::error('Payment stats error', [
                'message' => $e->getMessage(),
                'user_id' => Auth::id()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des statistiques: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtenir l'historique des paiements
     */
    public function getPaymentHistory(Request $request): JsonResponse
    {
        $request->validate([
            'limit' => 'nullable|integer|min:1|max:100'
        ]);

        try {
            $userId = Auth::id() ?? '9f8a9e5c-8f18-4163-9b55-c56b6fa61389';
            $this->paymentGatewayService = new PaymentGatewayService($userId);
            
            $limit = $request->limit ?? 10;
            $result = $this->paymentGatewayService->getPaymentHistory($limit);

            return response()->json($result);

        } catch (\Exception $e) {
            Log::error('Payment history error', [
                'message' => $e->getMessage(),
                'user_id' => Auth::id()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération de l\'historique: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Détecter la passerelle de paiement pour l'utilisateur
     */
    public function detectGateway(): JsonResponse
    {
        try {
            $userId = Auth::id() ?? '9f8a9e5c-8f18-4163-9b55-c56b6fa61389';
            $this->paymentGatewayService = new PaymentGatewayService($userId);
            
            $gatewayInfo = $this->paymentGatewayService->detectPaymentGateway();

            return response()->json([
                'success' => true,
                'gateway' => $gatewayInfo['gateway'],
                'priority' => $gatewayInfo['priority'],
                'message' => $gatewayInfo['gateway'] === 'moneroo' 
                    ? 'Utilisation de votre passerelle Moneroo configurée'
                    : 'Utilisation des passerelles par défaut (PayDunya/Pawapay)'
            ]);

        } catch (\Exception $e) {
            Log::error('Gateway detection error', [
                'message' => $e->getMessage(),
                'user_id' => Auth::id()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la détection de la passerelle: ' . $e->getMessage()
            ], 500);
        }
    }
}
