<?php

namespace App\Repositories;

use App\Models\Contacto;
use App\Interfaces\IContactoRepository;

class ContactoRepository implements IContactoRepository
{
    public function obtenerTodos($soloActivos = false)
    {
        $query = Contacto::query(); // Inicia el constructor de consultas

        if ($soloActivos) {
            $query->where('activo', true); // O 'estado' => 'activa' según tu tabla
        }

        return $query->get();
    }
    
    public function obtenerPorId($id) { 
        return Contacto::findOrFail($id); 
    }
    
    public function crear(array $datos) { 
        $datos['activo'] = true;
        return Contacto::create($datos); 
    }
    
    public function actualizar($id, array $datos) {
        $contacto = Contacto::findOrFail($id);
        $contacto->update($datos);
        return $contacto;
    }
    
    public function eliminar($id) { 
        $contacto = Contacto::findOrFail($id);
        $contacto->activo = false;
        $contacto->save();
        
        return $contacto; 
    }

    public function activar($id) {
        $contacto = Contacto::findOrFail($id);
        $contacto->activo = true;
        $contacto->save();
        
        return $contacto;
    }
}