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
            // Vérifier si la colonne logo existe déjà
            if (!Schema::hasColumn('stores', 'logo')) {
                $table->string('logo')->nullable()->after('description');
            }
            
            // Vérifier si la colonne banner existe déjà
            if (!Schema::hasColumn('stores', 'banner')) {
                $table->string('banner')->nullable()->after('logo');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('stores', function (Blueprint $table) {
            $table->dropColumn(['logo', 'banner']);
        });
    }
};
