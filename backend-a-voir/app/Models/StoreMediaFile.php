<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StoreMediaFile extends Model
{
    use HasFactory;

    protected $fillable = [
        'store_id',
        'file_id',
        'name',
        'type',
        'size',
        'url',
        'thumbnail_url',
        'mime_type',
        'cloudflare_path',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
        'size' => 'integer',
    ];

    /**
     * Get the store that owns the media file.
     */
    public function store()
    {
        return $this->belongsTo(Store::class, 'store_id', 'id');
    }
}
