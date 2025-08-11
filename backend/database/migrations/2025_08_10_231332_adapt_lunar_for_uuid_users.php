<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Modifier la table lunar_customer_user pour utiliser des UUID
        if (Schema::hasTable('lunar_customer_user')) {
            Schema::table('lunar_customer_user', function (Blueprint $table) {
                // Supprimer la contrainte de clé étrangère existante
                $table->dropForeign(['user_id']);
                
                // Modifier le type de colonne pour user_id
                $table->uuid('user_id')->change();
                
                // Recréer la contrainte de clé étrangère
                $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            });
        }

        // Modifier d'autres tables Lunar qui pourraient référencer des users
        $tablesToModify = [
            'lunar_customers' => 'user_id',
            'lunar_orders' => 'user_id',
            'lunar_carts' => 'user_id',
            'lunar_wishlists' => 'user_id',
        ];

        foreach ($tablesToModify as $tableName => $columnName) {
            if (Schema::hasTable($tableName) && Schema::hasColumn($tableName, $columnName)) {
                Schema::table($tableName, function (Blueprint $table) use ($columnName) {
                    // Supprimer la contrainte de clé étrangère existante
                    try {
                        $table->dropForeign([$columnName]);
                    } catch (Exception $e) {
                        // Ignorer si la contrainte n'existe pas
                    }
                    
                    // Modifier le type de colonne
                    $table->uuid($columnName)->change();
                    
                    // Recréer la contrainte de clé étrangère
                    $table->foreign($columnName)->references('id')->on('users')->onDelete('cascade');
                });
            }
        }
    }

    public function down(): void
    {
        // Revenir aux bigint si nécessaire
        $tablesToRevert = [
            'lunar_customer_user' => 'user_id',
            'lunar_customers' => 'user_id',
            'lunar_orders' => 'user_id',
            'lunar_carts' => 'user_id',
            'lunar_wishlists' => 'user_id',
        ];

        foreach ($tablesToRevert as $tableName => $columnName) {
            if (Schema::hasTable($tableName) && Schema::hasColumn($tableName, $columnName)) {
                Schema::table($tableName, function (Blueprint $table) use ($columnName) {
                    // Supprimer la contrainte de clé étrangère
                    try {
                        $table->dropForeign([$columnName]);
                    } catch (Exception $e) {
                        // Ignorer si la contrainte n'existe pas
                    }
                    
                    // Revenir au type bigint
                    $table->bigInteger($columnName)->change();
                });
            }
        }
    }
};
