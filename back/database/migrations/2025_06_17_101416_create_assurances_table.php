<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('assurances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vehicule_id')->constrained()->onDelete('cascade');
            $table->string('numero_contrat');
            $table->string('assureur');
            $table->date('date_debut');
            $table->date('date_fin');
            $table->decimal('prix', 10, 2);
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('assurances');
    }
};