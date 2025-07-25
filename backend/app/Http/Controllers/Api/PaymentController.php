<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PaymentGatewayResource;
use App\Http\Resources\PaymentTransactionResource;
use App\Models\PaymentGateway;
use App\Models\PaymentTransaction;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PaymentController extends Controller
{
    public function gateways(): AnonymousResourceCollection
    {
        $gateways = PaymentGateway::with(['paymentMethods'])
            ->where('is_active', true)
            ->get();

        return PaymentGatewayResource::collection($gateways);
    }

    public function transactions(Request $request): AnonymousResourceCollection
    {
        $transactions = PaymentTransaction::with(['paymentGateway', 'paymentMethod'])
            ->when($request->status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->when($request->gateway, function ($query, $gateway) {
                $query->whereHas('paymentGateway', function ($q) use ($gateway) {
                    $q->where('type', $gateway);
                });
            })
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return PaymentTransactionResource::collection($transactions);
    }

    public function processPayment(Request $request): JsonResponse
    {
        // Logique de traitement des paiements
        // À implémenter selon vos besoins spécifiques

        return response()->json([
            'message' => 'Payment processed successfully',
            'transaction_id' => 'TXN_' . uniqid(),
        ]);
    }
}
