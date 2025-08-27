<?php

namespace App\Services;

use App\Models\User;
use App\Models\MfaToken;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Carbon\Carbon;

class MfaService
{
    /**
     * Générer un secret MFA pour l'utilisateur
     */
    public function generateSecret(User $user): string
    {
        $secret = $this->generateRandomSecret();

        $user->update([
            'mfa_secret' => encrypt($secret)
        ]);

        return $secret;
    }

    /**
     * Générer une URL de QR code
     */
    public function generateQrCode(User $user, string $secret): string
    {
        $appName = config('app.name', 'Laravel App');
        $email = $user->email;

        return "otpauth://totp/{$appName}:{$email}?secret={$secret}&issuer={$appName}";
    }

    /**
     * Activer MFA pour l'utilisateur
     */
    public function enableMfa(User $user, string $code): array
    {
        if (!$this->verifyCode($user, $code)) {
            throw new \Exception('Code de vérification invalide');
        }

        $user->update(['mfa_enabled' => true]);

        return $user->generateBackupCodes();
    }

    /**
     * Désactiver MFA pour l'utilisateur
     */
    public function disableMfa(User $user, string $password): void
    {
        if (!Hash::check($password, $user->password)) {
            throw new \Exception('Mot de passe incorrect');
        }

        $user->update([
            'mfa_enabled' => false,
            'mfa_secret' => null,
            'backup_codes' => null,
        ]);
    }

    /**
     * Vérifier un code MFA
     */
    public function verifyCode(User $user, string $code): bool
    {
        if (!$user->mfa_secret) {
            return false;
        }

        $secret = decrypt($user->mfa_secret);

        // Simulation de vérification TOTP (remplacez par une vraie implémentation)
        return $this->verifyTotpCode($secret, $code);
    }

    /**
     * Vérifier un code de récupération
     */
    public function verifyBackupCode(User $user, string $code): bool
    {
        $backupCodes = $user->backup_codes ?? [];

        foreach ($backupCodes as $index => $hashedCode) {
            if (Hash::check(strtoupper($code), $hashedCode)) {
                // Supprimer le code utilisé
                unset($backupCodes[$index]);
                $user->update(['backup_codes' => array_values($backupCodes)]);
                return true;
            }
        }

        return false;
    }

    /**
     * Générer un token MFA temporaire
     */
    public function generateMfaToken(User $user, string $action): string
    {
        $token = Str::random(64);

        MfaToken::create([
            'user_id' => $user->id,
            'token' => Hash::make($token),
            'action' => $action,
            'expires_at' => Carbon::now()->addMinutes(10),
        ]);

        return $token;
    }

    /**
     * Vérifier un token MFA
     */
    public function verifyMfaToken(string $token, string $action): ?User
    {
        $mfaTokens = MfaToken::where('action', $action)
            ->where('expires_at', '>', Carbon::now())
            ->get();

        foreach ($mfaTokens as $mfaToken) {
            if (Hash::check($token, $mfaToken->token)) {
                $user = $mfaToken->user;
                $mfaToken->delete(); // Supprimer le token utilisé
                return $user;
            }
        }

        return null;
    }

    /**
     * Générer un secret aléatoire
     */
    private function generateRandomSecret(int $length = 32): string
    {
        $characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
        $secret = '';

        for ($i = 0; $i < $length; $i++) {
            $secret .= $characters[random_int(0, strlen($characters) - 1)];
        }

        return $secret;
    }

    /**
     * Vérifier un code TOTP (simulation)
     */
    private function verifyTotpCode(string $secret, string $code): bool
    {
        // Simulation simple - dans un vrai projet, utilisez une bibliothèque TOTP
        // comme pragmarx/google2fa
        return strlen($code) === 6 && is_numeric($code);
    }
}
