<?php

namespace App\Services;

use App\Interfaces\ITestimonioRepository;

class TestimonioService
{
    protected $repositorio;

    public function __construct(ITestimonioRepository $repositorio)
    {
        $this->repositorio = $repositorio;
    }

    public function obtenerTodos($soloActivos = false)
    {
        return $this->repositorio->obtenerTodos($soloActivos);
    }

    public function obtenerPorId(string $id)
    {
        return $this->repositorio->obtenerPorId($id);
    }

    public function crear(array $datos)
    {
        return $this->repositorio->crear($datos);
    }

    public function actualizar(string $id, array $datos)
    {
        return $this->repositorio->actualizar($id, $datos);
    }

    public function eliminar(string $id)
    {
        return $this->repositorio->eliminar($id);
    }

    public function activar(string $id)
    {
        return $this->repositorio->activar($id);
    }
}