<?php

namespace App\Services;

use App\Models\User;
use Auth0\SDK\Auth0;
use Auth0\SDK\Configuration\SdkConfiguration;
use Auth0\SDK\Token\Verifier;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Exception;

class Auth0Service
{
    private $auth0;
    private $verifier;

    public function __construct()
    {
        $config = new SdkConfiguration([
            'domain' => config('auth0.domain'),
            'clientId' => config('auth0.client_id'),
            'clientSecret' => config('auth0.client_secret'),
            'audience' => config('auth0.audience'),
        ]);

        $this->auth0 = new Auth0($config);
        
        $this->verifier = new Verifier(
            $config,
            cache: Cache::store(),
            algorithm: config('auth0.jwt_algorithm'),
            leeway: config('auth0.jwt_leeway')
        );
    }

    /**
     * Valider un token Auth0
     */
    public function validateToken(string $token): array
    {
        try {
            $decoded = $this->verifier->verify($token);
            
            return [
                'valid' => true,
                'payload' => $decoded,
                'user_id' => $decoded['sub'] ?? null,
                'email' => $decoded['email'] ?? null,
                'name' => $decoded['name'] ?? null,
            ];
        } catch (Exception $e) {
            Log::error('Auth0 token validation failed', [
                'error' => $e->getMessage(),
                'token' => substr($token, 0, 50) . '...'
            ]);
            
            return [
                'valid' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Synchroniser un utilisateur Auth0 avec la base de données
     */
    public function syncUser(array $auth0Data): User
    {
        $auth0Id = $auth0Data['auth0_id'];
        $email = $auth0Data['email'];
        $name = $auth0Data['name'];

        // Chercher l'utilisateur par Auth0 ID
        $user = User::where('auth0_id', $auth0Id)->first();

        if (!$user) {
            // Chercher par email
            $user = User::where('email', $email)->first();
            
            if ($user) {
                // Mettre à jour avec l'Auth0 ID
                $user->update(['auth0_id' => $auth0Id]);
            } else {
                // Créer un nouvel utilisateur
                $user = User::create([
                    'name' => $name,
                    'email' => $email,
                    'auth0_id' => $auth0Id,
                    'role' => 'user', // Rôle par défaut
                    'email_verified_at' => now(), // Auth0 vérifie déjà l'email
                ]);
            }
        } else {
            // Mettre à jour les informations
            $user->update([
                'name' => $name,
                'email' => $email,
            ]);
        }

        return $user;
    }

    /**
     * Récupérer les informations utilisateur depuis Auth0
     */
    public function getUserInfo(string $token): array
    {
        try {
            $response = $this->auth0->getUser($token);
            return $response ?? [];
        } catch (Exception $e) {
            Log::error('Failed to get Auth0 user info', [
                'error' => $e->getMessage()
            ]);
            return [];
        }
    }

    /**
     * Vérifier si un utilisateur a un rôle spécifique
     */
    public function hasRole(User $user, string $role): bool
    {
        $roleMapping = config('auth0.role_mapping', []);
        $mappedRole = $roleMapping[$role] ?? $role;
        
        return $user->role === $mappedRole;
    }

    /**
     * Assigner un rôle à un utilisateur
     */
    public function assignRole(User $user, string $role): bool
    {
        $roleMapping = config('auth0.role_mapping', []);
        $mappedRole = $roleMapping[$role] ?? $role;
        
        $user->update(['role' => $mappedRole]);
        return true;
    }

    /**
     * Récupérer les permissions d'un utilisateur
     */
    public function getUserPermissions(User $user): array
    {
        // Ici vous pouvez implémenter la logique pour récupérer
        // les permissions depuis Auth0 ou votre base de données
        $permissions = [];
        
        switch ($user->role) {
            case 'admin':
                $permissions = ['*']; // Toutes les permissions
                break;
            case 'vendor':
                $permissions = [
                    'store:read',
                    'store:write',
                    'product:read',
                    'product:write',
                    'order:read',
                    'order:write',
                ];
                break;
            case 'customer':
                $permissions = [
                    'store:read',
                    'product:read',
                    'order:read',
                    'order:create',
                ];
                break;
        }
        
        return $permissions;
    }

    /**
     * Vérifier si un utilisateur a une permission spécifique
     */
    public function hasPermission(User $user, string $permission): bool
    {
        $permissions = $this->getUserPermissions($user);
        
        return in_array('*', $permissions) || in_array($permission, $permissions);
    }
}
