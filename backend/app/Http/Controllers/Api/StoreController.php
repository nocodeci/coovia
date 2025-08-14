<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Store;
use App\Mail\StoreCreatedMail;
use App\Services\SubdomainService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class StoreController extends Controller
{
    /**
     * Récupérer une boutique par son slug (route publique)
     */
    public function getBySlug($slug)
    {
        try {
            $store = Store::where('slug', $slug)
                ->where('status', 'active')
                ->first();

            if (!$store) {
                return response()->json([
                    'success' => false,
                    'message' => 'Boutique non trouvée'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $store->id,
                    'name' => $store->name,
                    'description' => $store->description,
                    'slug' => $store->slug,
                    'logo' => $store->logo,
                    'banner' => $store->banner,
                    'theme' => $store->theme,
                    'status' => $store->status,
                    'created_at' => $store->created_at,
                    'updated_at' => $store->updated_at,
                ]
            ]);

        } catch (\Exception $e) {
            Log::error("Erreur lors de la récupération de la boutique par slug: " . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération de la boutique'
            ], 500);
        }
    }

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
    public function store(Request $request)
    {
        // Gérer les données multipart/form-data
        $data = $request->all();
        
        // Traiter les données imbriquées pour multipart/form-data
        if ($request->has('address[city]')) {
            $data['address'] = ['city' => $request->input('address[city]')];
        }
        
        if ($request->has('contact[email]')) {
            $data['contact'] = ['email' => $request->input('contact[email]')];
        }
        
        if ($request->has('contact[phone]')) {
            if (!isset($data['contact'])) $data['contact'] = [];
            $data['contact']['phone'] = $request->input('contact[phone]');
        }
        
        if ($request->has('settings[paymentMethods]')) {
            $data['settings'] = ['paymentMethods' => $request->input('settings[paymentMethods]')];
        }
        
        if ($request->has('settings[currency]')) {
            if (!isset($data['settings'])) $data['settings'] = [];
            $data['settings']['currency'] = $request->input('settings[currency]');
        }
        
        if ($request->has('settings[monneroo][enabled]')) {
            if (!isset($data['settings'])) $data['settings'] = [];
            $data['settings']['monneroo'] = [
                'enabled' => $request->input('settings[monneroo][enabled]') === '1',
                'secretKey' => $request->input('settings[monneroo][secretKey]'),
                'environment' => $request->input('settings[monneroo][environment]'),
            ];
        }
        
        $validator = Validator::make($data, [
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
        $existingStoreWithSlug = Store::where('slug', $data['slug'])->first();

        if ($existingStoreWithSlug) {
            return response()->json([
                'success' => false,
                'message' => 'Ce nom de boutique est déjà utilisé. Veuillez choisir un autre nom.'
            ], 422);
        }

        try {
            // Traiter le logo si fourni
            $logoUrl = null;
            if ($request->hasFile('logo')) {
                // Utiliser le stockage local par défaut
                $logo = $request->file('logo');
                $logoUrl = $logo->store('store-logos', 'public');
                
                // Alternative : utiliser le disk par défaut configuré
                // $logoUrl = $logo->store('store-logos');
            }

            // Préparer les données de la boutique
            $storeData = [
                'id' => Str::uuid(),
                'owner_id' => $user->id,
                'name' => $data['name'],
                'slug' => $data['slug'],
                'description' => $data['description'] ?? '',
                'logo' => $logoUrl,
                'category' => $data['productType'] ?? 'digital',
                'status' => 'active',
            ];

            // Préparer l'adresse
            $address = $data['address'] ?? [];

            // Préparer le contact
            $contact = $data['contact'] ?? [];

            // Préparer les paramètres
            $settings = $data['settings'] ?? [];
            
            // Méthodes de paiement
            if (isset($settings['paymentMethods']) && is_string($settings['paymentMethods'])) {
                $settings['paymentMethods'] = json_decode($settings['paymentMethods'], true);
            }

            // Configuration Monneroo
            if (isset($settings['monneroo']['enabled'])) {
                $settings['monneroo'] = [
                    'enabled' => in_array($settings['monneroo']['enabled'], ['true', '1', true, 1]),
                    'secretKey' => $settings['monneroo']['secretKey'] ?? null,
                    'environment' => $settings['monneroo']['environment'] ?? null,
                ];

                // Sauvegarder la configuration Monneroo dans la table dédiée
                // Temporairement commenté pour déboguer
                /*
                if ($request->input('settings.monneroo.secretKey')) {
                    DB::table('moneroo_configs')->updateOrInsert(
                        ['user_id' => $user->id],
                        [
                            'secret_key' => $request->input('settings.monneroo.secretKey'), // Temporairement sans encryption
                            'environment' => $request->input('settings.monneroo.environment'),
                            'is_active' => true,
                            'updated_at' => now(),
                        ]
                    );
                }
                */
            }

            // Type de produits et catégories
            if (isset($data['productType'])) {
                $settings['productType'] = $data['productType'];
            }
            if (isset($data['productCategories']) && is_string($data['productCategories'])) {
                $settings['productCategories'] = json_decode($data['productCategories'], true);
            }

            // Devise
            if (isset($settings['currency'])) {
                $settings['currency'] = $settings['currency'];
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

            // ✅ CRÉER AUTOMATIQUEMENT LE SOUS-DOMAINE
            try {
                $subdomainService = new SubdomainService();
                
                // Valider le slug pour le sous-domaine
                $validation = $subdomainService->validateSlug($store->slug);
                if (!$validation['valid']) {
                    Log::warning("Slug invalide pour sous-domaine: " . implode(', ', $validation['errors']));
                } else {
                    // Créer le sous-domaine
                    $subdomainCreated = $subdomainService->createSubdomain($store->slug);
                    if ($subdomainCreated) {
                        Log::info("Sous-domaine créé avec succès: {$store->slug}.wozif.store");
                    } else {
                        Log::error("Échec de la création du sous-domaine pour: {$store->slug}");
                    }
                }
            } catch (\Exception $e) {
                Log::error("Erreur lors de la création du sous-domaine: " . $e->getMessage());
                // Ne pas faire échouer la création de boutique si le sous-domaine échoue
            }

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
            // Traiter le logo si fourni
            $updateData = $request->only([
                'name', 'description', 'address', 'phone', 'website'
            ]);
            
            if ($request->hasFile('logo')) {
                // Utiliser le stockage local
                $logo = $request->file('logo');
                $updateData['logo'] = $logo->store('store-logos', 'public');
            }
            
            // Mettre à jour la boutique
            $store->update($updateData);

            Log::info("Boutique mise à jour pour l'utilisateur: {$user->email}");

            return response()->json([
                'success' => true,
                'message' => 'Boutique mise à jour avec succès',
                'store' => [
                    'id' => $store->id,
                    'name' => $store->name,
                    'description' => $store->description,
                    'logo' => $store->logo,
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

    /**
     * Vérifier l'état d'un sous-domaine
     */
    public function checkSubdomain(Request $request, $slug)
    {
        try {
            $subdomainService = new SubdomainService();
            
            // Valider le slug
            $validation = $subdomainService->validateSlug($slug);
            if (!$validation['valid']) {
                return response()->json([
                    'success' => false,
                    'message' => 'Slug invalide',
                    'errors' => $validation['errors']
                ], 422);
            }
            
            // Vérifier si le slug existe déjà en base de données
            $existingStore = Store::where('slug', $slug)->first();
            if ($existingStore) {
                return response()->json([
                    'success' => true,
                    'data' => [
                        'slug' => $slug,
                        'exists' => true,
                        'url' => $subdomainService->getSubdomainUrl($slug),
                        'valid' => $validation['valid'],
                        'message' => 'Ce nom de boutique est déjà utilisé'
                    ]
                ]);
            }
            
            // Vérifier si le sous-domaine existe dans Vercel
            $subdomainExists = $subdomainService->subdomainExists($slug);
            $url = $subdomainService->getSubdomainUrl($slug);
            
            return response()->json([
                'success' => true,
                'data' => [
                    'slug' => $slug,
                    'exists' => $subdomainExists,
                    'url' => $url,
                    'valid' => $validation['valid'],
                    'message' => $subdomainExists ? 'Ce nom de boutique est déjà utilisé' : 'Ce nom de boutique est disponible'
                ]
            ]);
            
        } catch (\Exception $e) {
            Log::error("Erreur lors de la vérification du sous-domaine: " . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la vérification du sous-domaine'
            ], 500);
        }
    }

    /**
     * Supprimer une boutique et son sous-domaine
     */
    public function destroy(Request $request, $storeId)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Utilisateur non authentifié'
            ], 401);
        }

        $store = Store::where('id', $storeId)
            ->where('owner_id', $user->id)
            ->first();

        if (!$store) {
            return response()->json([
                'success' => false,
                'message' => 'Boutique introuvable'
            ], 404);
        }

        try {
            // ✅ SUPPRIMER LE LOGO (stockage local)
            try {
                if ($store->logo) {
                    // Supprimer le fichier du stockage local
                    Storage::disk('public')->delete($store->logo);
                    Log::info("Logo supprimé avec succès du stockage local pour: {$store->slug}");
                }
            } catch (\Exception $e) {
                Log::error("Erreur lors de la suppression du logo: " . $e->getMessage());
                // Continuer même si la suppression du logo échoue
            }

            // ✅ SUPPRIMER LE SOUS-DOMAINE
            try {
                $subdomainService = new SubdomainService();
                $subdomainDeleted = $subdomainService->deleteSubdomain($store->slug);
                
                if ($subdomainDeleted) {
                    Log::info("Sous-domaine supprimé avec succès: {$store->slug}.wozif.store");
                } else {
                    Log::warning("Échec de la suppression du sous-domaine pour: {$store->slug}");
                }
            } catch (\Exception $e) {
                Log::error("Erreur lors de la suppression du sous-domaine: " . $e->getMessage());
                // Continuer même si la suppression du sous-domaine échoue
            }

            // Supprimer la boutique
            $store->delete();

            // Remettre l'utilisateur en rôle 'user' s'il n'a plus de boutique
            $remainingStores = Store::where('owner_id', $user->id)->count();
            if ($remainingStores === 0) {
                $user->update([
                    'role' => 'user',
                    'updated_at' => now(),
                ]);
            }

            Log::info("Boutique supprimée pour l'utilisateur: {$user->email} - Boutique: {$store->name}");

            return response()->json([
                'success' => true,
                'message' => 'Boutique supprimée avec succès'
            ]);

        } catch (\Exception $e) {
            Log::error("Erreur lors de la suppression de la boutique: " . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression de la boutique'
            ], 500);
        }
    }
} 
