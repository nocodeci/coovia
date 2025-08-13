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
        // Vérifier si la table media existe
        if (Schema::hasTable('media')) {
            // Supprimer d'abord la contrainte de clé étrangère
            try {
                DB::statement('ALTER TABLE media DROP CONSTRAINT IF EXISTS media_store_id_foreign');
            } catch (Exception $e) {
                // Ignorer l'erreur si la contrainte n'existe pas
            }
            
            // Modifier le type de colonne avec conversion explicite pour PostgreSQL
            DB::statement('ALTER TABLE media ALTER COLUMN store_id TYPE uuid USING store_id::uuid');
            
            // Recréer la contrainte de clé étrangère
            DB::statement('ALTER TABLE media ADD CONSTRAINT media_store_id_foreign FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE');
        } else {
            // Créer la table media si elle n'existe pas
            Schema::create('media', function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->uuid('store_id');
                $table->string('name');
                $table->string('type'); // image, video, document, audio
                $table->bigInteger('size');
                $table->string('url');
                $table->string('thumbnail')->nullable();
                $table->string('mime_type');
                $table->json('metadata')->nullable(); // Pour stocker des métadonnées supplémentaires
                $table->timestamps();

                $table->foreign('store_id')->references('id')->on('stores')->onDelete('cascade');
                $table->index(['store_id', 'type']);
                $table->index(['store_id', 'created_at']);
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Pas de rollback nécessaire pour cette correction
    }
};
