<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Media extends Model
{
    use HasFactory;

    protected $fillable = [
        'store_id',
        'name',
        'type',
        'size',
        'url',
        'thumbnail',
        'mime_type',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
        'size' => 'integer',
    ];

    /**
     * Get the store that owns the media.
     */
    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }

    /**
     * Get the file type icon.
     */
    public function getTypeIconAttribute(): string
    {
        return match ($this->type) {
            'image' => 'photo',
            'video' => 'video',
            'audio' => 'music',
            default => 'file',
        };
    }

    /**
     * Get the formatted file size.
     */
    public function getFormattedSizeAttribute(): string
    {
        $bytes = $this->size;
        $units = ['B', 'KB', 'MB', 'GB'];
        
        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }
        
        return round($bytes, 2) . ' ' . $units[$i];
    }

    /**
     * Check if the media is an image.
     */
    public function isImage(): bool
    {
        return $this->type === 'image';
    }

    /**
     * Check if the media is a video.
     */
    public function isVideo(): bool
    {
        return $this->type === 'video';
    }

    /**
     * Check if the media is an audio file.
     */
    public function isAudio(): bool
    {
        return $this->type === 'audio';
    }

    /**
     * Check if the media is a document.
     */
    public function isDocument(): bool
    {
        return $this->type === 'document';
    }
} 