<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('nivel_membresia_categoria');

        Schema::create('nivel_membresia_categoria', function (Blueprint $table) {
            $table->id();
            
            // Creamos las columnas pero sin el bloqueo estricto de llave foránea
            $table->bigInteger('id_nivel');
            $table->bigInteger('id_categoria');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('nivel_membresia_categoria');
    }
};