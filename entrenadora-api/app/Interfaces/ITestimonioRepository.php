<?php

namespace App\Interfaces;

interface ITestimonioRepository
{
    public function obtenerTodos($soloActivos = false);
    public function obtenerPorId(string $id);
    public function crear(array $datos);
    public function actualizar(string $id, array $datos);
    public function eliminar(string $id);
    public function activar(string $id);
}