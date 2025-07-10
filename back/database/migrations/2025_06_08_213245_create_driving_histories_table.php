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
        Schema::create('driving_histories', function (Blueprint $table) {
    $table->id();
    $table->foreignId('driver_id')->constrained()->onDelete('cascade');
    $table->enum('type', ['accident', 'infraction','Maintenance','Autre']); // <- ici, c’est restreint
    $table->text('description')->nullable();
    $table->date('date');
    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('driving_histories');
    }
};
