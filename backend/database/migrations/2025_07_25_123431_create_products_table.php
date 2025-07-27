<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->uuid('id')->primary(); // UUID pour rester cohérent
            $table->uuid('store_id'); // UUID aussi pour la FK
            $table->foreign('store_id')->references('id')->on('stores')->onDelete('cascade');

            $table->string('name');
            $table->text('description');
            $table->decimal('price', 10, 2);
            $table->decimal('compare_price', 10, 2)->nullable();
            $table->json('images');
            $table->string('category');
            $table->json('tags')->nullable();
            $table->enum('status', ['active', 'inactive', 'draft'])->default('draft');
            $table->json('inventory');
            $table->json('seo')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
