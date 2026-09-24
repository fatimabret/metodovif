<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ejercicio_favorito', function (Blueprint $table) {
            $table->unsignedBigInteger('id_usuario');
            $table->unsignedBigInteger('id_ejercicio');
            $table->date('fecha_agregado')->default(now());
            
            // Claves primarias compuestas
            $table->primary(['id_usuario', 'id_ejercicio']);
            
            // Claves foráneas
            $table->foreign('id_usuario')->references('id_usuario')->on('usuario')->onDelete('cascade');
            $table->foreign('id_ejercicio')->references('id_ejercicio')->on('ejercicio')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ejercicio_favorito');
    }
};
