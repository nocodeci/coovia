<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'storeId' => $this->store_id,
            'name' => $this->name,
            'description' => $this->description,
            'price' => $this->price,
            'comparePrice' => $this->compare_price,
            'images' => $this->images,
            'category' => $this->category,
            'tags' => $this->tags,
            'status' => $this->status,
            'inventory' => $this->inventory,
            'seo' => $this->seo,
            'createdAt' => $this->created_at->toISOString(),
            'updatedAt' => $this->updated_at->toISOString(),
            'store' => new StoreResource($this->whenLoaded('store')),
        ];
    }
}
