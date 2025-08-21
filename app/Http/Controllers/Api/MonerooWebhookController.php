<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Services\MonerooService;

class MonerooWebhookController extends Controller
{
    /**
     * Traiter les webhooks Moneroo
     */
    public function handleWebhook(Request $request): JsonResponse
    {
        try {
            // Récupérer le payload et la signature
            $payload = $request->getContent();
            $signature = $request->header('X-Moneroo-Signature');
            
            Log::info('Moneroo webhook received', [
                'payload' => $payload,
                'signature' => $signature,
                'headers' => $request->headers->all()
            ]);

            // Vérifier la signature (désactivée pour les tests)
            if (config('app.env') !== 'local' && !$this->verifySignature($payload, $signature)) {
                Log::error('Moneroo webhook signature verification failed', [
                    'payload' => $payload,
                    'signature' => $signature
                ]);
                
                return response()->json([
                    'error' => 'Invalid signature'
                ], 403);
            }

            // Parser le payload JSON
            $data = json_decode($payload, true);
            
            if (!$data) {
                Log::error('Moneroo webhook invalid JSON payload', [
                    'payload' => $payload
                ]);
                
                return response()->json([
                    'error' => 'Invalid JSON payload'
                ], 400);
            }

            // Traiter l'événement
            $event = $data['event'] ?? null;
            $eventData = $data['data'] ?? null;

            if (!$event || !$eventData) {
                Log::error('Moneroo webhook missing event or data', [
                    'data' => $data
                ]);
                
                return response()->json([
                    'error' => 'Missing event or data'
                ], 400);
            }

            // Traiter selon le type d'événement
            $this->processEvent($event, $eventData);

            Log::info('Moneroo webhook processed successfully', [
                'event' => $event,
                'data' => $eventData
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Webhook processed successfully'
            ], 200);

        } catch (\Exception $e) {
            Log::error('Moneroo webhook processing error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'error' => 'Internal server error'
            ], 500);
        }
    }

    /**
     * Vérifier la signature du webhook
     */
    private function verifySignature(string $payload, string $signature): bool
    {
        // Récupérer le secret de signature depuis la configuration
        $webhookSecret = config('moneroo.webhook_secret');
        
        if (!$webhookSecret) {
            Log::error('Moneroo webhook secret not configured');
            return false;
        }

        // Calculer la signature attendue
        $expectedSignature = hash_hmac('sha256', $payload, $webhookSecret);

        // Comparer les signatures
        return hash_equals($expectedSignature, $signature);
    }

    /**
     * Traiter les différents types d'événements
     */
    private function processEvent(string $event, array $data): void
    {
        switch ($event) {
            case 'payment.initiated':
                $this->handlePaymentInitiated($data);
                break;
                
            case 'payment.success':
                $this->handlePaymentSuccess($data);
                break;
                
            case 'payment.failed':
                $this->handlePaymentFailed($data);
                break;
                
            case 'payment.cancelled':
                $this->handlePaymentCancelled($data);
                break;
                
            case 'payout.initiated':
                $this->handlePayoutInitiated($data);
                break;
                
            case 'payout.success':
                $this->handlePayoutSuccess($data);
                break;
                
            case 'payout.failed':
                $this->handlePayoutFailed($data);
                break;
                
            default:
                Log::warning('Moneroo webhook unknown event type', [
                    'event' => $event,
                    'data' => $data
                ]);
                break;
        }
    }

    /**
     * Traiter un paiement initié
     */
    private function handlePaymentInitiated(array $data): void
    {
        Log::info('Moneroo payment initiated', [
            'payment_id' => $data['id'] ?? null,
            'amount' => $data['amount'] ?? null,
            'currency' => $data['currency'] ?? null,
            'customer' => $data['customer'] ?? null
        ]);

        // Mettre à jour le statut de la commande
        $this->updateOrderStatus($data['id'] ?? null, 'pending', 'Paiement initié');
    }

    /**
     * Traiter un paiement réussi
     */
    private function handlePaymentSuccess(array $data): void
    {
        Log::info('Moneroo payment success', [
            'payment_id' => $data['id'] ?? null,
            'amount' => $data['amount'] ?? null,
            'currency' => $data['currency'] ?? null,
            'customer' => $data['customer'] ?? null
        ]);

        // Mettre à jour le statut de la commande
        $this->updateOrderStatus($data['id'] ?? null, 'paid', 'Paiement réussi');
        
        // Envoyer une notification au client
        $this->sendPaymentSuccessNotification($data);
    }

    /**
     * Traiter un paiement échoué
     */
    private function handlePaymentFailed(array $data): void
    {
        Log::info('Moneroo payment failed', [
            'payment_id' => $data['id'] ?? null,
            'amount' => $data['amount'] ?? null,
            'currency' => $data['currency'] ?? null,
            'customer' => $data['customer'] ?? null
        ]);

        // Mettre à jour le statut de la commande
        $this->updateOrderStatus($data['id'] ?? null, 'failed', 'Paiement échoué');
        
        // Envoyer une notification d'échec
        $this->sendPaymentFailedNotification($data);
    }

    /**
     * Traiter un paiement annulé
     */
    private function handlePaymentCancelled(array $data): void
    {
        Log::info('Moneroo payment cancelled', [
            'payment_id' => $data['id'] ?? null,
            'amount' => $data['amount'] ?? null,
            'currency' => $data['currency'] ?? null,
            'customer' => $data['customer'] ?? null
        ]);

        // Mettre à jour le statut de la commande
        $this->updateOrderStatus($data['id'] ?? null, 'cancelled', 'Paiement annulé');
    }

    /**
     * Traiter un transfert initié
     */
    private function handlePayoutInitiated(array $data): void
    {
        Log::info('Moneroo payout initiated', [
            'payout_id' => $data['id'] ?? null,
            'amount' => $data['amount'] ?? null,
            'currency' => $data['currency'] ?? null
        ]);
    }

    /**
     * Traiter un transfert réussi
     */
    private function handlePayoutSuccess(array $data): void
    {
        Log::info('Moneroo payout success', [
            'payout_id' => $data['id'] ?? null,
            'amount' => $data['amount'] ?? null,
            'currency' => $data['currency'] ?? null
        ]);
    }

    /**
     * Traiter un transfert échoué
     */
    private function handlePayoutFailed(array $data): void
    {
        Log::info('Moneroo payout failed', [
            'payout_id' => $data['id'] ?? null,
            'amount' => $data['amount'] ?? null,
            'currency' => $data['currency'] ?? null
        ]);
    }

    /**
     * Mettre à jour le statut d'une commande
     */
    private function updateOrderStatus(?string $paymentId, string $status, string $message): void
    {
        if (!$paymentId) {
            return;
        }

        try {
            // Rechercher la commande par l'ID de paiement
            $order = DB::table('orders')
                ->where('payment_id', $paymentId)
                ->first();

            if ($order) {
                DB::table('orders')
                    ->where('id', $order->id)
                    ->update([
                        'status' => $status,
                        'payment_status' => $status,
                        'updated_at' => now()
                    ]);

                // Ajouter un log de la commande
                DB::table('order_logs')->insert([
                    'order_id' => $order->id,
                    'action' => 'payment_status_update',
                    'message' => $message,
                    'data' => json_encode(['payment_id' => $paymentId, 'status' => $status]),
                    'created_at' => now()
                ]);

                Log::info('Order status updated', [
                    'order_id' => $order->id,
                    'payment_id' => $paymentId,
                    'status' => $status
                ]);
            }
        } catch (\Exception $e) {
            Log::error('Error updating order status', [
                'payment_id' => $paymentId,
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Envoyer une notification de paiement réussi
     */
    private function sendPaymentSuccessNotification(array $data): void
    {
        // Ici vous pouvez implémenter l'envoi d'email/SMS
        // au client pour confirmer le paiement
        
        Log::info('Payment success notification should be sent', [
            'payment_id' => $data['id'] ?? null,
            'customer' => $data['customer'] ?? null
        ]);
    }

    /**
     * Envoyer une notification d'échec de paiement
     */
    private function sendPaymentFailedNotification(array $data): void
    {
        // Ici vous pouvez implémenter l'envoi d'email/SMS
        // au client pour l'informer de l'échec
        
        Log::info('Payment failed notification should be sent', [
            'payment_id' => $data['id'] ?? null,
            'customer' => $data['customer'] ?? null
        ]);
    }
} 