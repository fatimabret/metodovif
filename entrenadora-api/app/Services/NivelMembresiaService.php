<?php

namespace App\Services;

use App\Interfaces\INivelMembresiaRepository;
use Exception;

class NivelMembresiaService
{
    protected $repositorio;

    // Inyectamos la interfaz, NO la implementación directa
    public function __construct(INivelMembresiaRepository $repositorio)
    {
        $this->repositorio = $repositorio;
    }

    public function obtenerTodos(){return $this->repositorio->obtenerTodos();}
    public function obtenerPorId($id){return $this->repositorio->obtenerPorId($id);}

    public function crear(array $datos)
    {
        if ($datos['precio'] < 0) throw new Exception("El precio no puede ser negativo");
        return $this->repositorio->crear($datos);
    }

    public function actualizar($id, array $datos){return $this->repositorio->actualizar($id, $datos);}
    public function activar($id){return $this->repositorio->activar($id);}
    public function eliminar($id){return $this->repositorio->eliminar($id);}
}