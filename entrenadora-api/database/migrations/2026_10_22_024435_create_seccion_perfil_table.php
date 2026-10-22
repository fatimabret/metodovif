<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('seccion_perfil', function (Blueprint $table) {
            $table->id('id_seccion');
            $table->unsignedBigInteger('id_perfil');
            
            $table->string('titulo', 150);
            $table->text('descripcion');
            $table->integer('orden')->default(0);
            $table->boolean('activo')->default(true);
            
            $table->timestamps();

            $table->foreign('id_perfil')
                  ->references('id_perfil')
                  ->on('perfil_entrenadora')
                  ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('seccion_perfil');
    }
};