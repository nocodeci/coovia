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
        Schema::create('store_media', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('store_id'); // VARCHAR pour correspondre à la table stores
            $table->string('name');
            $table->string('type'); // image, video, document, audio
            $table->bigInteger('size');
            $table->string('url');
            $table->string('thumbnail')->nullable();
            $table->string('mime_type');
            $table->json('metadata')->nullable(); // Pour stocker des métadonnées supplémentaires
            $table->timestamps();

            $table->foreign('store_id')->references('id')->on('stores')->onDelete('cascade');
            $table->index(['store_id', 'type']);
            $table->index(['store_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('store_media');
    }
};
