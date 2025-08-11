<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Supprimer directement la table media existante
        Schema::dropIfExists('media');
        
        // Recréer la table media avec le bon type d'id et les colonnes Lunar
        Schema::create('media', function (Blueprint $table) {
            $table->id(); // bigint auto-increment
            $table->string('store_id'); // character varying pour correspondre à stores.id
            $table->string('name');
            $table->string('type');
            $table->bigInteger('size')->nullable();
            $table->text('url');
            $table->text('thumbnail')->nullable();
            $table->string('mime_type');
            $table->json('metadata')->nullable();
            
            // Colonnes Lunar
            $table->string('model_type')->nullable();
            $table->unsignedBigInteger('model_id')->nullable();
            $table->string('collection_name')->nullable();
            $table->string('disk')->default('public');
            $table->string('conversions_disk')->nullable();
            $table->json('manipulations')->nullable();
            $table->json('custom_properties')->nullable();
            $table->json('generated_conversions')->nullable();
            $table->json('responsive_images')->nullable();
            $table->unsignedInteger('order_column')->nullable();
            
            $table->timestamps();
            
            // Index et contraintes
            $table->foreign('store_id')->references('id')->on('stores')->onDelete('cascade');
            $table->index(['model_type', 'model_id']);
            $table->index('collection_name');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('media');
        
        // Recréer la table originale
        Schema::create('media', function (Blueprint $table) {
            $table->id();
            $table->string('store_id'); // character varying
            $table->string('name');
            $table->string('type');
            $table->bigInteger('size')->nullable();
            $table->text('url');
            $table->text('thumbnail')->nullable();
            $table->string('mime_type');
            $table->json('metadata')->nullable();
            $table->timestamps();
            
            $table->foreign('store_id')->references('id')->on('stores')->onDelete('cascade');
        });
    }
};
