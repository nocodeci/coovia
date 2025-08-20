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
        Schema::create('user_profiles', function (Blueprint $table) {
            $table->id();
            $table->uuid('user_id');
            $table->string('first_name')->nullable();
            $table->string('last_name')->nullable();
            $table->string('display_name')->nullable();
            $table->text('bio')->nullable();
            $table->string('avatar')->nullable();
            $table->string('cover_image')->nullable();
            $table->string('website')->nullable();
            $table->string('company')->nullable();
            $table->string('job_title')->nullable();
            $table->string('location')->nullable();
            $table->string('timezone')->default('UTC');
            $table->string('language')->default('fr');
            $table->string('currency')->default('XOF');
            $table->json('social_links')->nullable(); // LinkedIn, Twitter, Facebook, etc.
            $table->json('preferences')->nullable(); // Notifications, privacy, etc.
            $table->json('address')->nullable();
            $table->date('birth_date')->nullable();
            $table->enum('gender', ['male', 'female', 'other', 'prefer_not_to_say'])->nullable();
            $table->string('nationality')->nullable();
            $table->string('id_number')->nullable(); // Numéro d'identité
            $table->string('tax_id')->nullable(); // Numéro fiscal
            $table->boolean('is_verified')->default(false);
            $table->timestamp('verified_at')->nullable();
            $table->timestamps();
            
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->index(['user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_profiles');
    }
};
