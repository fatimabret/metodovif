<?php

namespace App\Repositories;

use App\Models\Ejercicio;
use App\Interfaces\IEjercicioRepository;

class EjercicioRepository implements IEjercicioRepository
{
    public function obtenerTodos()
    {
        return Ejercicio::with(['categoria', 'etiquetas'])
            ->withCount('favoritos')
            ->orderBy('id_ejercicio', 'desc')
            ->get();
    }
    
    public function obtenerPorId($id) { 
        return Ejercicio::findOrFail($id); 
    }
    
    public function crear(array $datos) { 
        $datos['activo'] = true;
        return Ejercicio::create($datos); 
    }
    
    public function actualizar($id, array $datos) {
        $ejercicio = Ejercicio::findOrFail($id);
        $ejercicio->update($datos);
        return $ejercicio;
    }
    
    public function eliminar($id) { 
        $ejercicio = Ejercicio::findOrFail($id);
        $ejercicio->activo = false;
        $ejercicio->save();
        
        return $ejercicio; 
    }

    public function activar($id) {
        $ejercicio = Ejercicio::findOrFail($id);
        $ejercicio->activo = true;
        $ejercicio->save();
        
        return $ejercicio;
    }
}