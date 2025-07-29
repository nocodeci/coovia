<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StoreResource extends JsonResource
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
            'slug' => $this->slug,
            'description' => $this->description,
            'category' => $this->category,
            'status' => $this->status,
            'is_active' => $this->is_active,
            'logo' => $this->logo,
            'banner' => $this->banner,
            'contact' => $this->contact ? (is_string($this->contact) ? json_decode($this->contact, true) : $this->contact) : [
                'email' => '',
                'phone' => '',
                'website' => ''
            ],
            'address' => $this->address ? (is_string($this->address) ? json_decode($this->address, true) : $this->address) : [
                'street' => '',
                'city' => '',
                'state' => '',
                'country' => 'Côte d\'Ivoire',
                'postal_code' => ''
            ],
            'settings' => $this->settings ? (is_string($this->settings) ? json_decode($this->settings, true) : $this->settings) : [
                'currency' => 'XOF',
                'language' => 'fr',
                'timezone' => 'Africa/Abidjan',
                'tax_rate' => 18
            ],
            'owner_id' => $this->owner_id,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'stats' => [
                'total_products' => 0,
                'total_orders' => 0,
                'total_customers' => 0,
                'total_revenue' => 0,
                'rating' => 0,
                'review_count' => 0
            ]
        ];
    }
}
