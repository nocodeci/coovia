<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Store extends Model
{
    use HasFactory;

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

    protected $casts = [
        'address' => 'array',
        'contact' => 'array',
        'settings' => 'array',
    ];

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function customers(): HasMany
    {
        return $this->hasMany(Customer::class);
    }

    public function getStatsAttribute()
    {
        return [
            'totalProducts' => $this->products()->count(),
            'totalOrders' => $this->orders()->count(),
            'totalRevenue' => $this->orders()->where('payment_status', 'paid')->sum('total'),
            'totalCustomers' => $this->customers()->count(),
            'rating' => 4.5, // À calculer selon vos besoins
            'reviewCount' => 0, // À implémenter
            'averageOrderValue' => $this->orders()->where('payment_status', 'paid')->avg('total'),
            'monthlyGrowth' => 0, // À calculer
        ];
    }
}
