<?php

namespace App\Repositories;

use App\Models\Rutina;
use App\Interfaces\IRutinaRepository;

class RutinaRepository implements IRutinaRepository
{
    public function obtenerTodos() { 
        // Trae las rutinas e incluye los ejercicios asociados a cada una
        return Rutina::with('ejercicios')->get(); 
    }
    
    public function obtenerPorId($id) { 
        return Rutina::with('ejercicios')->findOrFail($id); 
    }
    
    public function crear(array $datos) { 
        $datos['activo'] = true;
        $rutina = Rutina::create($datos); 

        if (isset($datos['ejercicios']) && is_array($datos['ejercicios'])) {
            $syncData = [];
            foreach ($datos['ejercicios'] as $ej) {
                $syncData[$ej['id_ejercicio']] = [
                    'series' => $ej['series'],
                    'repeticiones' => $ej['repeticiones'],
                    'nota' => $ej['nota'] ?? null // <-- Guardamos la nota si existe, sino null
                ];
            }
            $rutina->ejercicios()->sync($syncData);
        }

        return $rutina->load('ejercicios'); 
    }
        
    public function actualizar($id, array $datos) {
        $rutina = Rutina::findOrFail($id);
        $rutina->update($datos);

        if (isset($datos['ejercicios']) && is_array($datos['ejercicios'])) {
            $syncData = [];
            foreach ($datos['ejercicios'] as $ej) {
                $syncData[$ej['id_ejercicio']] = [
                    'series' => $ej['series'],
                    'repeticiones' => $ej['repeticiones'],
                    'nota' => $ej['nota'] ?? null
                ];
            }
            $rutina->ejercicios()->sync($syncData);
        }

        return $rutina->load('ejercicios');
    }
    
    public function eliminar($id) { 
        $rutina = Rutina::findOrFail($id);
        $rutina->activo = false;
        $rutina->save();
        
        return $rutina; 
    }

    public function activar($id) {
        $rutina = Rutina::findOrFail($id);
        $rutina->activo = true;
        $rutina->save();
        
        return $rutina;
    }
}