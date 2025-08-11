<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create("lunar_orders", function (Blueprint $table) {
            $table->uuid("id")->primary();
            $table->uuid("user_id")->nullable();
            $table->uuid("store_id")->nullable();
            $table->string("order_number")->unique();
            $table->string("status")->default("pending");
            $table->decimal("sub_total", 10, 2)->default(0);
            $table->decimal("tax_total", 10, 2)->default(0);
            $table->decimal("shipping_total", 10, 2)->default(0);
            $table->decimal("discount_total", 10, 2)->default(0);
            $table->decimal("total", 10, 2)->default(0);
            $table->json("meta")->nullable();
            $table->timestamps();
            
            $table->foreign("user_id")->references("id")->on("users")->onDelete("set null");
            $table->foreign("store_id")->references("id")->on("stores")->onDelete("cascade");
        });
    }

    public function down(): void
    {
        Schema::dropIfExists("lunar_orders");
    }
};