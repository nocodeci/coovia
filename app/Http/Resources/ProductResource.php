<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'price' => $this->price,
            'compare_price' => $this->compare_price,
            'sale_price' => $this->sale_price ?? null,
            'sku' => $this->sku ?? null,
            'stock_quantity' => $this->stock_quantity ?? 0,
            'min_stock_level' => $this->min_stock_level ?? 0,
            'images' => $this->images ?? [],
            'files' => $this->files ?? [],
            'category' => $this->category,
            'tags' => $this->tags ?? [],
            'status' => $this->status,
            'inventory' => $this->inventory ?? [
                'quantity' => $this->stock_quantity ?? 0,
                'low_stock_threshold' => $this->min_stock_level ?? 0,
            ],
            'attributes' => $this->attributes ?? [],
            'seo' => $this->seo ?? [],
            'store_id' => $this->store_id,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
