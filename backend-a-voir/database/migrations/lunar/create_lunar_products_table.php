<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create("lunar_products", function (Blueprint $table) {
            $table->uuid("id")->primary();
            $table->uuid("store_id")->nullable();
            $table->string("name");
            $table->string("slug")->unique();
            $table->text("description")->nullable();
            $table->string("sku")->nullable();
            $table->decimal("price", 10, 2)->default(0);
            $table->decimal("compare_price", 10, 2)->nullable();
            $table->integer("stock_quantity")->default(0);
            $table->boolean("is_active")->default(true);
            $table->boolean("is_featured")->default(false);
            $table->json("meta")->nullable();
            $table->timestamps();
            
            $table->foreign("store_id")->references("id")->on("stores")->onDelete("cascade");
        });
    }

    public function down(): void
    {
        Schema::dropIfExists("lunar_products");
    }
};