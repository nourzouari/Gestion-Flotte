<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('entretiens', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vehicule_id')->constrained()->onDelete('cascade');
            $table->string('type_entretien');
            $table->text('description')->nullable();
            $table->date('date_prevue');
            $table->date('date_reelle')->nullable();
            $table->decimal('cout', 10, 2)->nullable();
            $table->integer('kilometrage')->nullable();
            $table->string('statut')->default('planifié');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('entretiens');
    }
};