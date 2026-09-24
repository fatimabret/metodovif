<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rutina', function (Blueprint $table) {
            $table->id('id_rutina');
            $table->string('titulo', 150);
            $table->text('descripcion');
            $table->string('categoria', 100)->nullable();
            $table->boolean('activo')->default(true);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rutina');
    }
};
