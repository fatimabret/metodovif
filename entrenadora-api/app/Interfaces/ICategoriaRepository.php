<?php

namespace App\Interfaces;

interface ICategoriaRepository
{
    public function obtenerTodos();
    public function obtenerPorId($id);
    public function crear(array $datos);
    public function actualizar($id, array $datos);
    public function eliminar($id);
    public function activar($id);
}