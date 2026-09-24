<?php

namespace App\Repositories;

use App\Interfaces\ITestimonioRepository;
use App\Models\Testimonio;

class TestimonioRepository implements ITestimonioRepository
{
    public function obtenerTodos($soloActivos = false)
    {
        $query = Testimonio::with('imagenes');
        if ($soloActivos) {
            $query->where('activo', true);
        }
        return $query->orderBy('id_testimonio', 'desc')->get();
    }

    public function obtenerPorId(string $id)
    {
        return Testimonio::with('imagenes')->findOrFail($id);
    }

    public function crear(array $datos)
    {
        return Testimonio::create($datos);
    }

    public function actualizar(string $id, array $datos)
    {
        $testimonio = Testimonio::findOrFail($id);
        $testimonio->update($datos);
        return $testimonio;
    }

    public function eliminar(string $id)
    {
        $testimonio = Testimonio::findOrFail($id);
        $testimonio->activo = false;
        $testimonio->save();
        return $testimonio;
    }

    public function activar(string $id)
    {
        $testimonio = Testimonio::findOrFail($id);
        $testimonio->activo = true;
        $testimonio->save();
        return $testimonio;
    }
}