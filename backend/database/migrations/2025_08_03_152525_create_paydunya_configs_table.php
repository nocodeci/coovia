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
        Schema::create('paydunya_configs', function (Blueprint $table) {
            $table->id();
            $table->uuid('user_id');
            $table->text('master_key'); // Encrypted
            $table->text('private_key'); // Encrypted
            $table->text('public_key'); // Encrypted
            $table->text('token'); // Encrypted
            $table->enum('environment', ['test', 'live'])->default('live');
            $table->string('webhook_url')->nullable();
            $table->boolean('is_connected')->default(false);
            $table->timestamps();
            
            $table->index('user_id');
            $table->unique('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('paydunya_configs');
    }
};
