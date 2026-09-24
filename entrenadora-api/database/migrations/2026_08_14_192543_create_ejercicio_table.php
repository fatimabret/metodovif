<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ejercicio', function (Blueprint $table) {
            $table->id('id_ejercicio');
            $table->string('titulo', 100);
            $table->text('descripcion');
            $table->string('video_url', 255);
            $table->boolean('es_de_prueba')->default(false);
            $table->boolean('activo')->default(true);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ejercicio');
    }
};
