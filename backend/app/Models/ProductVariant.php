<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Builder;

class ProductVariant extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'product_id',
        'sku',
        'name',
        'description',
        'price',
        'compare_price',
        'sale_price',
        'stock_quantity',
        'min_stock_level',
        'track_stock',
        'is_active',
        'attributes',
        'images',
        'files',
        'weight',
        'length',
        'width',
        'height',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'compare_price' => 'decimal:2',
        'sale_price' => 'decimal:2',
        'stock_quantity' => 'integer',
        'min_stock_level' => 'integer',
        'track_stock' => 'boolean',
        'is_active' => 'boolean',
        'attributes' => 'array',
        'images' => 'array',
        'files' => 'array',
        'weight' => 'decimal:2',
        'length' => 'decimal:2',
        'width' => 'decimal:2',
        'height' => 'decimal:2',
    ];

    // Relations
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    // Scopes
    public function scopeActive(Builder $query): void
    {
        $query->where('is_active', true);
    }

    public function scopeInStock(Builder $query): void
    {
        $query->where('stock_quantity', '>', 0);
    }

    public function scopeLowStock(Builder $query): void
    {
        $query->where('stock_quantity', '<=', 'min_stock_level');
    }

    // Accessors
    public function getFinalPriceAttribute(): float
    {
        if ($this->sale_price && $this->sale_price > 0) {
            return $this->sale_price;
        }
        return $this->price;
    }

    public function getDiscountPercentageAttribute(): ?float
    {
        if ($this->compare_price && $this->compare_price > $this->price) {
            return round((($this->compare_price - $this->price) / $this->compare_price) * 100, 2);
        }
        return null;
    }

    public function getIsOnSaleAttribute(): bool
    {
        return $this->sale_price && $this->sale_price > 0 && $this->sale_price < $this->price;
    }

    public function getIsOutOfStockAttribute(): bool
    {
        return $this->track_stock && $this->stock_quantity <= 0;
    }

    public function getIsLowStockAttribute(): bool
    {
        return $this->track_stock && $this->stock_quantity <= $this->min_stock_level;
    }

    public function getStockStatusAttribute(): string
    {
        if ($this->isOutOfStock) {
            return 'out_of_stock';
        }
        if ($this->isLowStock) {
            return 'low_stock';
        }
        return 'in_stock';
    }

    // Méthodes
    public function hasStock(int $quantity = 1): bool
    {
        if (!$this->track_stock) {
            return true;
        }
        return $this->stock_quantity >= $quantity;
    }

    public function decreaseStock(int $quantity = 1): bool
    {
        if (!$this->track_stock) {
            return true;
        }

        if ($this->stock_quantity < $quantity) {
            return false;
        }

        $this->decrement('stock_quantity', $quantity);
        return true;
    }

    public function increaseStock(int $quantity = 1): void
    {
        if ($this->track_stock) {
            $this->increment('stock_quantity', $quantity);
        }
    }

    public function getAttributeValue(string $key): mixed
    {
        return $this->attributes[$key] ?? null;
    }

    public function setAttributeValue(string $key, mixed $value): void
    {
        $attributes = $this->attributes ?? [];
        $attributes[$key] = $value;
        $this->attributes = $attributes;
    }

    public function getMainImageAttribute(): ?string
    {
        if (empty($this->images)) {
            return null;
        }
        return $this->images[0] ?? null;
    }

    public function getDimensionsAttribute(): array
    {
        return [
            'length' => $this->length,
            'width' => $this->width,
            'height' => $this->height,
        ];
    }

    public function getVolumeAttribute(): ?float
    {
        if ($this->length && $this->width && $this->height) {
            return $this->length * $this->width * $this->height;
        }
        return null;
    }
}
