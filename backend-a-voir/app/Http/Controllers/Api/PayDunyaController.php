<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\PayDunyaService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB; // Added missing import for DB facade

class PayDunyaController extends Controller
{
    private $paydunyaService;

    public function __construct()
    {
        $this->paydunyaService = new PayDunyaService(Auth::id());
    }

    /**
     * Créer une facture de paiement PayDunya
     */
    public function createInvoice(Request $request): JsonResponse
    {
        $request->validate([
            'amount' => 'required|numeric|min:1',
            'description' => 'required|string|max:255',
            'store_name' => 'nullable|string|max:255',
            'customer_info' => 'nullable|array',
            'customer_info.firstName' => 'nullable|string|max:255',
            'customer_info.lastName' => 'nullable|string|max:255',
            'customer_info.email' => 'nullable|email',
            'customer_info.phone' => 'nullable|string|max:20',
            'customer_info.address' => 'nullable|string',
            'items' => 'nullable|array',
            'items.*.name' => 'required|string',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
            'items.*.total_price' => 'required|numeric|min:0',
            'items.*.description' => 'nullable|string',
        ]);

        try {
            $paymentData = [
                'amount' => $request->amount,
                'description' => $request->description,
                'store_name' => $request->store_name,
                'customer_info' => $request->customer_info,
                'items' => $request->items ?? [],
                'user_id' => Auth::id(),
                'store_id' => $request->store_id,
            ];

            $result = $this->paydunyaService->createPayment($paymentData);

            if ($result['success']) {
                return response()->json([
                    'success' => true,
                    'data' => $result,
                    'message' => 'Facture PayDunya créée avec succès'
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => $result['error']
            ], 500);

        } catch (\Exception $e) {
            Log::error('PayDunya invoice creation error', [
                'message' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erreur: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Vérifier le statut d'un paiement
     */
    public function checkStatus(Request $request): JsonResponse
    {
        $request->validate([
            'token' => 'required|string'
        ]);

        try {
            $result = $this->paydunyaService->checkPaymentStatus($request->token);

            return response()->json($result);

        } catch (\Exception $e) {
            Log::error('PayDunya status check error', [
                'token' => $request->token,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erreur: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Paiement par Orange Money Sénégal (QR Code)
     */
    public function payWithOrangeMoneyQR(Request $request): JsonResponse
    {
        $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email',
            'phone_number' => 'required|string|max:20',
            'invoice_token' => 'required|string'
        ]);

        try {
            $paymentData = [
                'customer_name' => $request->customer_name,
                'customer_email' => $request->customer_email,
                'phone_number' => $request->phone_number,
                'invoice_token' => $request->invoice_token
            ];

            $result = $this->paydunyaService->payWithOrangeMoneyQR($paymentData);

            return response()->json($result);

        } catch (\Exception $e) {
            Log::error('Orange Money QR payment error', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erreur: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Paiement par Orange Money Sénégal (OTP)
     */
    public function payWithOrangeMoneyOTP(Request $request): JsonResponse
    {
        $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email',
            'phone_number' => 'required|string|max:20',
            'authorization_code' => 'required|string|max:10',
            'invoice_token' => 'required|string'
        ]);

        try {
            $paymentData = [
                'customer_name' => $request->customer_name,
                'customer_email' => $request->customer_email,
                'phone_number' => $request->phone_number,
                'authorization_code' => $request->authorization_code,
                'invoice_token' => $request->invoice_token
            ];

            $result = $this->paydunyaService->payWithOrangeMoneyOTP($paymentData);

            return response()->json($result);

        } catch (\Exception $e) {
            Log::error('Orange Money OTP payment error', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erreur: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Paiement par Free Money Sénégal
     */
    public function payWithFreeMoney(Request $request): JsonResponse
    {
        $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email',
            'phone_number' => 'required|string|max:20',
            'payment_token' => 'required|string'
        ]);

        try {
            $paymentData = [
                'customer_name' => $request->customer_name,
                'customer_email' => $request->customer_email,
                'phone_number' => $request->phone_number,
                'payment_token' => $request->payment_token
            ];

            $result = $this->paydunyaService->payWithFreeMoney($paymentData);

            return response()->json($result);

        } catch (\Exception $e) {
            Log::error('Free Money payment error', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erreur: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Paiement par Wave Sénégal
     */
    public function payWithWave(Request $request): JsonResponse
    {
        $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email',
            'phone_number' => 'required|string|max:20',
            'payment_token' => 'required|string'
        ]);

        try {
            $paymentData = [
                'customer_name' => $request->customer_name,
                'customer_email' => $request->customer_email,
                'phone_number' => $request->phone_number,
                'payment_token' => $request->payment_token
            ];

            $result = $this->paydunyaService->payWithWave($paymentData);

            return response()->json($result);

        } catch (\Exception $e) {
            Log::error('Wave payment error', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erreur: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Paiement par carte bancaire
     */
    public function payWithCard(Request $request): JsonResponse
    {
        $request->validate([
            'full_name' => 'required|string|max:255',
            'email' => 'required|email',
            'card_number' => 'required|string|max:20',
            'card_cvv' => 'required|string|max:4',
            'card_expired_date_year' => 'required|string|max:2',
            'card_expired_date_month' => 'required|string|max:2',
            'token' => 'required|string'
        ]);

        try {
            $paymentData = [
                'full_name' => $request->full_name,
                'email' => $request->email,
                'card_number' => $request->card_number,
                'card_cvv' => $request->card_cvv,
                'card_expired_date_year' => $request->card_expired_date_year,
                'card_expired_date_month' => $request->card_expired_date_month,
                'token' => $request->token
            ];

            $result = $this->paydunyaService->payWithCard($paymentData);

            return response()->json($result);

        } catch (\Exception $e) {
            Log::error('Card payment error', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erreur: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Valider les clés API PayDunya
     */
    public function validateApiKeys(): JsonResponse
    {
        try {
            $result = $this->paydunyaService->validateApiKeys();

            return response()->json($result);

        } catch (\Exception $e) {
            Log::error('PayDunya API validation error', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erreur: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtenir les méthodes de paiement supportées
     */
    public function getSupportedMethods(): JsonResponse
    {
        try {
            $methods = config('paydunya.supported_methods');
            $countries = config('paydunya.supported_countries');
            $fees = config('paydunya.fees');

            return response()->json([
                'success' => true,
                'data' => [
                    'methods' => $methods,
                    'countries' => $countries,
                    'fees' => $fees
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('PayDunya methods error', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erreur: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Webhook PayDunya
     */
    public function webhook(Request $request): JsonResponse
    {
        try {
            Log::info('PayDunya webhook received', [
                'data' => $request->all()
            ]);

            // Vérifier la signature du webhook
            $signature = $request->header('PAYDUNYA-SIGNATURE');
            $data = $request->all();
            
            if (!$this->paydunyaService->verifyWebhookSignature($data, $signature)) {
                Log::warning('PayDunya webhook signature verification failed');
                return response()->json(['error' => 'Signature invalide'], 400);
            }

            // Traiter le webhook selon le statut
            $status = $data['status'] ?? 'unknown';
            
            switch ($status) {
                case 'completed':
                    $this->handlePaymentSuccess($data);
                    break;
                case 'failed':
                    $this->handlePaymentFailed($data);
                    break;
                case 'cancelled':
                    $this->handlePaymentCancelled($data);
                    break;
                default:
                    Log::info('PayDunya webhook status unknown', ['status' => $status]);
            }

            return response()->json(['success' => true]);

        } catch (\Exception $e) {
            Log::error('PayDunya webhook error', [
                'error' => $e->getMessage(),
                'data' => $request->all()
            ]);

            return response()->json(['error' => 'Erreur de traitement'], 500);
        }
    }

    /**
     * Gérer un paiement réussi
     */
    private function handlePaymentSuccess($data): void
    {
        Log::info('PayDunya payment success', [
            'token' => $data['token'] ?? null,
            'amount' => $data['total_amount'] ?? null,
            'customer' => $data['customer'] ?? null
        ]);

        // Mettre à jour le statut de la commande
        $this->updateOrderStatus($data['token'] ?? null, 'completed', 'Paiement PayDunya réussi');
    }

    /**
     * Gérer un paiement échoué
     */
    private function handlePaymentFailed($data): void
    {
        Log::info('PayDunya payment failed', [
            'token' => $data['token'] ?? null,
            'reason' => $data['fail_reason'] ?? 'Raison inconnue'
        ]);

        $this->updateOrderStatus($data['token'] ?? null, 'failed', 'Paiement PayDunya échoué');
    }

    /**
     * Gérer un paiement annulé
     */
    private function handlePaymentCancelled($data): void
    {
        Log::info('PayDunya payment cancelled', [
            'token' => $data['token'] ?? null
        ]);

        $this->updateOrderStatus($data['token'] ?? null, 'cancelled', 'Paiement PayDunya annulé');
    }

    /**
     * Mettre à jour le statut de la commande
     */
    private function updateOrderStatus($token, $status, $message): void
    {
        try {
            // Mettre à jour le log de paiement
            DB::table('payment_logs')
                ->where('payment_id', $token)
                ->where('gateway', 'paydunya')
                ->update([
                    'status' => $status,
                    'updated_at' => now()
                ]);

            // Mettre à jour la commande si elle existe
            DB::table('orders')
                ->where('payment_id', $token)
                ->update([
                    'status' => $status,
                    'updated_at' => now()
                ]);

            Log::info('Order status updated', [
                'token' => $token,
                'status' => $status,
                'message' => $message
            ]);

        } catch (\Exception $e) {
            Log::error('Error updating order status', [
                'token' => $token,
                'error' => $e->getMessage()
            ]);
        }
    }
} 