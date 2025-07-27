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
        return $this->hasMany(Order::class);
    }

    /**
     * Get the customers for the store.
     */
    public function customers(): HasMany
    {
        return $this->hasMany(Customer::class);
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
}
