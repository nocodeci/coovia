<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;

class SubdomainService
{
    private $vercelToken;
    private $projectId;
    private $domain;

    public function __construct()
    {
        $this->vercelToken = config('services.vercel.token');
        $this->projectId = config('services.vercel.project_id');
        $this->domain = config('services.vercel.domain', 'wozif.store');
    }

    /**
     * Créer automatiquement un sous-domaine pour une boutique
     */
    public function createSubdomain(string $slug): bool
    {
        try {
            Log::info("Création du sous-domaine pour le slug: {$slug}");

            // Vérifier si le sous-domaine existe déjà
            if ($this->subdomainExists($slug)) {
                Log::info("Le sous-domaine {$slug}.{$this->domain} existe déjà");
                return true;
            }

            // Créer le sous-domaine via l'API Vercel
            $response = Http::withHeaders([
                'Authorization' => "Bearer {$this->vercelToken}",
                'Content-Type' => 'application/json',
            ])->post("https://api.vercel.com/v1/projects/{$this->projectId}/domains", [
                'name' => "{$slug}.{$this->domain}",
                'projectId' => $this->projectId,
            ]);

            if ($response->successful()) {
                Log::info("Sous-domaine créé avec succès: {$slug}.{$this->domain}");
                return true;
            } else {
                Log::error("Erreur lors de la création du sous-domaine: " . $response->body());
                return false;
            }

        } catch (\Exception $e) {
            Log::error("Exception lors de la création du sous-domaine: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Vérifier si un sous-domaine existe
     */
    public function subdomainExists(string $slug): bool
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => "Bearer {$this->vercelToken}",
            ])->get("https://api.vercel.com/v1/projects/{$this->projectId}/domains/{$slug}.{$this->domain}");

            return $response->successful();

        } catch (\Exception $e) {
            Log::error("Erreur lors de la vérification du sous-domaine: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Supprimer un sous-domaine
     */
    public function deleteSubdomain(string $slug): bool
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => "Bearer {$this->vercelToken}",
            ])->delete("https://api.vercel.com/v1/projects/{$this->projectId}/domains/{$slug}.{$this->domain}");

            if ($response->successful()) {
                Log::info("Sous-domaine supprimé avec succès: {$slug}.{$this->domain}");
                return true;
            } else {
                Log::error("Erreur lors de la suppression du sous-domaine: " . $response->body());
                return false;
            }

        } catch (\Exception $e) {
            Log::error("Exception lors de la suppression du sous-domaine: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Obtenir l'URL complète du sous-domaine
     */
    public function getSubdomainUrl(string $slug): string
    {
        return "https://{$slug}.{$this->domain}";
    }

    /**
     * Valider un slug pour un sous-domaine
     */
    public function validateSlug(string $slug): array
    {
        $errors = [];

        // Vérifier la longueur
        if (strlen($slug) < 3) {
            $errors[] = 'Le slug doit contenir au moins 3 caractères';
        }

        if (strlen($slug) > 63) {
            $errors[] = 'Le slug ne peut pas dépasser 63 caractères';
        }

        // Vérifier les caractères autorisés
        if (!preg_match('/^[a-z0-9-]+$/', $slug)) {
            $errors[] = 'Le slug ne peut contenir que des lettres minuscules, chiffres et tirets';
        }

        // Vérifier qu'il ne commence pas par un tiret
        if (str_starts_with($slug, '-')) {
            $errors[] = 'Le slug ne peut pas commencer par un tiret';
        }

        // Vérifier qu'il ne se termine pas par un tiret
        if (str_ends_with($slug, '-')) {
            $errors[] = 'Le slug ne peut pas se terminer par un tiret';
        }

        // Mots réservés
        $reservedWords = [
            'www', 'api', 'admin', 'mail', 'ftp', 'blog', 'shop', 'store', 
            'app', 'dev', 'test', 'staging', 'prod', 'cdn', 'static',
            'wozif', 'wizof', 'coovia', 'nocodeci', 'my'
        ];

        if (in_array(strtolower($slug), $reservedWords)) {
            $errors[] = 'Ce nom est réservé et ne peut pas être utilisé';
        }

        return [
            'valid' => empty($errors),
            'errors' => $errors
        ];
    }
}
