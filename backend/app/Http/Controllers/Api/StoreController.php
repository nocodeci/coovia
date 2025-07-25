<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreRequest;
use App\Http\Resources\StoreResource;
use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class StoreController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $stores = Store::with(['owner'])
            ->where('owner_id', $request->user()->id)
            ->paginate(10);

        return StoreResource::collection($stores);
    }

    public function store(StoreRequest $request): JsonResponse
    {
        $store = Store::create([
            ...$request->validated(),
            'owner_id' => $request->user()->id,
            'slug' => \Str::slug($request->name),
        ]);

        return response()->json([
            'message' => 'Store created successfully',
            'store' => new StoreResource($store),
        ], 201);
    }

    public function show(Store $store): JsonResponse
    {
        $this->authorize('view', $store);

        return response()->json([
            'store' => new StoreResource($store->load(['owner', 'products', 'orders', 'customers'])),
        ]);
    }

    public function update(StoreRequest $request, Store $store): JsonResponse
    {
        $this->authorize('update', $store);

        $store->update($request->validated());

        return response()->json([
            'message' => 'Store updated successfully',
            'store' => new StoreResource($store),
        ]);
    }

    public function destroy(Store $store): JsonResponse
    {
        $this->authorize('delete', $store);

        $store->delete();

        return response()->json([
            'message' => 'Store deleted successfully',
        ]);
    }
}
