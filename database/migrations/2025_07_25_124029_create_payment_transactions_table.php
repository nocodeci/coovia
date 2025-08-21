<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payment_transactions', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->string('client_name');
            $table->enum('status', ['Initié', 'En Attente', 'Succès', 'Échec']);
            $table->string('location');
            $table->boolean('verified')->default(false);

            $table->uuid('payment_gateway_id');
            $table->foreign('payment_gateway_id')->references('id')->on('payment_gateways')->onDelete('cascade');

            $table->uuid('payment_method_id');
            $table->foreign('payment_method_id')->references('id')->on('payment_methods')->onDelete('cascade');

            $table->decimal('value', 10, 2);
            $table->integer('progression')->default(0);

            $table->uuid('order_id')->nullable();
            $table->foreign('order_id')->references('id')->on('orders')->onDelete('cascade');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payment_transactions');
    }
};
