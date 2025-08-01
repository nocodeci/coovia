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
            // Supprimer l'ancienne colonne status
            $table->dropColumn('status');
        });

        Schema::table('products', function (Blueprint $table) {
            // Recréer la colonne status avec le nouveau enum incluant 'archived'
            $table->enum('status', ['active', 'inactive', 'draft', 'archived'])->default('draft');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            // Supprimer la nouvelle colonne status
            $table->dropColumn('status');
        });

        Schema::table('products', function (Blueprint $table) {
            // Recréer l'ancienne colonne status
            $table->enum('status', ['active', 'inactive', 'draft'])->default('draft');
        });
    }
};
