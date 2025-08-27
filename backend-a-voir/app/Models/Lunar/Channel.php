<?php

namespace App\Models\Lunar;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Channel extends Model
{
    use HasUuids;

    protected $table = 'lunar_channels';

    protected $fillable = [
        'name',
        'handle',
        'url',
        'default',
    ];

    protected $casts = [
        'default' => 'boolean',
    ];

    /**
     * Relation avec les produits
     */
    public function products(): HasMany
    {
        return $this->hasMany(Product::class, 'channel_id');
    }

    /**
     * Relation avec les commandes
     */
    public function orders(): HasMany
    {
        return $this->hasMany(Order::class, 'channel_id');
    }

    /**
     * Scope pour le canal par défaut
     */
    public function scopeDefault($query)
    {
        return $query->where('default', true);
    }

    /**
     * Scope pour un handle spécifique
     */
    public function scopeByHandle($query, string $handle)
    {
        return $query->where('handle', $handle);
    }
}
