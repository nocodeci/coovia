<?php

namespace App\Http\Controllers;

use App\Services\MonerooService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TestMonerooController extends Controller
{
    protected $monerooService;

    public function __construct(MonerooService $monerooService)
    {
        $this->monerooService = $monerooService;
    }

    /**
     * Test de création de paiement avec la nouvelle structure
     */
    public function testPayment(Request $request): JsonResponse
    {
        // Exemple de données de paiement selon votre structure
        $paymentData = [
            'amount' => 100,
            'currency' => 'USD',
            'customer' => [
                'email' => 'john.doe@example.com',
                'first_name' => 'John',
                'last_name' => 'Doe',
                'phone' => '123456789',
                'address' => '123 Main St',
                'city' => 'Los Angeles',
                'state' => 'CA',
                'country' => 'USA',
                'zip' => '90001',
            ],
            'description' => 'Payment for order #123',
            'return_url' => 'https://yourwebsite.com/thanks',
            'metadata' => [
                'order_id' => '123',
                'customer_id' => '456',
            ],
            'methods' => ['card', 'orange_ci'],
        ];

        try {
            $result = $this->monerooService->createPayment($paymentData);

            if ($result && isset($result['checkout_url'])) {
                return response()->json([
                    'success' => true,
                    'message' => 'Paiement créé avec succès',
                    'data' => $result,
                    'checkout_url' => $result['checkout_url'],
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
            'currency' => 'string|in:XOF,USD,EUR',
            'description' => 'required|string',
            'customer_email' => 'required|email',
            'customer_name' => 'required|string',
        ]);

        // Préparer les données du client
        $customerName = $request->customer_name;
        $nameParts = explode(' ', $customerName, 2);
        
        $paymentData = [
            'amount' => $request->amount,
            'currency' => $request->currency ?? 'XOF',
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
            'description' => $request->description,
            'return_url' => $request->return_url ?? route('payment.success'),
            'metadata' => [
                'order_id' => 'CMD_' . time(),
                'customer_id' => $request->customer_id ?? null,
            ],
            'methods' => $request->methods ?? ['card', 'orange_ci', 'moov_ci', 'mtn_ci'],
        ];

        try {
            $result = $this->monerooService->createPayment($paymentData);

            if ($result && isset($result['checkout_url'])) {
                return response()->json([
                    'success' => true,
                    'message' => 'Paiement créé avec succès',
                    'data' => $result,
                    'checkout_url' => $result['checkout_url']
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
     * Exemple d'utilisation avec la classe Moneroo\Payment
     */
    public function directPayment(): JsonResponse
    {
        try {
            // Vérifier si la classe Moneroo\Payment existe
            if (!class_exists('Moneroo\Payment')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Classe Moneroo\Payment non disponible'
                ], 500);
            }

            $paymentData = [
                'amount' => 100,
                'currency' => 'USD',
                'customer' => [
                    'email' => 'john.doe@example.com',
                    'first_name' => 'John',
                    'last_name' => 'Doe',
                    'phone' => '123456789',
                    'address' => '123 Main St',
                    'city' => 'Los Angeles',
                    'state' => 'CA',
                    'country' => 'USA',
                    'zip' => '90001',
                ],
                'description' => 'Payment for order #123',
                'return_url' => route('payment.success'),
                'metadata' => [
                    'order_id' => '123',
                    'customer_id' => '456',
                ],
                'methods' => ['card', 'orange_ci'],
            ];

            $monerooPayment = new \Moneroo\Payment();
            $payment = $monerooPayment->init($paymentData);

            return response()->json([
                'success' => true,
                'message' => 'Paiement créé directement avec Moneroo\Payment',
                'data' => [
                    'payment_id' => $payment->id ?? null,
                    'checkout_url' => $payment->checkout_url ?? null,
                    'status' => $payment->status ?? null,
                ],
                'checkout_url' => $payment->checkout_url ?? null
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur: ' . $e->getMessage()
            ], 500);
        }
    }
} 