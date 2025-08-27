<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Str;
use Laravel\Scout\Searchable;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Product extends Model
{
    use HasFactory, SoftDeletes, HasUuids;
    // use Searchable; // Temporairement désactivé pour les tests

    protected $fillable = [
        'store_id',
        'name',
        'slug',
        'description',
        'short_description',
        'sku',
        'barcode',
        'price',
        'compare_price',
        'cost_price',
        'sale_price',
        'weight',
        'height',
        'width',
        'length',
        'stock_quantity',
        'low_stock_threshold',
        'min_stock_level',
        'is_active',
        'is_featured',
        'is_taxable',
        'tax_rate',
        'meta_title',
        'meta_description',
        'meta_keywords',
        'category', // Colonne string dans la table
        'category_id', // Pour la relation
        'brand_id',
        'vendor_id',
        'published_at',
        'views_count',
        'sales_count',
        'rating_average',
        'rating_count',
        'images',
        'files',
        'tags',
        'inventory',
        'attributes',
        'seo',
        'status',
        'approval_status',
        'approved_at',
        'rejection_reason',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'compare_price' => 'decimal:2',
        'cost_price' => 'decimal:2',
        'weight' => 'decimal:2',
        'height' => 'decimal:2',
        'width' => 'decimal:2',
        'length' => 'decimal:2',
        'stock_quantity' => 'integer',
        'low_stock_threshold' => 'integer',
        'min_stock_level' => 'integer',
        'is_active' => 'boolean',
        'is_featured' => 'boolean',
        'is_taxable' => 'boolean',
        'tax_rate' => 'decimal:2',
        'published_at' => 'datetime',
        'views_count' => 'integer',
        'sales_count' => 'integer',
        'rating_average' => 'decimal:1',
        'rating_count' => 'integer',
        // Casts pour les colonnes JSON
        'images' => 'array',
        'files' => 'array',
        'tags' => 'array',
        'inventory' => 'array',
        'attributes' => 'array',
        'seo' => 'array',
    ];

    protected $dates = [
        'published_at',
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    protected $appends = [
        'formatted_price',
        'formatted_compare_price',
        'discount_percentage',
        'is_in_stock',
        'is_low_stock',
        'stock_status',
        'primary_image',
        'gallery_images',
    ];

    /**
     * Boot the model
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($product) {
            if (empty($product->slug)) {
                $product->slug = static::generateUniqueSlug($product->name);
            }
            
            if (empty($product->sku)) {
                $product->sku = 'SKU-' . Str::random(8);
            }
        });

        static::updating(function ($product) {
            if ($product->isDirty('name') && empty($product->slug)) {
                $product->slug = static::generateUniqueSlug($product->name);
            }
        });
    }

    /**
     * Générer un slug unique
     */
    protected static function generateUniqueSlug(string $name): string
    {
        $slug = Str::slug($name);
        $originalSlug = $slug;
        $counter = 1;
        
        // Vérifier si le slug existe déjà et ajouter un suffixe si nécessaire
        while (static::where('slug', $slug)->exists()) {
            $slug = $originalSlug . '-' . $counter;
            $counter++;
        }
        
        return $slug;
    }

    /**
     * Relations
     */
    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class);
    }

    public function vendor(): BelongsTo
    {
        return $this->belongsTo(Vendor::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class)->orderBy('order');
    }

    public function variants(): HasMany
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function attributes(): BelongsToMany
    {
        return $this->belongsToMany(ProductAttribute::class, 'product_attribute_values')
                    ->withPivot('value')
                    ->withTimestamps();
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(ProductReview::class);
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function wishlists(): BelongsToMany
    {
        return $this->belongsToMany(Wishlist::class, 'wishlist_items')
                    ->withTimestamps();
    }

    /**
     * Scopes de requête
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true)
                     ->where('published_at', '<=', now());
    }

    public function scopeFeatured(Builder $query): Builder
    {
        return $query->where('is_featured', true);
    }

    public function scopeInStock(Builder $query): Builder
    {
        return $query->where('stock_quantity', '>', 0);
    }

    public function scopeLowStock(Builder $query): Builder
    {
        return $query->where('stock_quantity', '<=', DB::raw('low_stock_threshold'))
                     ->where('stock_quantity', '>', 0);
    }

    public function scopeOutOfStock(Builder $query): Builder
    {
        return $query->where('stock_quantity', '<=', 0);
    }

    public function scopeByStore(Builder $query, $storeId): Builder
    {
        return $query->where('store_id', $storeId);
    }

    public function scopeByCategory(Builder $query, $categoryId): Builder
    {
        return $query->where('category_id', $categoryId);
    }

    public function scopeByBrand(Builder $query, $brandId): Builder
    {
        return $query->where('brand_id', $brandId);
    }

    public function scopeByPriceRange(Builder $query, $minPrice, $maxPrice): Builder
    {
        if ($minPrice) {
            $query->where('price', '>=', $minPrice);
        }
        
        if ($maxPrice) {
            $query->where('price', '<=', $maxPrice);
        }
        
        return $query;
    }

    public function scopeByRating(Builder $query, $minRating): Builder
    {
        return $query->where('rating_average', '>=', $minRating);
    }

    public function scopePopular(Builder $query): Builder
    {
        return $query->orderBy('views_count', 'desc');
    }

    public function scopeBestSelling(Builder $query): Builder
    {
        return $query->orderBy('sales_count', 'desc');
    }

    public function scopeNewest(Builder $query): Builder
    {
        return $query->orderBy('created_at', 'desc');
    }

    public function scopeOldest(Builder $query): Builder
    {
        return $query->orderBy('created_at', 'asc');
    }

    public function scopePriceLowToHigh(Builder $query): Builder
    {
        return $query->orderBy('price', 'asc');
    }

    public function scopePriceHighToLow(Builder $query): Builder
    {
        return $query->orderBy('price', 'desc');
    }

    /**
     * Accesseurs
     */
    public function getFormattedPriceAttribute(): string
    {
        return number_format($this->price, 2) . ' €';
    }

    public function getFormattedComparePriceAttribute(): ?string
    {
        return $this->compare_price ? number_format($this->compare_price, 2) . ' €' : null;
    }

    public function getDiscountPercentageAttribute(): ?int
    {
        if ($this->compare_price && $this->compare_price > $this->price) {
            return round((($this->compare_price - $this->price) / $this->compare_price) * 100);
        }
        
        return null;
    }

    public function getIsInStockAttribute(): bool
    {
        return $this->stock_quantity > 0;
    }

    public function getIsLowStockAttribute(): bool
    {
        return $this->stock_quantity > 0 && $this->stock_quantity <= $this->low_stock_threshold;
    }

    public function getStockStatusAttribute(): string
    {
        if ($this->stock_quantity <= 0) {
            return 'out_of_stock';
        }
        
        if ($this->is_low_stock) {
            return 'low_stock';
        }
        
        return 'in_stock';
    }

    public function getPrimaryImageAttribute(): ?string
    {
        $primaryImage = $this->images()->where('is_primary', true)->first();
        return $primaryImage ? $primaryImage->url : null;
    }

    public function getGalleryImagesAttribute(): array
    {
        return $this->images()->where('is_primary', false)->pluck('url')->toArray();
    }

    /**
     * Méthodes
     */
    public function incrementViews(): void
    {
        $this->increment('views_count');
    }

    public function incrementSales(int $quantity = 1): void
    {
        $this->increment('sales_count', $quantity);
        $this->decrement('stock_quantity', $quantity);
    }

    public function updateRating(): void
    {
        $reviews = $this->reviews();
        $averageRating = $reviews->avg('rating');
        $ratingCount = $reviews->count();
        
        $this->update([
            'rating_average' => round($averageRating, 1),
            'rating_count' => $ratingCount
        ]);
    }

    public function isAvailable(): bool
    {
        return $this->is_active && $this->published_at <= now() && $this->stock_quantity > 0;
    }

    public function hasDiscount(): bool
    {
        return $this->compare_price && $this->compare_price > $this->price;
    }

    public function getFinalPrice(): float
    {
        return $this->price;
    }

    public function getTaxAmount(): float
    {
        if (!$this->is_taxable || $this->tax_rate <= 0) {
            return 0;
        }
        
        return ($this->price * $this->tax_rate) / 100;
    }

    public function getPriceWithTax(): float
    {
        return $this->price + $this->getTaxAmount();
    }

    /**
     * Configuration Scout pour la recherche
     */
    public function toSearchableArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'short_description' => $this->short_description,
            'sku' => $this->sku,
            'barcode' => $this->barcode,
            'category_name' => $this->category?->name,
            'brand_name' => $this->brand?->name,
            'vendor_name' => $this->vendor?->name,
            'store_name' => $this->store?->name,
            'is_active' => $this->is_active,
            'is_featured' => $this->is_featured,
            'price' => $this->price,
            'stock_quantity' => $this->stock_quantity,
        ];
    }

    /**
     * Événements
     */
    protected static function booted()
    {
        static::deleted(function ($product) {
            // Supprimer les images associées (si c'est un tableau de chemins)
            if (is_array($product->images)) {
                foreach ($product->images as $imagePath) {
                    // Ici on pourrait supprimer les fichiers physiques si nécessaire
                    // Storage::delete($imagePath);
                }
            }
            
            // Supprimer les variantes
            $product->variants()->delete();
            
            // Supprimer les attributs
            $product->attributes()->detach();
        });
    }
}
