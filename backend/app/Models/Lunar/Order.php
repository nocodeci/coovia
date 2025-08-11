<?php

namespace App\Models\Lunar;

use App\Models\User;
use App\Models\Store;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    use HasUuids;

    protected $table = 'lunar_orders';

    protected $fillable = [
        'user_id',
        'store_id',
        'order_number',
        'status',
        'sub_total',
        'tax_total',
        'shipping_total',
        'discount_total',
        'total',
        'meta',
    ];

    protected $casts = [
        'sub_total' => 'decimal:2',
        'tax_total' => 'decimal:2',
        'shipping_total' => 'decimal:2',
        'discount_total' => 'decimal:2',
        'total' => 'decimal:2',
        'meta' => 'array',
    ];

    /**
     * Statuts possibles pour une commande
     */
    const STATUS_PENDING = 'pending';
    const STATUS_PROCESSING = 'processing';
    const STATUS_SHIPPED = 'shipped';
    const STATUS_DELIVERED = 'delivered';
    const STATUS_CANCELLED = 'cancelled';
    const STATUS_REFUNDED = 'refunded';

    /**
     * Relation avec l'utilisateur
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relation avec la boutique
     */
    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }

    /**
     * Relation avec les lignes de commande
     */
    public function orderLines(): HasMany
    {
        return $this->hasMany(OrderLine::class);
    }

    /**
     * Relation avec les adresses
     */
    public function addresses(): HasMany
    {
        return $this->hasMany(OrderAddress::class);
    }

    /**
     * Accesseur pour l'adresse de facturation
     */
    public function getBillingAddressAttribute()
    {
        return $this->addresses()->where('type', 'billing')->first();
    }

    /**
     * Accesseur pour l'adresse de livraison
     */
    public function getShippingAddressAttribute()
    {
        return $this->addresses()->where('type', 'shipping')->first();
    }

    /**
     * Accesseur pour le statut formaté
     */
    public function getStatusLabelAttribute(): string
    {
        return match($this->status) {
            self::STATUS_PENDING => 'En attente',
            self::STATUS_PROCESSING => 'En cours de traitement',
            self::STATUS_SHIPPED => 'Expédiée',
            self::STATUS_DELIVERED => 'Livrée',
            self::STATUS_CANCELLED => 'Annulée',
            self::STATUS_REFUNDED => 'Remboursée',
            default => 'Inconnu',
        };
    }

    /**
     * Scope pour un utilisateur spécifique
     */
    public function scopeByUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Scope pour une boutique spécifique
     */
    public function scopeByStore($query, $storeId)
    {
        return $query->where('store_id', $storeId);
    }

    /**
     * Scope pour un statut spécifique
     */
    public function scopeByStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope pour les commandes récentes
     */
    public function scopeRecent($query, int $days = 30)
    {
        return $query->where('created_at', '>=', now()->subDays($days));
    }

    /**
     * Méthode pour mettre à jour le total de la commande
     */
    public function updateTotals(): void
    {
        $this->sub_total = $this->orderLines()->sum('total');
        $this->total = $this->sub_total + $this->tax_total + $this->shipping_total - $this->discount_total;
        $this->save();
    }

    /**
     * Méthode pour vérifier si la commande peut être annulée
     */
    public function canBeCancelled(): bool
    {
        return in_array($this->status, [
            self::STATUS_PENDING,
            self::STATUS_PROCESSING
        ]);
    }

    /**
     * Méthode pour annuler la commande
     */
    public function cancel(): bool
    {
        if (!$this->canBeCancelled()) {
            return false;
        }

        $this->status = self::STATUS_CANCELLED;
        return $this->save();
    }
}
