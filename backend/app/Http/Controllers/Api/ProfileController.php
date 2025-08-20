<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\UserProfile;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    /**
     * Get current user's profile
     */
    public function show(): JsonResponse
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Utilisateur non authentifié'
                ], 401);
            }

            $profile = $user->profile;
            
            if (!$profile) {
                // Create profile if it doesn't exist
                $profile = UserProfile::create([
                    'user_id' => $user->id,
                    'first_name' => $user->name,
                    'display_name' => $user->name,
                ]);
            }
            
            return response()->json([
                'success' => true,
                'data' => [
                    'profile' => $profile,
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'phone' => $user->phone,
                        'role' => $user->role,
                        'email_verified_at' => $user->email_verified_at,
                        'phone_verified_at' => $user->phone_verified_at,
                        'mfa_enabled' => $user->mfa_enabled,
                        'last_login_at' => $user->last_login_at,
                        'is_active' => $user->is_active,
                    ]
                ],
                'message' => 'Profil récupéré avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération du profil',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update current user's profile
     */
    public function update(Request $request): JsonResponse
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Utilisateur non authentifié'
                ], 401);
            }

            $validator = Validator::make($request->all(), [
                'first_name' => 'nullable|string|max:50',
                'last_name' => 'nullable|string|max:50',
                'display_name' => 'nullable|string|max:100',
                'bio' => 'nullable|string|max:500',
                'website' => 'nullable|url|max:255',
                'company' => 'nullable|string|max:100',
                'job_title' => 'nullable|string|max:100',
                'location' => 'nullable|string|max:100',
                'timezone' => 'nullable|string|max:50',
                'language' => 'nullable|string|max:10',
                'currency' => 'nullable|string|max:3',
                'birth_date' => 'nullable|date|before:today',
                'gender' => 'nullable|in:male,female,other,prefer_not_to_say',
                'nationality' => 'nullable|string|max:50',
                'id_number' => 'nullable|string|max:50',
                'tax_id' => 'nullable|string|max:50',
                'social_links' => 'nullable|array',
                'social_links.linkedin' => 'nullable|url',
                'social_links.twitter' => 'nullable|url',
                'social_links.facebook' => 'nullable|url',
                'social_links.instagram' => 'nullable|url',
                'social_links.youtube' => 'nullable|url',
                'preferences' => 'nullable|array',
                'address' => 'nullable|array',
                'address.street' => 'nullable|string|max:255',
                'address.city' => 'nullable|string|max:100',
                'address.state' => 'nullable|string|max:100',
                'address.country' => 'nullable|string|max:100',
                'address.postal_code' => 'nullable|string|max:20',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Données invalides',
                    'errors' => $validator->errors()
                ], 422);
            }

            $profile = $user->profile;
            
            if (!$profile) {
                $profile = new UserProfile();
                $profile->user_id = $user->id;
            }

            // Update profile fields
            $profile->fill($request->only([
                'first_name', 'last_name', 'display_name', 'bio', 'website',
                'company', 'job_title', 'location', 'timezone', 'language',
                'currency', 'birth_date', 'gender', 'nationality', 'id_number',
                'tax_id', 'social_links', 'preferences', 'address'
            ]));

            $profile->save();
            
            return response()->json([
                'success' => true,
                'data' => $profile,
                'message' => 'Profil mis à jour avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour du profil',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Upload avatar
     */
    public function uploadAvatar(Request $request): JsonResponse
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Utilisateur non authentifié'
                ], 401);
            }

            $validator = Validator::make($request->all(), [
                'avatar' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Données invalides',
                    'errors' => $validator->errors()
                ], 422);
            }

            $profile = $user->profile;
            
            if (!$profile) {
                $profile = new UserProfile();
                $profile->user_id = $user->id;
            }

            // Delete old avatar if exists
            if ($profile->avatar && Storage::disk('cloudflare')->exists($profile->avatar)) {
                Storage::disk('cloudflare')->delete($profile->avatar);
            }

            // Upload new avatar
            $file = $request->file('avatar');
            $fileName = 'avatars/' . $user->id . '/' . time() . '_' . $file->getClientOriginalName();
            
            $path = Storage::disk('cloudflare')->putFileAs(
                dirname($fileName),
                $file,
                basename($fileName)
            );

            $profile->avatar = $path;
            $profile->save();
            
            return response()->json([
                'success' => true,
                'data' => [
                    'avatar_url' => $profile->avatar_url,
                    'avatar_path' => $path
                ],
                'message' => 'Avatar mis à jour avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour de l\'avatar',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Upload cover image
     */
    public function uploadCoverImage(Request $request): JsonResponse
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Utilisateur non authentifié'
                ], 401);
            }

            $validator = Validator::make($request->all(), [
                'cover_image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:5120'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Données invalides',
                    'errors' => $validator->errors()
                ], 422);
            }

            $profile = $user->profile;
            
            if (!$profile) {
                $profile = new UserProfile();
                $profile->user_id = $user->id;
            }

            // Delete old cover image if exists
            if ($profile->cover_image && Storage::disk('cloudflare')->exists($profile->cover_image)) {
                Storage::disk('cloudflare')->delete($profile->cover_image);
            }

            // Upload new cover image
            $file = $request->file('cover_image');
            $fileName = 'covers/' . $user->id . '/' . time() . '_' . $file->getClientOriginalName();
            
            $path = Storage::disk('cloudflare')->putFileAs(
                dirname($fileName),
                $file,
                basename($fileName)
            );

            $profile->cover_image = $path;
            $profile->save();
            
            return response()->json([
                'success' => true,
                'data' => [
                    'cover_image_url' => $profile->cover_image_url,
                    'cover_image_path' => $path
                ],
                'message' => 'Image de couverture mise à jour avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour de l\'image de couverture',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update preferences
     */
    public function updatePreferences(Request $request): JsonResponse
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Utilisateur non authentifié'
                ], 401);
            }

            $validator = Validator::make($request->all(), [
                'preferences' => 'required|array',
                'preferences.notifications' => 'nullable|array',
                'preferences.notifications.email' => 'boolean',
                'preferences.notifications.sms' => 'boolean',
                'preferences.notifications.push' => 'boolean',
                'preferences.privacy' => 'nullable|array',
                'preferences.privacy.profile_visible' => 'boolean',
                'preferences.privacy.show_email' => 'boolean',
                'preferences.privacy.show_phone' => 'boolean',
                'preferences.theme' => 'nullable|string|in:light,dark,auto',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Données invalides',
                    'errors' => $validator->errors()
                ], 422);
            }

            $profile = $user->profile;
            
            if (!$profile) {
                $profile = new UserProfile();
                $profile->user_id = $user->id;
            }

            $profile->preferences = $request->input('preferences');
            $profile->save();
            
            return response()->json([
                'success' => true,
                'data' => $profile->preferences,
                'message' => 'Préférences mises à jour avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour des préférences',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get user profile by ID (public)
     */
    public function showPublic($userId): JsonResponse
    {
        try {
            $profile = UserProfile::where('user_id', $userId)->first();
            
            if (!$profile) {
                return response()->json([
                    'success' => false,
                    'message' => 'Profil non trouvé'
                ], 404);
            }

            // Return only public information
            $publicData = [
                'display_name' => $profile->display_name,
                'bio' => $profile->bio,
                'avatar_url' => $profile->avatar_url,
                'cover_image_url' => $profile->cover_image_url,
                'website' => $profile->website,
                'company' => $profile->company,
                'job_title' => $profile->job_title,
                'location' => $profile->location,
                'social_links' => $profile->social_links,
                'is_verified' => $profile->is_verified,
            ];
            
            return response()->json([
                'success' => true,
                'data' => $publicData,
                'message' => 'Profil public récupéré avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération du profil',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
