<?php

namespace App\Http\Controllers;

use App\Services\MonerooService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class MonerooController extends Controller
{
    protected $monerooService;

    public function __construct()
    {
        // Le service sera créé avec l'ID utilisateur dans chaque méthode
    }

    /**
     * Créer un nouveau paiement
     */
    public function createPayment(Request $request): JsonResponse
    {
        $request->validate([
            'amount' => 'required|numeric|min:1',
            'currency' => 'string|in:XOF,USD,EUR',
            'description' => 'required|string|max:255',
            'customer' => 'required|array',
            'customer.email' => 'required|email',
            'customer.first_name' => 'required|string|max:255',
            'customer.last_name' => 'required|string|max:255',
            'customer.phone' => 'nullable|string',
            'customer.address' => 'nullable|string',
            'customer.city' => 'nullable|string',
            'customer.state' => 'nullable|string',
            'customer.country' => 'nullable|string',
            'customer.zip' => 'nullable|string',
            'reference' => 'required|string|unique:orders,reference',
            'return_url' => 'nullable|url',
            'metadata' => 'nullable|array',
            'methods' => 'nullable|array',
        ]);

        try {
            $userId = Auth::id();
            $monerooService = new MonerooService($userId);
            
            $paymentData = [
                'amount' => $request->amount,
                'currency' => $request->currency ?? 'XOF',
                'customer' => $request->customer,
                'description' => $request->description,
                'reference' => $request->reference,
                'return_url' => $request->return_url ?? route('payment.success'),
                'metadata' => $request->metadata ?? [
                    'order_id' => $request->reference,
                    'customer_id' => $request->customer_id ?? null,
                ],
                'methods' => $request->methods ?? ['card', 'orange_ci', 'moov_ci', 'mtn_ci'],
            ];

            $result = $monerooService->createPayment($paymentData);

            if ($result && isset($result['checkout_url'])) {
                return response()->json([
                    'success' => true,
                    'data' => $result,
                    'message' => 'Paiement créé avec succès',
                    'checkout_url' => $result['checkout_url']
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création du paiement'
            ], 500);

        } catch (\Exception $e) {
            Log::error('Moneroo payment creation error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erreur interne du serveur'
            ], 500);
        }
    }

    /**
     * Vérifier le statut d'un paiement
     */
    public function checkPaymentStatus(string $paymentId): JsonResponse
    {
        try {
            $result = $this->monerooService->checkPaymentStatus($paymentId);

            if ($result) {
                return response()->json([
                    'success' => true,
                    'data' => $result
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'Paiement non trouvé'
            ], 404);

        } catch (\Exception $e) {
            Log::error('Moneroo payment status check error', [
                'payment_id' => $paymentId,
                'message' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erreur interne du serveur'
            ], 500);
        }
    }

    /**
     * Webhook pour recevoir les notifications de paiement
     */
    public function webhook(Request $request): JsonResponse
    {
        try {
            $signature = $request->header('X-Moneroo-Signature');
            
            if (!$signature) {
                Log::error('Moneroo webhook missing signature');
                return response()->json(['error' => 'Signature manquante'], 400);
            }

            $data = $request->all();
            
            $result = $this->monerooService->processWebhook($data, $signature);

            if ($result) {
                return response()->json(['success' => true]);
            }

            return response()->json(['error' => 'Erreur de traitement'], 400);

        } catch (\Exception $e) {
            Log::error('Moneroo webhook error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json(['error' => 'Erreur interne'], 500);
        }
    }

    /**
     * Page de succès après paiement
     */
    public function paymentSuccess(Request $request)
    {
        $paymentId = $request->query('payment_id');
        $reference = $request->query('reference');

        Log::info('Payment success page accessed', [
            'payment_id' => $paymentId,
            'reference' => $reference
        ]);

        // Ici vous pouvez rediriger vers une page de succès
        // ou retourner une vue
        return response()->json([
            'success' => true,
            'message' => 'Paiement effectué avec succès',
            'payment_id' => $paymentId,
            'reference' => $reference
        ]);
    }

    /**
     * Page d'échec après paiement
     */
    public function paymentFailed(Request $request)
    {
        $paymentId = $request->query('payment_id');
        $reference = $request->query('reference');

        Log::info('Payment failed page accessed', [
            'payment_id' => $paymentId,
            'reference' => $reference
        ]);

        return response()->json([
            'success' => false,
            'message' => 'Le paiement a échoué',
            'payment_id' => $paymentId,
            'reference' => $reference
        ]);
    }
} 