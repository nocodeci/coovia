<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class MediaResource extends JsonResource
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
            'store_id' => $this->store_id,
            'name' => $this->name,
            'type' => $this->type,
            'size' => $this->size,
            // ✅ URL du proxy pour l'image originale
            'url' => $this->proxy_url,
            // ✅ URL du proxy pour la miniature
            'thumbnail' => $this->proxy_thumbnail_url,
            // ✅ URLs Cloudflare originales (pour référence)
            'cloudflare_url' => $this->url,
            'cloudflare_thumbnail' => $this->thumbnail,
            'mime_type' => $this->mime_type,
            'metadata' => $this->metadata,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }

}
