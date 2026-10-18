<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Carbon\Carbon;
use App\Models\Usuario;

class FechaModificadaMail extends Mailable
{
    use Queueable, SerializesModels;

    public $usuario;
    public $nuevaFecha;

    public function __construct(Usuario $usuario)
    {
        $this->usuario = $usuario;
        $this->nuevaFecha = Carbon::parse($usuario->fecha_vencimiento)->format('d/m/Y');
    }

    public function build()
    {
        return $this->subject('Actualización de tu plan - Metodo VIF')
                    ->view('emails.fecha_modificada');
    }
}