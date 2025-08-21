<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'first_name',
        'last_name',
        'display_name',
        'bio',
        'avatar',
        'cover_image',
        'website',
        'company',
        'job_title',
        'location',
        'timezone',
        'language',
        'currency',
        'social_links',
        'preferences',
        'address',
        'birth_date',
        'gender',
        'nationality',
        'id_number',
        'tax_id',
        'is_verified',
        'verified_at',
    ];

    protected $casts = [
        'social_links' => 'array',
        'preferences' => 'array',
        'address' => 'array',
        'birth_date' => 'date',
        'is_verified' => 'boolean',
        'verified_at' => 'datetime',
    ];

    /**
     * Get the user that owns the profile.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the full name of the user.
     */
    public function getFullNameAttribute(): string
    {
        $parts = [];
        if ($this->first_name) $parts[] = $this->first_name;
        if ($this->last_name) $parts[] = $this->last_name;
        
        return implode(' ', $parts) ?: $this->user->name ?? 'Utilisateur';
    }

    /**
     * Get the display name (preferred name or full name).
     */
    public function getDisplayNameAttribute($value): string
    {
        return $value ?: $this->full_name;
    }

    /**
     * Get the user's age.
     */
    public function getAgeAttribute(): ?int
    {
        if (!$this->birth_date) {
            return null;
        }
        
        return $this->birth_date->age;
    }

    /**
     * Get the avatar URL.
     */
    public function getAvatarUrlAttribute(): string
    {
        if ($this->avatar) {
            return $this->avatar;
        }
        
        // Return default avatar
        return 'https://ui-avatars.com/api/?name=' . urlencode($this->full_name) . '&color=7C3AED&background=EBF4FF';
    }

    /**
     * Get the cover image URL.
     */
    public function getCoverImageUrlAttribute(): ?string
    {
        return $this->cover_image;
    }

    /**
     * Get social links.
     */
    public function getSocialLinksAttribute($value): array
    {
        return json_decode($value, true) ?: [];
    }

    /**
     * Get user preferences.
     */
    public function getPreferencesAttribute($value): array
    {
        return json_decode($value, true) ?: [
            'notifications' => [
                'email' => true,
                'sms' => false,
                'push' => true,
            ],
            'privacy' => [
                'profile_visible' => true,
                'show_email' => false,
                'show_phone' => false,
            ],
            'theme' => 'light',
        ];
    }

    /**
     * Get address as string.
     */
    public function getAddressStringAttribute(): string
    {
        if (!$this->address) {
            return '';
        }

        $parts = [];
        if (isset($this->address['street'])) $parts[] = $this->address['street'];
        if (isset($this->address['city'])) $parts[] = $this->address['city'];
        if (isset($this->address['state'])) $parts[] = $this->address['state'];
        if (isset($this->address['country'])) $parts[] = $this->address['country'];
        if (isset($this->address['postal_code'])) $parts[] = $this->address['postal_code'];

        return implode(', ', $parts);
    }

    /**
     * Verify the user profile.
     */
    public function verify(): void
    {
        $this->update([
            'is_verified' => true,
            'verified_at' => now(),
        ]);
    }

    /**
     * Unverify the user profile.
     */
    public function unverify(): void
    {
        $this->update([
            'is_verified' => false,
            'verified_at' => null,
        ]);
    }

    /**
     * Update social links.
     */
    public function updateSocialLinks(array $links): void
    {
        $this->update(['social_links' => $links]);
    }

    /**
     * Update preferences.
     */
    public function updatePreferences(array $preferences): void
    {
        $this->update(['preferences' => $preferences]);
    }

    /**
     * Update address.
     */
    public function updateAddress(array $address): void
    {
        $this->update(['address' => $address]);
    }
}
