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
        Schema::table('moneroo_configs', function (Blueprint $table) {
            if (Schema::hasColumn('moneroo_configs', 'public_key')) {
                $table->dropColumn('public_key');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('moneroo_configs', function (Blueprint $table) {
            $table->string('public_key')->after('user_id');
        });
    }
};
