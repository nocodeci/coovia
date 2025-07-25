<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payment_transactions', function (Blueprint $table) {
            $table->id();
            $table->string('client_name');
            $table->enum('status', ['Initié', 'En Attente', 'Succès', 'Échec']);
            $table->string('location');
            $table->boolean('verified')->default(false);
            $table->foreignId('payment_gateway_id')->constrained();
            $table->foreignId('payment_method_id')->constrained();
            $table->decimal('value', 10, 2);
            $table->integer('progression')->default(0);
            $table->foreignId('order_id')->nullable()->constrained();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payment_transactions');
    }
};
