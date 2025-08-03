<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\MonerooService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class MonerooTestController extends Controller
{
    /**
     * Test de création de paiement avec l'API officielle Moneroo
     */
    public function testPayment(Request $request): JsonResponse
    {
        // Exemple de données selon la documentation officielle
        $paymentData = [
            'amount' => 100,
            'currency' => 'USD',
            'description' => 'Payment for order #123',
            'customer' => [
                'email' => 'john@example.com',
                'first_name' => 'John',
                'last_name' => 'Doe',
                'phone' => '123456789',
                'address' => '123 Main St',
                'city' => 'Los Angeles',
                'state' => 'CA',
                'country' => 'USA',
                'zip' => '90001',
            ],
            'return_url' => route('payment.success'),
            'metadata' => [
                'order_id' => '123',
                'customer_id' => '456',
            ],
            'methods' => ['qr_ngn', 'bank_transfer_ngn', 'card'],
        ];

        try {
            $userId = Auth::id();
            $monerooService = new MonerooService($userId);
            
            $result = $monerooService->createPayment($paymentData);

            if ($result && isset($result['data']['checkout_url'])) {
                return response()->json([
                    'success' => true,
                    'message' => 'Paiement créé avec succès',
                    'data' => $result,
                    'checkout_url' => $result['data']['checkout_url'],
                    'redirect_instructions' => 'Redirigez l\'utilisateur vers checkout_url pour finaliser le paiement'
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création du paiement',
                'data' => $result
            ], 500);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Test avec données personnalisées
     */
    public function customPayment(Request $request): JsonResponse
    {
        $request->validate([
            'amount' => 'required|numeric|min:1',
            'currency' => 'string|in:USD,XOF,EUR',
            'description' => 'required|string',
            'customer_email' => 'required|email',
            'customer_name' => 'required|string',
        ]);

        // Préparer les données du client
        $customerName = $request->customer_name;
        $nameParts = explode(' ', $customerName, 2);
        
        $paymentData = [
            'amount' => $request->amount,
            'currency' => $request->currency ?? 'USD',
            'description' => $request->description,
            'customer' => [
                'email' => $request->customer_email,
                'first_name' => $nameParts[0] ?? '',
                'last_name' => $nameParts[1] ?? '',
                'phone' => $request->customer_phone ?? '',
                'address' => $request->customer_address ?? '',
                'city' => $request->customer_city ?? '',
                'state' => $request->customer_state ?? '',
                'country' => $request->customer_country ?? 'CI',
                'zip' => $request->customer_zip ?? '',
            ],
            'return_url' => $request->return_url ?? route('payment.success'),
            'metadata' => [
                'order_id' => 'CMD_' . time(),
                'customer_id' => $request->customer_id ?? null,
            ],
            'methods' => $request->methods ?? ['qr_ngn', 'bank_transfer_ngn', 'card'],
        ];

        try {
            $userId = Auth::id();
            $monerooService = new MonerooService($userId);
            
            $result = $monerooService->createPayment($paymentData);

            if ($result && isset($result['data']['checkout_url'])) {
                return response()->json([
                    'success' => true,
                    'message' => 'Paiement créé avec succès',
                    'data' => $result,
                    'checkout_url' => $result['data']['checkout_url']
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création du paiement',
                'data' => $result
            ], 500);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Test de vérification du statut d'un paiement
     */
    public function checkPaymentStatus(Request $request, string $paymentId): JsonResponse
    {
        try {
            $userId = Auth::id();
            $monerooService = new MonerooService($userId);
            
            $result = $monerooService->checkPaymentStatus($paymentId);

            if ($result) {
                return response()->json([
                    'success' => true,
                    'message' => 'Statut du paiement récupéré',
                    'data' => $result
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la vérification du statut',
                'data' => $result
            ], 500);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Exemple d'utilisation avec cURL
     */
    public function curlExample(): JsonResponse
    {
        $curlExample = <<<'CURL'
curl -X POST https://api.moneroo.io/v1/payments/initialize \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_SECRET_KEY" \
     -H "Accept: application/json" \
     -d '{
         "amount": 100,
         "currency": "USD",
         "description": "Payment for order #123",
         "customer": {
             "email": "john@example.com",
             "first_name": "John",
             "last_name": "Doe"
         },
         "return_url": "https://example.com/payments/thank-you",
         "metadata": {
             "order_id": "123",
             "customer_id": "123"
         },
         "methods": ["qr_ngn", "bank_transfer_ngn"]
     }'
CURL;

        return response()->json([
            'success' => true,
            'message' => 'Exemple cURL pour l\'API Moneroo',
            'curl_example' => $curlExample,
            'api_documentation' => 'https://docs.moneroo.io'
        ]);
    }
} 