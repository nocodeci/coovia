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
        Schema::table('stores', function (Blueprint $table) {
            // Vérifier si la colonne address existe déjà
            if (!Schema::hasColumn('stores', 'address')) {
                $table->json('address')->nullable()->after('category');
            }
            
            // Vérifier si la colonne contact existe déjà
            if (!Schema::hasColumn('stores', 'contact')) {
                $table->json('contact')->nullable()->after('address');
            }
            
            // Vérifier si la colonne settings existe déjà
            if (!Schema::hasColumn('stores', 'settings')) {
                $table->json('settings')->nullable()->after('contact');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('stores', function (Blueprint $table) {
            $table->dropColumn(['address', 'contact', 'settings']);
        });
    }
};
