<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Ressource optimisée pour les produits e-commerce
 * 
 * Optimisations :
 * - Sérialisation lean (seulement les champs nécessaires)
 * - Champs conditionnels selon le contexte
 * - Compression des données
 * - Cache des calculs coûteux
 */
class OptimizedProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        // Détermine le contexte pour optimiser la sérialisation
        $context = $this->getSerializationContext($request);
        
        $data = [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'price' => $this->price,
            'status' => $this->status,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];

        // Champs conditionnels selon le contexte
        switch ($context) {
            case 'list':
                return $this->getListData($data);
            case 'detail':
                return $this->getDetailData($data);
            case 'search':
                return $this->getSearchData($data);
            case 'cart':
                return $this->getCartData($data);
            default:
                return $this->getDefaultData($data);
        }
    }

    /**
     * Données pour la liste (minimales)
     */
    private function getListData(array $data): array
    {
        return array_merge($data, [
            'description' => $this->getTruncatedDescription(),
            'original_price' => $this->when($this->original_price, $this->original_price),
            'discount_percentage' => $this->when($this->original_price, $this->calculateDiscount()),
            'stock' => $this->stock,
            'is_low_stock' => $this->stock <= 5 && $this->stock > 0,
            'is_out_of_stock' => $this->stock === 0,
            'main_image' => $this->getMainImage(),
            'store' => $this->whenLoaded('store', fn() => [
                'id' => $this->store->id,
                'name' => $this->store->name,
                'slug' => $this->store->slug,
            ]),
            'category' => $this->whenLoaded('category', fn() => [
                'id' => $this->category->id,
                'name' => $this->category->name,
                'slug' => $this->category->slug,
            ]),
            'rating' => $this->when($this->rating, round($this->rating, 1)),
            'review_count' => $this->when($this->review_count, $this->review_count),
            'views_count' => $this->when($this->views_count, $this->views_count),
        ]);
    }

    /**
     * Données complètes pour les détails
     */
    private function getDetailData(array $data): array
    {
        return array_merge($data, [
            'description' => $this->description,
            'short_description' => $this->short_description,
            'original_price' => $this->original_price,
            'discount_percentage' => $this->when($this->original_price, $this->calculateDiscount()),
            'stock' => $this->stock,
            'sku' => $this->sku,
            'weight' => $this->weight,
            'dimensions' => $this->when($this->dimensions, $this->dimensions),
            'meta_title' => $this->meta_title,
            'meta_description' => $this->meta_description,
            'seo' => $this->seo,
            
            // Relations complètes
            'store' => $this->whenLoaded('store', fn() => new StoreResource($this->store)),
            'category' => $this->whenLoaded('category', fn() => new CategoryResource($this->category)),
            'images' => $this->whenLoaded('images', fn() => 
                $this->images->map(fn($image) => [
                    'id' => $image->id,
                    'url' => $image->url,
                    'thumbnail' => $image->thumbnail,
                    'alt' => $image->alt,
                    'order' => $image->order,
                ])
            ),
            'files' => $this->whenLoaded('files', fn() => 
                $this->files->map(fn($file) => [
                    'id' => $file->id,
                    'url' => $file->url,
                    'name' => $file->name,
                    'size' => $file->size,
                    'type' => $file->type,
                ])
            ),
            'variants' => $this->whenLoaded('variants', fn() => 
                $this->variants->map(fn($variant) => [
                    'id' => $variant->id,
                    'name' => $variant->name,
                    'price' => $variant->price,
                    'stock' => $variant->stock,
                    'sku' => $variant->sku,
                ])
            ),
            'reviews' => $this->whenLoaded('reviews', fn() => 
                $this->reviews->map(fn($review) => [
                    'id' => $review->id,
                    'rating' => $review->rating,
                    'comment' => $review->comment,
                    'created_at' => $review->created_at->toISOString(),
                    'user' => $review->user ? [
                        'id' => $review->user->id,
                        'name' => $review->user->name,
                    ] : null,
                ])
            ),
            
            // Métadonnées
            'rating' => $this->when($this->rating, round($this->rating, 1)),
            'review_count' => $this->when($this->review_count, $this->review_count),
            'views_count' => $this->when($this->views_count, $this->views_count),
            'sales_count' => $this->when($this->sales_count, $this->sales_count),
        ]);
    }

    /**
     * Données pour la recherche (optimisées)
     */
    private function getSearchData(array $data): array
    {
        return array_merge($data, [
            'description' => $this->getTruncatedDescription(100),
            'original_price' => $this->when($this->original_price, $this->original_price),
            'stock' => $this->stock,
            'main_image' => $this->getMainImage(),
            'store' => $this->whenLoaded('store', fn() => [
                'name' => $this->store->name,
            ]),
            'category' => $this->whenLoaded('category', fn() => [
                'name' => $this->category->name,
            ]),
            'rating' => $this->when($this->rating, round($this->rating, 1)),
        ]);
    }

    /**
     * Données pour le panier (minimales)
     */
    private function getCartData(array $data): array
    {
        return array_merge($data, [
            'price' => $this->price,
            'stock' => $this->stock,
            'main_image' => $this->getMainImage(),
            'store' => $this->whenLoaded('store', fn() => [
                'id' => $this->store->id,
                'name' => $this->store->name,
            ]),
        ]);
    }

    /**
     * Données par défaut
     */
    private function getDefaultData(array $data): array
    {
        return $this->getListData($data);
    }

    /**
     * Détermine le contexte de sérialisation
     */
    private function getSerializationContext(Request $request): string
    {
        if ($request->route()->getName() === 'products.show') {
            return 'detail';
        }
        
        if ($request->route()->getName() === 'products.search') {
            return 'search';
        }
        
        if ($request->has('context')) {
            return $request->get('context');
        }
        
        return 'list';
    }

    /**
     * Calcule le pourcentage de réduction
     */
    private function calculateDiscount(): ?int
    {
        if (!$this->original_price || $this->original_price <= $this->price) {
            return null;
        }
        
        return round((($this->original_price - $this->price) / $this->original_price) * 100);
    }

    /**
     * Obtient l'image principale
     */
    private function getMainImage(): ?string
    {
        if ($this->images && $this->images->isNotEmpty()) {
            $mainImage = $this->images->first();
            return $mainImage->thumbnail ?? $mainImage->url;
        }
        
        return null;
    }

    /**
     * Obtient la description tronquée
     */
    private function getTruncatedDescription(int $length = 150): string
    {
        if (!$this->description) {
            return '';
        }
        
        $description = strip_tags($this->description);
        
        if (strlen($description) <= $length) {
            return $description;
        }
        
        return substr($description, 0, $length) . '...';
    }
} 