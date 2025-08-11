<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Vendor;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class VendorController extends Controller
{
    /**
     * Display a listing of vendors.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Vendor::with(['user', 'stores', 'products']);

        // Filtres
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('verification_status')) {
            $query->where('verification_status', $request->verification_status);
        }

        if ($request->has('featured')) {
            $query->featured();
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('business_name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($userQuery) use ($search) {
                      $userQuery->where('name', 'like', "%{$search}%")
                               ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }

        // Tri
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $vendors = $query->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $vendors->items(),
            'pagination' => [
                'current_page' => $vendors->currentPage(),
                'last_page' => $vendors->lastPage(),
                'per_page' => $vendors->perPage(),
                'total' => $vendors->total(),
            ],
        ]);
    }

    /**
     * Store a newly created vendor.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'business_name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'logo' => 'nullable|string',
            'banner' => 'nullable|string',
            'contact_info.email' => 'required|email|unique:users,email',
            'contact_info.phone' => 'required|string|max:20',
            'contact_info.website' => 'nullable|url',
            'address.street' => 'required|string|max:255',
            'address.city' => 'required|string|max:100',
            'address.state' => 'required|string|max:100',
            'address.country' => 'required|string|max:100',
            'address.postal_code' => 'required|string|max:20',
            'business_info.tax_id' => 'nullable|string|max:100',
            'business_info.registration_number' => 'nullable|string|max:100',
            'business_info.business_type' => 'nullable|string|max:100',
            'commission_rate' => 'nullable|numeric|min:0|max:100',
            'auto_approve_products' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            // Créer l'utilisateur
            $user = User::create([
                'name' => $request->business_name,
                'email' => $request->contact_info['email'],
                'password' => Hash::make(Str::random(12)), // Mot de passe temporaire
                'role' => 'vendor',
            ]);

            // Créer le vendeur
            $vendor = Vendor::create([
                'user_id' => $user->id,
                'business_name' => $request->business_name,
                'slug' => Str::slug($request->business_name),
                'description' => $request->description,
                'logo' => $request->logo,
                'banner' => $request->banner,
                'status' => 'pending',
                'verification_status' => 'pending',
                'contact_info' => $request->contact_info,
                'address' => $request->address,
                'business_info' => $request->business_info,
                'commission_rate' => $request->commission_rate ?? 10.00,
                'auto_approve_products' => $request->auto_approve_products ?? false,
            ]);

            // Envoyer un email de bienvenue avec les informations de connexion

            return response()->json([
                'success' => true,
                'message' => 'Vendeur créé avec succès',
                'data' => $vendor->load('user'),
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création du vendeur',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified vendor.
     */
    public function show(Vendor $vendor): JsonResponse
    {
        $vendor->load(['user', 'stores', 'products', 'orders']);

        return response()->json([
            'success' => true,
            'data' => $vendor,
        ]);
    }

    /**
     * Update the specified vendor.
     */
    public function update(Request $request, Vendor $vendor): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'business_name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'logo' => 'nullable|string',
            'banner' => 'nullable|string',
            'contact_info.email' => [
                'sometimes',
                'email',
                Rule::unique('users', 'email')->ignore($vendor->user_id),
            ],
            'contact_info.phone' => 'sometimes|string|max:20',
            'contact_info.website' => 'nullable|url',
            'address.street' => 'sometimes|string|max:255',
            'address.city' => 'sometimes|string|max:100',
            'address.state' => 'sometimes|string|max:100',
            'address.country' => 'sometimes|string|max:100',
            'address.postal_code' => 'sometimes|string|max:20',
            'business_info.tax_id' => 'nullable|string|max:100',
            'business_info.registration_number' => 'nullable|string|max:100',
            'business_info.business_type' => 'nullable|string|max:100',
            'commission_rate' => 'nullable|numeric|min:0|max:100',
            'auto_approve_products' => 'boolean',
            'status' => 'sometimes|in:pending,active,inactive,suspended',
            'verification_status' => 'sometimes|in:pending,verified,rejected',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            // Mettre à jour l'utilisateur si nécessaire
            if ($request->has('contact_info.email')) {
                $vendor->user->update([
                    'email' => $request->contact_info['email'],
                ]);
            }

            // Mettre à jour le vendeur
            $vendor->update($request->except(['user']));

            return response()->json([
                'success' => true,
                'message' => 'Vendeur mis à jour avec succès',
                'data' => $vendor->fresh()->load('user'),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour du vendeur',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified vendor.
     */
    public function destroy(Vendor $vendor): JsonResponse
    {
        try {
            // Supprimer le vendeur et l'utilisateur associé
            $vendor->user->delete();
            $vendor->delete();

            return response()->json([
                'success' => true,
                'message' => 'Vendeur supprimé avec succès',
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression du vendeur',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Approve a vendor.
     */
    public function approve(Vendor $vendor): JsonResponse
    {
        try {
            $vendor->approve();

            return response()->json([
                'success' => true,
                'message' => 'Vendeur approuvé avec succès',
                'data' => $vendor->fresh(),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'approbation du vendeur',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Reject a vendor.
     */
    public function reject(Request $request, Vendor $vendor): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'reason' => 'required|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $vendor->reject($request->reason);

            return response()->json([
                'success' => true,
                'message' => 'Vendeur rejeté avec succès',
                'data' => $vendor->fresh(),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du rejet du vendeur',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Suspend a vendor.
     */
    public function suspend(Request $request, Vendor $vendor): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'reason' => 'required|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $vendor->suspend($request->reason);

            return response()->json([
                'success' => true,
                'message' => 'Vendeur suspendu avec succès',
                'data' => $vendor->fresh(),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suspension du vendeur',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get vendor statistics.
     */
    public function stats(Vendor $vendor): JsonResponse
    {
        try {
            $stats = $vendor->stats;

            return response()->json([
                'success' => true,
                'data' => $stats,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des statistiques',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get vendor dashboard data.
     */
    public function dashboard(Vendor $vendor): JsonResponse
    {
        try {
            $recentOrders = $vendor->orders()
                ->with(['customer', 'items.product'])
                ->latest()
                ->take(5)
                ->get();

            $recentProducts = $vendor->products()
                ->with(['variants'])
                ->latest()
                ->take(5)
                ->get();

            $stats = $vendor->stats;

            return response()->json([
                'success' => true,
                'data' => [
                    'stats' => $stats,
                    'recent_orders' => $recentOrders,
                    'recent_products' => $recentProducts,
                ],
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des données du tableau de bord',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
