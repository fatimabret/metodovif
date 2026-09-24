<?php

namespace App\Repositories;

use App\Models\Categoria;
use App\Interfaces\ICategoriaRepository;

class CategoriaRepository implements ICategoriaRepository
{
    public function obtenerTodos() { 
        return Categoria::all(); 
    }
    
    public function obtenerPorId($id) { 
        return Categoria::findOrFail($id); 
    }
    
    public function crear(array $datos) { 
        return Categoria::create($datos); 
    }
    
    public function actualizar($id, array $datos) {
        $categoria = Categoria::findOrFail($id);
        $categoria->update($datos);
        return $categoria;
    }
    
    public function eliminar($id) { 
        $categoria = Categoria::findOrFail($id);
        $categoria->activo = false;
        $categoria->save();
        
        return $categoria; 
    }

    public function activar($id) {
        $categoria = Categoria::findOrFail($id);
        $categoria->activo = true;
        $categoria->save();
        
        return $categoria;
    }
}