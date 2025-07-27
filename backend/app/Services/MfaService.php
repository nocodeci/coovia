<?php

namespace App\Services;

use App\Models\User;
use App\Models\MfaToken;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use PragmaRX\Google2FA\Google2FA;

class MfaService
{
    protected $google2fa;

    public function __construct()
    {
        $this->google2fa = new Google2FA();
    }

    /**
     * Générer un secret MFA pour l'utilisateur
     */
    public function generateSecret(User $user)
    {
        $secret = $this->google2fa->generateSecretKey();
        $user->mfa_secret = encrypt($secret);
        $user->save();

        return $secret;
    }

    /**
     * Générer un QR Code pour l'application d'authentification
     */
    public function generateQrCode(User $user, $secret = null)
    {
        if (!$secret) {
            $secret = $user->getMfaSecret();
        }

        if (!$secret) {
            throw new \Exception('Aucun secret MFA trouvé pour cet utilisateur');
        }

        $companyName = config('app.name');
        $companyEmail = $user->email;

        return $this->google2fa->getQRCodeUrl(
            $companyName,
            $companyEmail,
            $secret
        );
    }

    /**
     * Vérifier un code TOTP
     */
    public function verifyCode(User $user, $code)
    {
        $secret = $user->getMfaSecret();

        if (!$secret) {
            return false;
        }

        // Vérifier le code TOTP
        $valid = $this->google2fa->verifyKey($secret, $code, 2); // 2 fenêtres de tolérance

        if ($valid) {
            // Empêcher la réutilisation du même code
            $cacheKey = "mfa_code_{$user->id}_{$code}";
            if (Cache::has($cacheKey)) {
                return false; // Code déjà utilisé
            }

            Cache::put($cacheKey, true, 90); // Cache pendant 90 secondes
            return true;
        }

        return false;
    }

    /**
     * Générer un token MFA temporaire
     */
    public function generateMfaToken(User $user, $type = 'login')
    {
        // Supprimer les anciens tokens
        $user->mfaTokens()->where('type', $type)->delete();

        $token = Str::random(32);

        $mfaToken = MfaToken::create([
            'user_id' => $user->id,
            'token' => hash('sha256', $token),
            'type' => $type,
            'expires_at' => now()->addMinutes(10),
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);

        return $token;
    }

    /**
     * Vérifier un token MFA
     */
    public function verifyMfaToken($token, $type = 'login')
    {
        $hashedToken = hash('sha256', $token);

        $mfaToken = MfaToken::where('token', $hashedToken)
            ->where('type', $type)
            ->valid()
            ->first();

        if ($mfaToken) {
            $mfaToken->markAsUsed();
            return $mfaToken->user;
        }

        return null;
    }

    /**
     * Envoyer un code MFA par SMS (si configuré)
     */
    public function sendSmsCode(User $user)
    {
        if (!$user->phone) {
            throw new \Exception('Aucun numéro de téléphone configuré');
        }

        $code = random_int(100000, 999999);

        // Stocker le code temporairement
        Cache::put("sms_mfa_{$user->id}", $code, 300); // 5 minutes

        // Ici, vous intégreriez votre service SMS
        // Par exemple: Twilio, Nexmo, etc.

        return $code; // En développement, retourner le code
    }

    /**
     * Vérifier un code SMS
     */
    public function verifySmsCode(User $user, $code)
    {
        $storedCode = Cache::get("sms_mfa_{$user->id}");

        if ($storedCode && $storedCode == $code) {
            Cache::forget("sms_mfa_{$user->id}");
            return true;
        }

        return false;
    }

    /**
     * Activer MFA pour un utilisateur
     */
    public function enableMfa(User $user, $code)
    {
        if (!$this->verifyCode($user, $code)) {
            throw new \Exception('Code de vérification invalide');
        }

        $user->enableMfa();
        $backupCodes = $user->generateBackupCodes();

        return $backupCodes;
    }

    /**
     * Désactiver MFA pour un utilisateur
     */
    public function disableMfa(User $user, $password)
    {
        if (!password_verify($password, $user->password)) {
            throw new \Exception('Mot de passe incorrect');
        }

        $user->disableMfa();

        // Supprimer tous les tokens MFA
        $user->mfaTokens()->delete();
    }

    /**
     * Vérifier si l'utilisateur peut utiliser un code de récupération
     */
    public function verifyBackupCode(User $user, $code)
    {
        return $user->useBackupCode($code);
    }
}
