<?php

namespace App\Repositories;

use App\Models\Galeria;
use App\Interfaces\IGaleriaRepository;

class GaleriaRepository implements IGaleriaRepository
{
    public function obtenerTodos() { 
        return Galeria::all(); 
    }
    
    public function obtenerPorId($id) { 
        return Galeria::findOrFail($id); 
    }
    
    public function crear(array $datos) { 
        $datos['activo'] = true;
        return Galeria::create($datos); 
    }
    
    public function actualizar($id, array $datos) {
        $foto = Galeria::findOrFail($id);
        $foto->update($datos);
        return $foto;
    }
    
    public function eliminar($id) { 
        $foto = Galeria::findOrFail($id);
        $foto->activo = false;
        $foto->save();
        
        return $foto; 
    }

    public function activar($id) {
        $foto = Galeria::findOrFail($id);
        $foto->activo = true;
        $foto->save();
        
        return $foto;
    }
}