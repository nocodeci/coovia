<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class MfaToken extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'token',
        'action',
        'expires_at',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
    ];

    /**
     * Relation avec l'utilisateur
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Vérifier si le token est expiré
     */
    public function isExpired(): bool
    {
        return $this->expires_at->isPast();
    }

    /**
     * Scope pour les tokens non expirés
     */
    public function scopeValid($query)
    {
        return $query->where('expires_at', '>', Carbon::now());
    }
}
