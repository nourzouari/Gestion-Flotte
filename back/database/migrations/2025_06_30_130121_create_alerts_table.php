<?php

// database/migrations/[timestamp]_create_alerts_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('alerts', function (Blueprint $table) {
            $table->id();
            $table->string('type'); // assurance, visite_technique, etc.
            $table->unsignedBigInteger('related_id'); // ID de l'entité concernée
            $table->string('title');
            $table->text('message');
            $table->string('severity'); // info, warning, danger
            $table->string('status')->default('active'); // active, resolved
            $table->timestamp('read_at')->nullable();
            $table->timestamps();
            
            $table->index(['type', 'related_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('alerts');
    }
};