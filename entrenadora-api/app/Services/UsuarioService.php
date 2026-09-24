<?php

namespace App\Services;

use App\Interfaces\IUsuarioRepository;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Mail\AlumnaAprobadaMail;

class UsuarioService
{
    protected $repositorio;

    public function __construct(IUsuarioRepository $repositorio)
    {
        $this->repositorio = $repositorio;
    }

    public function obtenerTodos() { return $this->repositorio->obtenerTodos(); }
    public function obtenerPorId($id) { return $this->repositorio->obtenerPorId($id); }

    public function crear(array $datos)
    {
        // Encriptar la contraseña antes de mandarla a la base de datos
        $datos['contrasenia'] = Hash::make($datos['contrasenia']);
        return $this->repositorio->crear($datos);
    }

    public function actualizar($id, array $datos)
    {
        // Si el cliente envía una nueva contraseña, la encriptamos. Si no, la ignoramos.
        if (isset($datos['contrasenia'])) {
            $datos['contrasenia'] = Hash::make($datos['contrasenia']);
        }
        return $this->repositorio->actualizar($id, $datos);
    }

    public function eliminar($id) { return $this->repositorio->eliminar($id); }

    public function aprobarAlumna($id, array $datos)
    {
        // 1. Forzamos el estado a activa
        $datos['estado'] = 'activa';
        
        // 2. Actualizamos la base de datos
        $usuario = $this->repositorio->actualizar($id, $datos);

        // 3. Enviamos el correo de confirmación
        try {
            Mail::to($usuario->correo)->send(new AlumnaAprobadaMail($usuario));
        } catch (\Exception $e) {
            // Registramos el error si el correo falla, pero no bloqueamos la aprobación
            \Illuminate\Support\Facades\Log::error("Error al enviar correo: " . $e->getMessage());
        }

        return $usuario;
    }

    public function darDeBajaAlumna($id) { return $this->repositorio->actualizarEstadoYVencimiento($id, 'inactiva'); }

    public function asignarRutinas($id, array $rutinasIds)
    {
        return $this->repositorio->asignarRutinas($id, $rutinasIds);
    }
}