<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

use App\Models\Usuario;

class AlumnaAprobadaMail extends Mailable
{
    use Queueable, SerializesModels;

    public $usuario;
    public $plan;
    public $fechaVencimiento;

    public function __construct(Usuario $usuario)
    {
        $this->usuario = $usuario;
        
        $this->plan = DB::table('nivel_membresia')->where('id_nivel', $usuario->id_nivel)->first();
        
        $this->fechaVencimiento = $usuario->fecha_vencimiento 
            ? Carbon::parse($usuario->fecha_vencimiento)->format('d/m/Y') 
            : ' ';
    }

    public function build()
    {
        return $this->subject('¡Tu cuenta en Metodo VIF está activa!')
                    ->view('emails.alumna_aprobada');
    }
}