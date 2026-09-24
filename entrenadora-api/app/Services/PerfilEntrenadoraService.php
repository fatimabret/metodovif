<?php

namespace App\Services;

use App\Interfaces\IPerfilEntrenadoraRepository;

class PerfilEntrenadoraService
{
    protected $repositorio;

    public function __construct(IPerfilEntrenadoraRepository $repositorio)
    {
        $this->repositorio = $repositorio;
    }

    public function obtenerTodos() { return $this->repositorio->obtenerTodos(); }
    public function obtenerPorId($id) { return $this->repositorio->obtenerPorId($id); }
    public function crear(array $datos) { return $this->repositorio->crear($datos); }
    public function actualizar($id, array $datos) { return $this->repositorio->actualizar($id, $datos); }
    public function eliminar($id) { return $this->repositorio->eliminar($id); }
    public function activar($id) { return $this->repositorio->activar($id); }
}