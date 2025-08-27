<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create("lunar_collection_product", function (Blueprint $table) {
            $table->uuid("collection_id");
            $table->uuid("product_id");
            $table->timestamps();
            
            $table->primary(["collection_id", "product_id"]);
            $table->foreign("collection_id")->references("id")->on("lunar_collections")->onDelete("cascade");
            $table->foreign("product_id")->references("id")->on("lunar_products")->onDelete("cascade");
        });
    }

    public function down(): void
    {
        Schema::dropIfExists("lunar_collection_product");
    }
};
