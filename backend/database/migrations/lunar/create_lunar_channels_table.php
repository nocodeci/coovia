<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create("lunar_channels", function (Blueprint $table) {
            $table->uuid("id")->primary();
            $table->string("name");
            $table->string("handle")->unique();
            $table->string("url")->nullable();
            $table->boolean("default")->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists("lunar_channels");
    }
};