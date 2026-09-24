<?php

namespace App\Interfaces;

interface IUsuarioRepository
{
    public function obtenerTodos();
    public function obtenerPorId($id);
    public function obtenerPorCorreo($correo);
    public function crear(array $datos);
    public function actualizar($id, array $datos);
    public function eliminar($id);
    public function actualizarEstadoYVencimiento($id, string $estado, ?string $fechaVencimiento = null);
    public function asignarRutinas($id, array $rutinasIds);
}