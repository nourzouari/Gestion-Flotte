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
        Schema::table('driving_histories', function (Blueprint $table) {
            //
        });
         Schema::table('driving_histories', function (Blueprint $table) {
            $table->unsignedBigInteger('vehicle_id')->nullable()->after('driver_id');
            
            // Si tu as une table vehicles, tu peux ajouter la clé étrangère
            $table->foreign('vehicle_id')->references('id')->on('vehicles')->onDelete('set null');
        });
    }
    

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('driving_histories', function (Blueprint $table) {
            //
        });
        $table->dropForeign(['vehicle_id']);
        $table->dropColumn('vehicle_id');
    }
};
