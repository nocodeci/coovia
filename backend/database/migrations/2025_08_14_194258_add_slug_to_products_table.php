<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            // Ajouter la colonne slug de manière nullable d'abord
            $table->string('slug')->nullable()->after('name');
        });

        // Remplir les slugs existants basés sur le nom
        DB::table('products')->whereNull('slug')->orderBy('id')->each(function ($product) {
            $slug = Str::slug($product->name);
            $originalSlug = $slug;
            $counter = 1;
            
            // Vérifier si le slug existe déjà et ajouter un suffixe si nécessaire
            while (DB::table('products')->where('slug', $slug)->where('id', '!=', $product->id)->exists()) {
                $slug = $originalSlug . '-' . $counter;
                $counter++;
            }
            
            DB::table('products')->where('id', $product->id)->update(['slug' => $slug]);
        });

        // Maintenant rendre la colonne NOT NULL et unique
        Schema::table('products', function (Blueprint $table) {
            $table->string('slug')->nullable(false)->change();
            $table->unique('slug');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropUnique(['slug']);
            $table->dropColumn('slug');
        });
    }
};
