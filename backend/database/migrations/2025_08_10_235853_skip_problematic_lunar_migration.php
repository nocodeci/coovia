<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Marquer la migration problématique comme exécutée
        // Cette migration remplace la migration Lunar problématique
        // qui a des problèmes avec les relations polymorphiques
        
        // Insérer un enregistrement dans la table migrations pour marquer
        // la migration 2024_03_15_100000_remap_polymorphic_relations comme exécutée
        DB::table('migrations')->insert([
            'migration' => '2024_03_15_100000_remap_polymorphic_relations',
            'batch' => DB::table('migrations')->max('batch') + 1
        ]);
    }

    public function down(): void
    {
        // Supprimer l'enregistrement de la migration
        DB::table('migrations')
            ->where('migration', '2024_03_15_100000_remap_polymorphic_relations')
            ->delete();
    }
};
