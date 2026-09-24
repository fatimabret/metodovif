<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Usuario;
use Illuminate\Support\Facades\Log;

class VerificarVencimientosAlumnas extends Command
{
    /**
     * El nombre y la firma del comando en la consola.
     *
     * @var string
     */
    protected $signature = 'alumnas:verificar-vencimientos';

    /**
     * La descripción del comando.
     *
     * @var string
     */
    protected $description = 'Verifica la fecha de vencimiento de las alumnas y las pasa a estado vencida si superaron los 30 días.';

    /**
     * Ejecuta el comando.
     */
    public function handle()
    {
        // Contamos cuántas alumnas están a punto de vencerse para el mensaje de la consola
        $cantidadActualizadas = Usuario::where('estado', 'activa')
            ->where('fecha_vencimiento', '<', now())
            ->update(['estado' => 'vencida']);

        // Mostramos un mensaje en la consola (útil para pruebas)
        $this->info("Proceso terminado: Se dieron de baja {$cantidadActualizadas} alumnas por vencimiento.");
        
        // Guardamos un registro en los logs del sistema (storage/logs/laravel.log)
        if ($cantidadActualizadas > 0) {
            Log::info("Baja automática ejecutada: {$cantidadActualizadas} alumnas pasaron a estado 'vencida'.");
        }
    }
}