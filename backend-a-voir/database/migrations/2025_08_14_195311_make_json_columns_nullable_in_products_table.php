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
        Schema::table('products', function (Blueprint $table) {
            // Rendre les colonnes JSON nullable pour éviter les erreurs de contrainte
            $table->json('images')->nullable()->change();
            $table->json('inventory')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            // Remettre les colonnes comme NOT NULL
            $table->json('images')->nullable(false)->change();
            $table->json('inventory')->nullable(false)->change();
        });
    }
};
