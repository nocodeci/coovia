<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Str;

class Vendor extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'user_id',
        'business_name',
        'slug',
        'description',
        'logo',
        'banner',
        'status',
        'verification_status',
        'contact_info',
        'address',
        'business_info',
        'payment_info',
        'settings',
        'commission_rate',
        'auto_approve_products',
        'featured',
        'verified_at',
        'last_activity_at',
    ];

    protected $casts = [
        'contact_info' => 'array',
        'address' => 'array',
        'business_info' => 'array',
        'payment_info' => 'array',
        'settings' => 'array',
        'commission_rate' => 'decimal:2',
        'auto_approve_products' => 'boolean',
        'featured' => 'boolean',
        'verified_at' => 'datetime',
        'last_activity_at' => 'datetime',
    ];

    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($vendor) {
            if (empty($vendor->slug)) {
                $vendor->slug = Str::slug($vendor->business_name);
            }
        });
    }

    // Relations
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function stores(): HasMany
    {
        return $this->hasMany(Store::class);
    }

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    // Scopes
    public function scopeActive(Builder $query): void
    {
        $query->where('status', 'active');
    }

    public function scopeVerified(Builder $query): void
    {
        $query->where('verification_status', 'verified');
    }

    public function scopeFeatured(Builder $query): void
    {
        $query->where('featured', true);
    }

    public function scopePending(Builder $query): void
    {
        $query->where('status', 'pending');
    }

    // Accessors
    public function getFullAddressAttribute(): string
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

    public function getContactEmailAttribute(): ?string
    {
        return $this->contact_info['email'] ?? null;
    }

    public function getContactPhoneAttribute(): ?string
    {
        return $this->contact_info['phone'] ?? null;
    }

    public function getWebsiteAttribute(): ?string
    {
        return $this->contact_info['website'] ?? null;
    }

    // Méthodes
    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    public function isVerified(): bool
    {
        return $this->verification_status === 'verified';
    }

    public function isFeatured(): bool
    {
        return $this->featured === true;
    }

    public function canAutoApproveProducts(): bool
    {
        return $this->auto_approve_products && $this->isVerified();
    }

    public function getStatsAttribute(): array
    {
        $totalProducts = $this->products()->count();
        $activeProducts = $this->products()->where('status', 'active')->count();
        $totalOrders = $this->orders()->count();
        $completedOrders = $this->orders()->where('status', 'delivered')->count();
        $totalRevenue = $this->orders()->where('status', 'delivered')->sum('total_amount');
        $totalCommission = $this->orders()->where('status', 'delivered')->sum('commission_amount');

        return [
            'totalProducts' => $totalProducts,
            'activeProducts' => $activeProducts,
            'totalOrders' => $totalOrders,
            'completedOrders' => $completedOrders,
            'totalRevenue' => $totalRevenue,
            'totalCommission' => $totalCommission,
            'conversionRate' => $totalOrders > 0 ? ($completedOrders / $totalOrders) * 100 : 0,
            'averageOrderValue' => $completedOrders > 0 ? $totalRevenue / $completedOrders : 0,
        ];
    }

    public function updateLastActivity(): void
    {
        $this->update(['last_activity_at' => now()]);
    }

    public function approve(): void
    {
        $this->update([
            'status' => 'active',
            'verification_status' => 'verified',
            'verified_at' => now(),
        ]);
    }

    public function reject(string $reason = null): void
    {
        $this->update([
            'status' => 'inactive',
            'verification_status' => 'rejected',
            'rejection_reason' => $reason,
        ]);
    }

    public function suspend(string $reason = null): void
    {
        $this->update([
            'status' => 'suspended',
            'rejection_reason' => $reason,
        ]);
    }
}
