<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('vendors', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->uuid('user_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->string('business_name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('logo')->nullable();
            $table->string('banner')->nullable();
            $table->string('status')->default('pending'); // pending, active, suspended, inactive
            $table->string('verification_status')->default('unverified'); // unverified, verified, rejected
            $table->json('contact_info')->nullable(); // email, phone, website
            $table->json('address')->nullable(); // street, city, state, country, postal_code
            $table->json('business_info')->nullable(); // tax_id, business_license, etc.
            $table->json('payment_info')->nullable(); // bank details, payment methods
            $table->json('settings')->nullable(); // commission_rate, auto_approve_products, etc.
            $table->decimal('commission_rate', 5, 2)->default(10.00); // Default 10%
            $table->boolean('auto_approve_products')->default(false);
            $table->boolean('featured')->default(false);
            $table->timestamp('verified_at')->nullable();
            $table->timestamp('last_activity_at')->nullable();
            $table->timestamps();
            
            $table->index(['status', 'verification_status']);
            $table->index(['featured', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vendors');
    }
};
