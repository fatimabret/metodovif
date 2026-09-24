<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rutina_ejercicio', function (Blueprint $table) {
            $table->unsignedBigInteger('id_rutina');
            $table->unsignedBigInteger('id_ejercicio');
            
            $table->integer('series')->default(3); 
            $table->string('repeticiones', 50)->default('12'); 
            $table->string('nota', 255)->nullable(); 
            
            $table->primary(['id_rutina', 'id_ejercicio']);
            $table->foreign('id_rutina')->references('id_rutina')->on('rutina')->onDelete('cascade');
            $table->foreign('id_ejercicio')->references('id_ejercicio')->on('ejercicio')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rutina_ejercicio');
    }
};
