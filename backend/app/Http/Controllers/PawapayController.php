<?php

namespace App\Http\Controllers;

use App\Services\PawapayService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PawapayController extends Controller
{
    protected $pawapayService;

    public function __construct(PawapayService $pawapayService)
    {
        $this->pawapayService = $pawapayService;
    }

    /**
     * Initialiser un paiement Pawapay
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

            Log::info('Pawapay Payment Initialization', $data);

            $result = $this->pawapayService->createDeposit($data);

            if ($result['success']) {
                return response()->json([
                    'success' => true,
                    'message' => 'Paiement Pawapay initialisé avec succès',
                    'data' => [
                        'deposit_id' => $result['deposit_id'],
                        'status' => 'pending',
                        'payment_url' => null, // Pawapay ne fournit pas d'URL de paiement
                        'amount' => $request->amount,
                        'currency' => $request->currency
                    ]
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Erreur lors de l\'initialisation du paiement Pawapay',
                    'error' => $result['error']
                ], 400);
            }

        } catch (\Exception $e) {
            Log::error('Pawapay Payment Error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'initialisation du paiement Pawapay',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Vérifier le statut d'un paiement Pawapay
     */
    public function checkPaymentStatus(Request $request)
    {
        try {
            $request->validate([
                'deposit_id' => 'required|string|max:36'
            ]);

            Log::info('Pawapay check status request', [
                'deposit_id' => $request->deposit_id,
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent()
            ]);

            $result = $this->pawapayService->checkDepositStatus($request->deposit_id);

            if ($result['success']) {
                $data = $result['data'];
                
                // Ajouter des informations utiles pour le frontend
                $response = [
                    'success' => true,
                    'message' => 'Statut récupéré avec succès',
                    'data' => $data
                ];

                // Ajouter des informations supplémentaires selon le statut
                if (isset($data['status'])) {
                    $statusInfo = $data['status_info'] ?? [];
                    
                    switch ($data['status']) {
                        case 'ACCEPTED':
                            $response['message'] = 'Paiement accepté et en cours de traitement';
                            $response['status_type'] = 'success';
                            break;
                        case 'PENDING':
                            $response['message'] = 'Paiement en attente de confirmation';
                            $response['status_type'] = 'warning';
                            break;
                        case 'COMPLETED':
                            $response['message'] = 'Paiement complété avec succès';
                            $response['status_type'] = 'success';
                            $response['transaction_id'] = $data['providerTransactionId'] ?? null;
                            break;
                        case 'FAILED':
                            $response['message'] = 'Paiement échoué';
                            $response['status_type'] = 'error';
                            break;
                        case 'REJECTED':
                            $response['message'] = 'Paiement rejeté';
                            $response['status_type'] = 'error';
                            break;
                        default:
                            $response['message'] = 'Statut: ' . $data['status'];
                            $response['status_type'] = 'info';
                    }
                    
                    // Ajouter les informations de statut
                    $response['status_info'] = $statusInfo;
                }

                return response()->json($response);
            } else {
                Log::error('Pawapay check status failed', [
                    'deposit_id' => $request->deposit_id,
                    'error' => $result['error']
                ]);

                return response()->json([
                    'success' => false,
                    'message' => 'Erreur lors de la vérification du statut',
                    'error' => $result['error']
                ], 400);
            }

        } catch (\Exception $e) {
            Log::error('Pawapay check status controller error', [
                'deposit_id' => $request->deposit_id ?? 'unknown',
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erreur interne du serveur',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Renvoyer un callback pour un dépôt
     */
    public function resendCallback(Request $request)
    {
        try {
            $request->validate([
                'deposit_id' => 'required|string|max:36'
            ]);

            Log::info('Pawapay: Renvoi de callback', [
                'deposit_id' => $request->deposit_id,
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent()
            ]);

            $result = $this->pawapayService->resendCallback($request->deposit_id);

            if ($result['success']) {
                return response()->json([
                    'success' => true,
                    'message' => 'Callback renvoyé avec succès',
                    'data' => $result['data']
                ]);
            } else {
                Log::error('Pawapay: Erreur lors du renvoi de callback', [
                    'deposit_id' => $request->deposit_id,
                    'error' => $result['error']
                ]);

                return response()->json([
                    'success' => false,
                    'message' => 'Erreur lors du renvoi de callback',
                    'error' => $result['error']
                ], 500);
            }

        } catch (\Exception $e) {
            Log::error('Pawapay resend callback error', [
                'deposit_id' => $request->deposit_id ?? 'unknown',
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du renvoi de callback',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Créer une page de paiement
     */
    public function createPaymentPage(Request $request)
    {
        try {
            $request->validate([
                'deposit_id' => 'required|string|max:36',
                'amount' => 'required|numeric|min:1',
                'currency' => 'required|string|size:3',
                'phone_number' => 'required|string',
                'country' => 'required|string|size:3',
                'return_url' => 'nullable|url',
                'customer_message' => 'nullable|string|max:22',
                'language' => 'nullable|string|size:2',
                'reason' => 'nullable|string',
                'metadata' => 'nullable|array'
            ]);

            Log::info('Pawapay: Création de page de paiement', [
                'deposit_id' => $request->deposit_id,
                'amount' => $request->amount,
                'currency' => $request->currency,
                'country' => $request->country,
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent()
            ]);

            $data = [
                'deposit_id' => $request->deposit_id,
                'amount' => $request->amount,
                'currency' => $request->currency,
                'phone_number' => $request->phone_number,
                'country' => $request->country,
                'return_url' => $request->return_url,
                'customer_message' => $request->customer_message,
                'language' => $request->language,
                'reason' => $request->reason,
                'metadata' => $request->metadata
            ];

            $result = $this->pawapayService->createPaymentPage($data);

            if ($result['success']) {
                return response()->json([
                    'success' => true,
                    'message' => 'Page de paiement créée avec succès',
                    'data' => $result['data']
                ]);
            } else {
                Log::error('Pawapay: Erreur lors de la création de page de paiement', [
                    'deposit_id' => $request->deposit_id,
                    'error' => $result['error']
                ]);

                return response()->json([
                    'success' => false,
                    'message' => 'Erreur lors de la création de page de paiement',
                    'error' => $result['error']
                ], 500);
            }

        } catch (\Exception $e) {
            Log::error('Pawapay create payment page error', [
                'deposit_id' => $request->deposit_id ?? 'unknown',
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création de page de paiement',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Récupérer la configuration active
     */
    public function getActiveConfiguration()
    {
        try {
            Log::info('Pawapay: Récupération de la configuration active', [
                'ip' => request()->ip(),
                'user_agent' => request()->userAgent()
            ]);

            $result = $this->pawapayService->getActiveConfiguration();

            if ($result['success']) {
                return response()->json([
                    'success' => true,
                    'message' => 'Configuration active récupérée avec succès',
                    'data' => $result['data']
                ]);
            } else {
                Log::error('Pawapay: Erreur lors de la récupération de la configuration active', [
                    'error' => $result['error']
                ]);

                return response()->json([
                    'success' => false,
                    'message' => 'Erreur lors de la récupération de la configuration active',
                    'error' => $result['error']
                ], 500);
            }

        } catch (\Exception $e) {
            Log::error('Pawapay get active configuration error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération de la configuration active',
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
                'phone_number' => 'required|string',
                'amount' => 'required|numeric|min:1',
                'customer_name' => 'required|string',
                'customer_email' => 'required|email',
                'order_id' => 'nullable|string'
            ]);

            $data = [
                'amount' => $request->amount,
                'phone_number' => $request->phone_number,
                'country' => strtoupper($country),
                'payment_method' => $method,
                'customer_name' => $request->customer_name,
                'customer_email' => $request->customer_email,
                'order_id' => $request->order_id
            ];

            Log::info("Pawapay Payment Processing", [
                'country' => $country,
                'method' => $method,
                'data' => $data
            ]);

            $result = $this->pawapayService->createDeposit($data);

            if ($result['success']) {
                return response()->json([
                    'success' => true,
                    'message' => "Paiement $method pour $country traité avec succès",
                    'data' => [
                        'deposit_id' => $result['deposit_id'],
                        'status' => 'pending',
                        'amount' => $request->amount
                    ]
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => "Erreur lors du traitement du paiement $method pour $country",
                    'error' => $result['error']
                ], 400);
            }

        } catch (\Exception $e) {
            Log::error("Pawapay Payment Processing Error", [
                'country' => $country,
                'method' => $method,
                'message' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => "Erreur lors du traitement du paiement $method pour $country",
                'error' => $e->getMessage()
            ], 500);
        }
    }
} 