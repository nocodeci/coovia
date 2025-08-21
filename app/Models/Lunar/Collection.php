<?php

namespace App\Models\Lunar;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Collection extends Model
{
    use HasUuids;

    protected $table = 'lunar_collections';

    protected $fillable = [
        'name',
        'slug',
        'description',
        'is_active',
        'meta',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'meta' => 'array',
    ];

    /**
     * Relation avec les produits
     */
    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'lunar_collection_product');
    }

    /**
     * Scope pour les collections actives
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope pour une collection par slug
     */
    public function scopeBySlug($query, string $slug)
    {
        return $query->where('slug', $slug);
    }
}
