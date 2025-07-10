<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateControleTechniquesTable extends Migration
{
    public function up()
    {
        Schema::create('controle_techniques', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vehicule_id')->constrained()->onDelete('cascade');
            $table->date('date_controle');
            $table->date('date_prochaine_controle');
            $table->enum('resultat', ['favorable', 'défavorable']);
            $table->string('centre_controle');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('controle_techniques');
    }
}