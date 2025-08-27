<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StoreResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'logo' => $this->logo,
            'banner' => $this->banner,
            'status' => $this->status,
            'category' => $this->category,
            'address' => $this->address,
            'contact' => $this->contact,
            'settings' => $this->settings,
            'stats' => $this->stats,
            'createdAt' => $this->created_at->toISOString(),
            'updatedAt' => $this->updated_at->toISOString(),
            'ownerId' => $this->owner_id,
            'owner' => new UserResource($this->whenLoaded('owner')),
            'products' => ProductResource::collection($this->whenLoaded('products')),
            'orders' => OrderResource::collection($this->whenLoaded('orders')),
            'customers' => CustomerResource::collection($this->whenLoaded('customers')),
        ];
    }
}
