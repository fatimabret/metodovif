<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class RecuperarPasswordMail extends Mailable
{
    use Queueable, SerializesModels;

    public $token;
    public $correo;
    public $urlRecuperacion;

    public function __construct($token, $correo)
    {
        $this->token = $token;
        $this->correo = $correo;
        $baseUrl = env('FRONTEND_URL', 'http://localhost:5173/');
        $this->urlRecuperacion = "{$baseUrl}/recuperar-password/{$token}?email=" . urlencode($correo);
    }

    public function build()
    {
        return $this->subject('Recuperación de contraseña - Metodo VIF')
                    ->view('emails.recuperar_password');
    }
}