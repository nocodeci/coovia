<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ProductController extends Controller
{
    public function index(Request $request, Store $store): JsonResponse
    {
        $this->authorize('view', $store);

        $products = $store->products()
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%");
            })
            ->when($request->category, function ($query, $category) {
                $query->where('category', $category);
            })
            ->when($request->status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Produits récupérés avec succès',
            'data' => ProductResource::collection($products)
        ]);
    }

    public function store(ProductRequest $request, Store $store): JsonResponse
    {
        $this->authorize('update', $store);

        $product = $store->products()->create($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Produit créé avec succès',
            'data' => new ProductResource($product),
        ], 201);
    }

    public function show(Store $store, Product $product): JsonResponse
    {
        $this->authorize('view', $store);

        return response()->json([
            'product' => new ProductResource($product),
        ]);
    }

    public function update(ProductRequest $request, Store $store, Product $product): JsonResponse
    {
        $this->authorize('update', $store);

        $product->update($request->validated());

        return response()->json([
            'message' => 'Product updated successfully',
            'product' => new ProductResource($product),
        ]);
    }

    public function destroy(Store $store, Product $product): JsonResponse
    {
        $this->authorize('update', $store);

        $product->delete();

        return response()->json([
            'message' => 'Product deleted successfully',
        ]);
    }
}
