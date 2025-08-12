<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Store;
use App\Mail\StoreCreatedMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class StoreController extends Controller
{
    /**
     * Récupérer toutes les boutiques de l'utilisateur authentifié
     */
    public function index(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Utilisateur non authentifié'
            ], 401);
        }

        try {
            $stores = Store::where('owner_id', $user->id)
                ->where('status', 'active')
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'message' => 'Boutiques récupérées avec succès',
                'stores' => $stores->map(function ($store) {
                    return [
                        'id' => $store->id,
                        'name' => $store->name,
                        'description' => $store->description,
                        'address' => $store->address,
                        'phone' => $store->phone,
                        'website' => $store->website,
                        'status' => $store->status,
                        'created_at' => $store->created_at,
                        'updated_at' => $store->updated_at,
                    ];
                })
            ]);

        } catch (\Exception $e) {
            Log::error("Erreur lors de la récupération des boutiques: " . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des boutiques'
            ], 500);
        }
    }

    /**
     * Créer une nouvelle boutique pour un utilisateur
     * Cette méthode est appelée après le Just-in-time registration
     */
    public function createStore(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:stores,slug',
            'description' => 'nullable|string|max:1000',
            'logo' => 'nullable|file|image|max:2048',
            'productType' => 'nullable|string|max:255',
            'productCategories' => 'nullable|string', // JSON string
            'address' => 'nullable|array',
            'address.city' => 'nullable|string|max:255',
            'contact' => 'nullable|array',
            'contact.email' => 'nullable|email|max:255',
            'contact.phone' => 'nullable|string|max:20',
            'settings' => 'nullable|array',
            'settings.paymentMethods' => 'nullable|string', // JSON string
            'settings.currency' => 'nullable|string|max:10',
            'settings.monneroo' => 'nullable|array',
            'settings.monneroo.enabled' => 'nullable|boolean',
            'settings.monneroo.secretKey' => 'nullable|string',
            'settings.monneroo.environment' => 'nullable|string|in:sandbox,production',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Données invalides',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Utilisateur non authentifié'
            ], 401);
        }

        // Vérifier si le slug est déjà utilisé (pour éviter les conflits)
        $existingStoreWithSlug = Store::where('slug', $request->slug)->first();

        if ($existingStoreWithSlug) {
            return response()->json([
                'success' => false,
                'message' => 'Ce nom de boutique est déjà utilisé. Veuillez choisir un autre nom.'
            ], 422);
        }

        try {
            // Traiter le logo si fourni
            $logoPath = null;
            if ($request->hasFile('logo')) {
                $logo = $request->file('logo');
                $logoPath = $logo->store('store-logos', 'public');
            }

            // Préparer les données de la boutique
            $storeData = [
                'id' => Str::uuid(),
                'owner_id' => $user->id,
                'name' => $request->name,
                'slug' => $request->slug,
                'description' => $request->description,
                'logo' => $logoPath,
                'category' => $request->productType ?? 'digital',
                'status' => 'active',
            ];

            // Préparer l'adresse
            $address = [];
            if ($request->input('address.city')) {
                $address['city'] = $request->input('address.city');
            }

            // Préparer le contact
            $contact = [];
            if ($request->input('contact.email')) {
                $contact['email'] = $request->input('contact.email');
            }
            if ($request->input('contact.phone')) {
                $contact['phone'] = $request->input('contact.phone');
            }

            // Préparer les paramètres
            $settings = [];
            
            // Méthodes de paiement
            if ($request->input('settings.paymentMethods')) {
                $settings['paymentMethods'] = json_decode($request->input('settings.paymentMethods'), true);
            }

            // Configuration Monneroo
            if ($request->input('settings.monneroo.enabled')) {
                $settings['monneroo'] = [
                    'enabled' => in_array($request->input('settings.monneroo.enabled'), ['true', '1', true, 1]),
                    'secretKey' => $request->input('settings.monneroo.secretKey'),
                    'environment' => $request->input('settings.monneroo.environment'),
                ];

                // Sauvegarder la configuration Monneroo dans la table dédiée
                if ($request->input('settings.monneroo.secretKey')) {
                    DB::table('moneroo_configs')->updateOrInsert(
                        ['user_id' => $user->id],
                        [
                            'secret_key' => encrypt($request->input('settings.monneroo.secretKey')),
                            'environment' => $request->input('settings.monneroo.environment'),
                            'is_active' => true,
                            'updated_at' => now(),
                        ]
                    );
                }
            }

            // Type de produits et catégories
            if ($request->productType) {
                $settings['productType'] = $request->productType;
            }
            if ($request->productCategories) {
                $settings['productCategories'] = json_decode($request->productCategories, true);
            }

            // Devise
            if ($request->input('settings.currency')) {
                $settings['currency'] = $request->input('settings.currency');
            }

            // Créer la boutique
            $store = Store::create([
                ...$storeData,
                'address' => json_encode($address),
                'contact' => json_encode($contact),
                'settings' => json_encode($settings),
            ]);

            // Mettre à jour le rôle de l'utilisateur en "store_owner"
            $user->update([
                'role' => 'store_owner',
                'updated_at' => now(),
            ]);

            // Envoyer l'email de confirmation
            try {
                $paymentMethods = [];
                if ($settings['paymentMethods'] ?? false) {
                    $paymentMethods = $settings['paymentMethods'];
                }
                if (isset($settings['monneroo']['enabled']) && $settings['monneroo']['enabled']) {
                    $paymentMethods['monneroo'] = $settings['monneroo'];
                }

                Mail::to($user->email)->send(new StoreCreatedMail(
                    $store->name,
                    $store->slug,
                    $paymentMethods,
                    $user->name
                ));

                Log::info("Email de confirmation envoyé à: {$user->email}");
            } catch (\Exception $e) {
                Log::error("Erreur lors de l'envoi de l'email de confirmation: " . $e->getMessage());
                // Ne pas faire échouer la création de boutique si l'email échoue
            }

            Log::info("Boutique créée pour l'utilisateur: {$user->email} - Boutique: {$store->name}");

            return response()->json([
                'success' => true,
                'message' => 'Boutique créée avec succès',
                'data' => [
                    'id' => $store->id,
                    'name' => $store->name,
                    'slug' => $store->slug,
                    'description' => $store->description,
                    'category' => $store->category,
                    'address' => json_decode($store->address, true),
                    'contact' => json_decode($store->contact, true),
                    'settings' => json_decode($store->settings, true),
                    'status' => $store->status,
                    'owner_id' => $store->owner_id,
                    'created_at' => $store->created_at,
                    'updated_at' => $store->updated_at,
                ]
            ], 201);

        } catch (\Exception $e) {
            Log::error("Erreur lors de la création de la boutique: " . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création de la boutique'
            ], 500);
        }
    }

    /**
     * Obtenir les informations de la boutique de l'utilisateur connecté
     */
    public function getMyStore(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Utilisateur non authentifié'
            ], 401);
        }

        $store = Store::where('owner_id', $user->id)->first();

        if (!$store) {
            return response()->json([
                'success' => false,
                'message' => 'Aucune boutique trouvée',
                'has_store' => false
            ], 404);
        }

        return response()->json([
            'success' => true,
            'has_store' => true,
            'store' => [
                'id' => $store->id,
                'name' => $store->name,
                'description' => $store->description,
                'address' => $store->address,
                'phone' => $store->phone,
                'website' => $store->website,
                'status' => $store->status,
                'created_at' => $store->created_at,
                'updated_at' => $store->updated_at,
            ]
        ]);
    }

    /**
     * Mettre à jour les informations de la boutique
     */
    public function updateStore(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'address' => 'nullable|string|max:500',
            'phone' => 'nullable|string|max:20',
            'website' => 'nullable|url|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Données invalides',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Utilisateur non authentifié'
            ], 401);
        }

        $store = Store::where('owner_id', $user->id)->first();

        if (!$store) {
            return response()->json([
                'success' => false,
                'message' => 'Aucune boutique trouvée'
            ], 404);
        }

        try {
            // Mettre à jour la boutique
            $store->update($request->only([
                'name', 'description', 'address', 'phone', 'website'
            ]));

            Log::info("Boutique mise à jour pour l'utilisateur: {$user->email}");

            return response()->json([
                'success' => true,
                'message' => 'Boutique mise à jour avec succès',
                'store' => [
                    'id' => $store->id,
                    'name' => $store->name,
                    'description' => $store->description,
                    'address' => $store->address,
                    'phone' => $store->phone,
                    'website' => $store->website,
                    'status' => $store->status,
                    'created_at' => $store->created_at,
                    'updated_at' => $store->updated_at,
                ]
            ]);

        } catch (\Exception $e) {
            Log::error("Erreur lors de la mise à jour de la boutique: " . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour de la boutique'
            ], 500);
        }
    }
} 
