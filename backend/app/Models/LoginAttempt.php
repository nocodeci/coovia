<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LoginAttempt extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'email',
        'ip_address',
        'user_agent',
        'successful',
        'failure_reason',
        'mfa_required',
        'mfa_successful',
        'location',
        'device_info',
    ];

    protected $casts = [
        'successful' => 'boolean',
        'mfa_required' => 'boolean',
        'mfa_successful' => 'boolean',
        'location' => 'array',
        'device_info' => 'array',
    ];

    // Relations
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Scopes
    public function scopeSuccessful($query)
    {
        return $query->where('successful', true);
    }

    public function scopeFailed($query)
    {
        return $query->where('successful', false);
    }

    public function scopeRecent($query, $minutes = 60)
    {
        return $query->where('created_at', '>', now()->subMinutes($minutes));
    }

    public function scopeByIp($query, $ip)
    {
        return $query->where('ip_address', $ip);
    }
}
