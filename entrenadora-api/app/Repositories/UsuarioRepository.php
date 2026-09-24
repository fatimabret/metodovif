<?php

namespace App\Repositories;

use App\Models\Usuario;
use App\Interfaces\IUsuarioRepository;

class UsuarioRepository implements IUsuarioRepository
{
    public function obtenerTodos($porPagina = 15)
    {
        return Usuario::with('rutinas')->paginate($porPagina); 
    }

    public function obtenerPorId($id)
    {
        return Usuario::with(['ejerciciosFavoritos', 'rutinas.ejercicios'])->findOrFail($id);
    }

    public function obtenerPorCorreo($correo)
    {
        return Usuario::where('correo', $correo)->first();
    }

    public function crear(array $datos)
    {
        return Usuario::create($datos);
    }

    public function actualizar($id, array $datos)
    {
        $usuario = Usuario::findOrFail($id);
        $usuario->update($datos);
        return $usuario;
    }

    public function eliminar($id)
    {
        $usuario = Usuario::findOrFail($id);
        $usuario->estado = 'inactiva';
        $usuario->save();
        
        return $usuario;
    }

    public function actualizarEstadoYVencimiento($id, string $estado, ?string $fechaVencimiento = null)
    {
        $usuario = Usuario::findOrFail($id);
        $usuario->estado = $estado;
        
        if ($fechaVencimiento !== null) {
            $usuario->fecha_vencimiento = $fechaVencimiento;
        }
        
        $usuario->save();
        return $usuario;
    }

    public function asignarRutinas($id, array $rutinasIds)
    {
        $usuario = Usuario::findOrFail($id);
        $usuario->rutinas()->sync($rutinasIds);

        return $usuario->load('rutinas.ejercicios');
    }
}