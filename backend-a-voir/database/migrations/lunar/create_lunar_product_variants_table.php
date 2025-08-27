<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create("lunar_product_variants", function (Blueprint $table) {
            $table->uuid("id")->primary();
            $table->uuid("product_id");
            $table->string("name");
            $table->string("sku")->nullable();
            $table->decimal("price", 10, 2)->default(0);
            $table->decimal("compare_price", 10, 2)->nullable();
            $table->integer("stock_quantity")->default(0);
            $table->boolean("is_active")->default(true);
            $table->json("meta")->nullable();
            $table->timestamps();
            
            $table->foreign("product_id")->references("id")->on("lunar_products")->onDelete("cascade");
        });
    }

    public function down(): void
    {
        Schema::dropIfExists("lunar_product_variants");
    }
};
