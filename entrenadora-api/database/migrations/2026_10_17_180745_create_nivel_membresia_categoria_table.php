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
            
            $table->bigInteger('id_nivel');
            $table->bigInteger('id_categoria');

            $table->foreign('id_nivel')
                  ->references('id_nivel')->on('nivel_membresia')
                  ->onDelete('cascade');
                  
            $table->foreign('id_categoria')
                  ->references('id_categoria')->on('categoria')
                  ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('nivel_membresia_categoria');
    }
};