<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payment_methods', function (Blueprint $table) {
            $table->uuid('id')->primary(); // UUID au lieu de bigint
            $table->uuid('payment_gateway_id'); // UUID FK
            $table->foreign('payment_gateway_id')->references('id')->on('payment_gateways')->onDelete('cascade');

            $table->string('name');
            $table->string('type');
            $table->string('country');
            $table->string('country_code');
            $table->string('provider');
            $table->text('details');
            $table->string('logo')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payment_methods');
    }
};
