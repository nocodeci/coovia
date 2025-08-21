<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('store_media_files', function (Blueprint $table) {
            $table->id();
            $table->string('store_id');
            $table->string('file_id')->unique();
            $table->string('name');
            $table->string('type'); // image, video, document, audio
            $table->bigInteger('size');
            $table->text('url');
            $table->text('thumbnail_url')->nullable();
            $table->string('mime_type');
            $table->text('cloudflare_path');
            $table->json('metadata')->nullable();
            $table->timestamps();
            
            $table->index(['store_id']);
            $table->index(['type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('store_media_files');
    }
};
