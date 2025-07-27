<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\SoftDeletes;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'avatar',
        'role',
        'email_verified_at',
        'phone_verified_at',
        'mfa_enabled',
        'mfa_secret',
        'backup_codes',
        'last_login_at',
        'login_attempts',
        'locked_until',
        'supabase_user_id',
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'mfa_secret',
        'backup_codes',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'phone_verified_at' => 'datetime',
        'password' => 'hashed',
        'mfa_enabled' => 'boolean',
        'backup_codes' => 'array',
        'last_login_at' => 'datetime',
        'locked_until' => 'datetime',
        'login_attempts' => 'integer',
    ];

    protected $dates = [
        'deleted_at',
        'email_verified_at',
        'phone_verified_at',
        'last_login_at',
        'locked_until',
    ];

    // Relations
    public function stores()
    {
        return $this->hasMany(Store::class, 'owner_id');
    }

    public function mfaTokens()
    {
        return $this->hasMany(MfaToken::class);
    }

    public function loginAttempts()
    {
        return $this->hasMany(LoginAttempt::class);
    }

    // Méthodes MFA
    public function enableMfa()
    {
        $this->mfa_enabled = true;
        $this->save();
    }

    public function disableMfa()
    {
        $this->mfa_enabled = false;
        $this->mfa_secret = null;
        $this->backup_codes = null;
        $this->save();
    }

    public function generateMfaSecret()
    {
        $secret = $this->generateRandomSecret();
        $this->mfa_secret = encrypt($secret);
        $this->save();
        return $secret;
    }

    public function getMfaSecret()
    {
        return $this->mfa_secret ? decrypt($this->mfa_secret) : null;
    }

    public function generateBackupCodes()
    {
        $codes = [];
        for ($i = 0; $i < 10; $i++) {
            $codes[] = strtoupper(substr(md5(uniqid()), 0, 8));
        }
        $this->backup_codes = $codes;
        $this->save();
        return $codes;
    }

    public function useBackupCode($code)
    {
        $codes = $this->backup_codes ?? [];
        $index = array_search(strtoupper($code), $codes);

        if ($index !== false) {
            unset($codes[$index]);
            $this->backup_codes = array_values($codes);
            $this->save();
            return true;
        }

        return false;
    }

    public function isLocked()
    {
        return $this->locked_until && $this->locked_until->isFuture();
    }

    public function incrementLoginAttempts()
    {
        $this->login_attempts = ($this->login_attempts ?? 0) + 1;

        if ($this->login_attempts >= 5) {
            $this->locked_until = now()->addMinutes(30);
        }

        $this->save();
    }

    public function resetLoginAttempts()
    {
        $this->login_attempts = 0;
        $this->locked_until = null;
        $this->last_login_at = now();
        $this->save();
    }

    private function generateRandomSecret($length = 32)
    {
        $characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
        $secret = '';
        for ($i = 0; $i < $length; $i++) {
            $secret .= $characters[random_int(0, strlen($characters) - 1)];
        }
        return $secret;
    }

    // Scopes
    public function scopeVerified($query)
    {
        return $query->whereNotNull('email_verified_at');
    }

    public function scopeWithMfa($query)
    {
        return $query->where('mfa_enabled', true);
    }

    public function scopeNotLocked($query)
    {
        return $query->where(function ($q) {
            $q->whereNull('locked_until')
              ->orWhere('locked_until', '<', now());
        });
    }
}
