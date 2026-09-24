<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('nivel_membresia', function (Blueprint $table) {
            $table->id('id_nivel');
            $table->string('titulo', 100);
            $table->text('descripcion');
            $table->decimal('precio', 10, 2);
            $table->boolean('activo')->default(true);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('nivel_membresia');
    }
};
