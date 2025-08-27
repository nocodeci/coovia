<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CustomerRequest;
use App\Http\Resources\CustomerResource;
use App\Models\Customer;
use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class CustomerController extends Controller
{
    public function index(Request $request, Store $store): AnonymousResourceCollection
    {
        $this->authorize('view', $store);

        $customers = $store->customers()
            ->with(['orders'])
            ->when($request->search, function ($query, $search) {
                $query->where('first_name', 'like', "%{$search}%")
                      ->orWhere('last_name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
            })
            ->paginate(10);

        return CustomerResource::collection($customers);
    }

    public function store(CustomerRequest $request, Store $store): JsonResponse
    {
        $this->authorize('update', $store);

        $customer = $store->customers()->create($request->validated());

        return response()->json([
            'message' => 'Customer created successfully',
            'customer' => new CustomerResource($customer),
        ], 201);
    }

    public function show(Store $store, Customer $customer): JsonResponse
    {
        $this->authorize('view', $store);

        return response()->json([
            'customer' => new CustomerResource($customer->load(['orders'])),
        ]);
    }

    public function update(CustomerRequest $request, Store $store, Customer $customer): JsonResponse
    {
        $this->authorize('update', $store);

        $customer->update($request->validated());

        return response()->json([
            'message' => 'Customer updated successfully',
            'customer' => new CustomerResource($customer),
        ]);
    }

    public function destroy(Store $store, Customer $customer): JsonResponse
    {
        $this->authorize('update', $store);

        $customer->delete();

        return response()->json([
            'message' => 'Customer deleted successfully',
        ]);
    }
}
