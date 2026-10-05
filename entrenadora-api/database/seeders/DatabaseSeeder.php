<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Cuenta principal de la entrenadora
        User::updateOrCreate(
            ['email' => 'contacto.metodovif@gmail.com'],
            [
                'name' => 'Vero',
                'password' => Hash::make('santi1234')
            ]
        );

        // Cuenta secundaria
        User::updateOrCreate(
            ['email' => 'verito.bene@gmail.com'],
            [
                'name' => 'Veronica',
                'password' => Hash::make('santi1234')
            ]
        );
    }
}
