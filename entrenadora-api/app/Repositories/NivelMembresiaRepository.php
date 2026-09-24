<?php

namespace App\Repositories;

use App\Models\NivelMembresia;
use App\Interfaces\INivelMembresiaRepository;

class NivelMembresiaRepository implements INivelMembresiaRepository
{
    public function obtenerTodos($soloActivos = false)
    {
        $query = NivelMembresia::query();

        if ($soloActivos) {
            $query->where('activo', true);
        }

        return $query->get();
    }

    public function obtenerPorId($id)
    {
        return NivelMembresia::findOrFail($id);
    }

    public function crear(array $datos)
    {
        return NivelMembresia::create($datos);
    }

    public function actualizar($id, array $datos)
    {
        $nivel = NivelMembresia::findOrFail($id);
        $nivel->update($datos);
        return $nivel;
    }

    public function activar($id)
    {
        $nivel = NivelMembresia::findOrFail($id);
        $nivel->activo = true; // Volvemos a habilitarlo
        $nivel->save();
        
        return $nivel;
    }
    
    public function eliminar($id)
    {
        $nivel = NivelMembresia::findOrFail($id);
        $nivel->activo = false;
        $nivel->save();
        
        return $nivel;
    }
}