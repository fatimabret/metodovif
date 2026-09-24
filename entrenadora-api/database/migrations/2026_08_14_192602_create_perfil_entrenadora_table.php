<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('perfil_entrenadora', function (Blueprint $table) {
            $table->id('id_perfil');
            $table->string('titulo_principal', 255);
            $table->text('biografia');
            $table->string('anos_experiencia', 50);
            $table->string('cantidad_alumnas', 50);
            $table->string('cantidad_disciplinas', 50);
            $table->string('url_foto', 255);
            $table->boolean('activo')->default(true);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('perfil_entrenadora');
    }
};
