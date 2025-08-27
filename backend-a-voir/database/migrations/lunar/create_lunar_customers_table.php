<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create("lunar_customers", function (Blueprint $table) {
            $table->uuid("id")->primary();
            $table->uuid("user_id")->nullable();
            $table->string("first_name");
            $table->string("last_name");
            $table->string("email")->unique();
            $table->string("phone")->nullable();
            $table->json("meta")->nullable();
            $table->timestamps();
            
            $table->foreign("user_id")->references("id")->on("users")->onDelete("set null");
        });
    }

    public function down(): void
    {
        Schema::dropIfExists("lunar_customers");
    }
};