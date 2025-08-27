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
            $table->unsignedBigInteger('vendor_id')->nullable()->after('owner_id');
            $table->foreign('vendor_id')->references('id')->on('vendors')->onDelete('cascade');
            $table->string('approval_status')->default('pending')->after('status'); // pending, approved, rejected
            $table->timestamp('approved_at')->nullable()->after('approval_status');
            $table->text('rejection_reason')->nullable()->after('approved_at');
            
            $table->index(['vendor_id', 'approval_status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('stores', function (Blueprint $table) {
            $table->dropForeign(['vendor_id']);
            $table->dropColumn(['vendor_id', 'approval_status', 'approved_at', 'rejection_reason']);
            $table->dropIndex(['vendor_id', 'approval_status']);
        });
    }
};
