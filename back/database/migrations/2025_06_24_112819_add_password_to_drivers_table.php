<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
   // database/migrations/xxxx_add_password_to_drivers_table.php
public function up()
{
    Schema::table('drivers', function (Blueprint $table) {
        $table->string('password');
        $table->rememberToken(); // Important pour l'authentification
    });
}

public function down()
{
    Schema::table('drivers', function (Blueprint $table) {
        $table->dropColumn(['password', 'remember_token']);
    });
}
};
