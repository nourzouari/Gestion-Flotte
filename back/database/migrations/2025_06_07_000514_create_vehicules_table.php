<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('vehicules', function (Blueprint $table) {
            $table->id();
            $table->string('marque');
            $table->string('modele');
            $table->string('immatriculation')->unique();
            $table->integer('annee');
            $table->date('date_achat')->nullable();
            $table->integer('kilometrage')->default(0);
            $table->string('carburant_type')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('vehicules');
    }
};