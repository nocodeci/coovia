<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\OrderRequest;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class OrderController extends Controller
{
    public function index(Request $request, Store $store): AnonymousResourceCollection
    {
        $this->authorize('view', $store);

        $orders = $store->orders()
            ->with(['customer', 'items.product'])
            ->when($request->status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->when($request->payment_status, function ($query, $paymentStatus) {
                $query->where('payment_status', $paymentStatus);
            })
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return OrderResource::collection($orders);
    }

    public function show(Store $store, Order $order): JsonResponse
    {
        $this->authorize('view', $store);

        return response()->json([
            'order' => new OrderResource($order->load(['customer', 'items.product'])),
        ]);
    }

    public function update(OrderRequest $request, Store $store, Order $order): JsonResponse
    {
        $this->authorize('update', $store);

        $order->update($request->validated());

        return response()->json([
            'message' => 'Order updated successfully',
            'order' => new OrderResource($order),
        ]);
    }
}
