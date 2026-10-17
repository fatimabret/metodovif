<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NivelMembresiaCategoriaSeeder extends Seeder
{
    public function run(): void
    {
        $relaciones = [
            ['id_nivel' => 1, 'id_categoria' => 1], // Ratas -> Funcional
            ['id_nivel' => 2, 'id_categoria' => 1], // Completitos -> Funcional
        ];

        DB::table('nivel_membresia_categoria')->insertOrIgnore($relaciones);
    }
}