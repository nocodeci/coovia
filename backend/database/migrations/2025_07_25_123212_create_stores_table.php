<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stores', function (Blueprint $table) {
            $table->uuid('id')->primary(); // UUID si tu veux garder la cohérence
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description');
            $table->string('logo')->nullable();
            $table->string('banner')->nullable();
            $table->enum('status', ['active', 'inactive', 'pending'])->default('pending');
            $table->string('category');
            $table->json('address');
            $table->json('contact');
            $table->json('settings');

            // ✅ correction ici : UUID au lieu de foreignId()
            $table->uuid('owner_id');
            $table->foreign('owner_id')->references('id')->on('users')->onDelete('cascade');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stores');
    }
};
