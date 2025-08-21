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
        // Vérifier si la colonne address existe déjà
        if (Schema::hasColumn('stores', 'address')) {
            // Si elle existe, on ne fait rien pour address
            // Mais on ajoute les autres colonnes si elles n'existent pas
            if (!Schema::hasColumn('stores', 'contact')) {
                Schema::table('stores', function (Blueprint $table) {
                    $table->json('contact')->nullable()->after('address');
                });
            }
            
            if (!Schema::hasColumn('stores', 'settings')) {
                Schema::table('stores', function (Blueprint $table) {
                    $table->json('settings')->nullable()->after('contact');
                });
            }
        } else {
            // Si address n'existe pas, on l'ajoute avec les autres
            Schema::table('stores', function (Blueprint $table) {
                $table->json('address')->nullable()->after('category');
                $table->json('contact')->nullable()->after('address');
                $table->json('settings')->nullable()->after('contact');
            });
        }
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
