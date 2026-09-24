<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('usuario', function (Blueprint $table) {
            $table->id('id_usuario');
            $table->string('nombre', 100);
            $table->string('correo', 100)->unique();
            $table->string('contrasenia');
            $table->text('extra')->nullable();
            $table->date('fecha_vencimiento')->nullable();
            // 'pendiente', 'activa', 'inactiva'
            $table->string('estado', 20)->default('pendiente');
            
            // Clave foránea
            $table->unsignedBigInteger('id_nivel')->nullable();
            $table->foreign('id_nivel')->references('id_nivel')->on('nivel_membresia');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('usuario');
    }
};
