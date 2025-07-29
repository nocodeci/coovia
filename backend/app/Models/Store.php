<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Store extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'slug',
        'description',
        'logo',
        'banner',
        'status',
        'category',
        'address',
        'contact',
        'settings',
        'owner_id',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'address' => 'array',
        'contact' => 'array',
        'settings' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the user that owns the store.
     */
    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    /**
     * Get the products for the store.
     */
    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    /**
     * Get the orders for the store.
     */
    public function orders(): HasMany
    {
        return $this->hasMany(Orders::class);
    }

    /**
     * Get the customers for the store.
     */
    public function customers(): HasMany
    {
        return $this->hasMany(Customers::class);
    }

    /**
     * Scope to get only active stores.
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Get the store's full address as a string.
     */
    public function getFullAddressAttribute(): string
    {
        if (!$this->address) {
            return '';
        }

        $parts = [];
        if (isset($this->address['street'])) $parts[] = $this->address['street'];
        if (isset($this->address['city'])) $parts[] = $this->address['city'];
        if (isset($this->address['country'])) $parts[] = $this->address['country'];

        return implode(', ', $parts);
    }

    /**
     * Get the store's primary contact email.
     */
    public function getContactEmailAttribute(): ?string
    {
        return $this->contact['email'] ?? null;
    }

    /**
     * Get the store's primary contact phone.
     */
    public function getContactPhoneAttribute(): ?string
    {
        return $this->contact['phone'] ?? null;
    }

    /**
     * Get the store's statistics.
     */
    public function getStatsAttribute(): array
    {
        $totalProducts = $this->products()->count();
        $totalOrders = $this->orders()->count();
        $totalRevenue = $this->orders()->where('status', 'completed')->sum('total_amount');
        $totalCustomers = $this->customers()->count();
        
        // Calculer le taux de conversion (commandes / visiteurs * 100)
        $conversionRate = $totalCustomers > 0 ? ($totalOrders / $totalCustomers) * 100 : 0;
        
        // Calculer la valeur moyenne des commandes
        $averageOrderValue = $totalOrders > 0 ? $totalRevenue / $totalOrders : 0;

        return [
            'totalProducts' => $totalProducts,
            'totalOrders' => $totalOrders,
            'totalRevenue' => $totalRevenue,
            'totalCustomers' => $totalCustomers,
            'conversionRate' => round($conversionRate, 1),
            'averageOrderValue' => round($averageOrderValue, 0),
        ];
    }
}
