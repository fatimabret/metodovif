<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('categoria_ejercicio', function (Blueprint $table) {
            $table->unsignedBigInteger('id_categoria');
            $table->unsignedBigInteger('id_ejercicio');
            
            // Llave primaria compuesta para evitar duplicados
            $table->primary(['id_categoria', 'id_ejercicio']);
            
            // Relaciones foráneas con borrado en cascada
            $table->foreign('id_categoria')->references('id_categoria')->on('categoria')->onDelete('cascade');
            $table->foreign('id_ejercicio')->references('id_ejercicio')->on('ejercicio')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('categoria_ejercicio');
    }
};