<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Etiqueta;

class EtiquetaController extends Controller
{
    public function index()
    {
        $etiquetas = Etiqueta::all();
        $formateadas = $etiquetas->map(fn($e) => [
            'id_etiqueta' => $e->id_etiqueta,
            'titulo' => $e->titulo,
            'activo' => (bool) $e->activo
        ]);
        return response()->json($formateadas, 200);
    }

    public function store(Request $request)
    {
        $data = $request->validate(['titulo' => 'required|string|max:100']);
        $etiqueta = Etiqueta::create($data);
        return response()->json([
            'id_etiqueta' => $etiqueta->id_etiqueta,
            'titulo' => $etiqueta->titulo,
            'activo' => true
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $data = $request->validate(['titulo' => 'sometimes|string|max:100']);
        $etiqueta = Etiqueta::findOrFail($id);
        $etiqueta->update($data);
        return response()->json([
            'id_etiqueta' => $etiqueta->id_etiqueta,
            'titulo' => $etiqueta->titulo,
            'activo' => (bool) $etiqueta->activo
        ], 200);
    }

    public function destroy($id)
    {
        $etiqueta = Etiqueta::findOrFail($id);
        $etiqueta->update(['activo' => false]);
        return response()->json(['mensaje' => 'Etiqueta deshabilitada.'], 200);
    }

    public function activar($id)
    {
        $etiqueta = Etiqueta::findOrFail($id);
        $etiqueta->update(['activo' => true]);
        return response()->json(['mensaje' => 'Etiqueta habilitada.', 'etiqueta' => $etiqueta], 200);
    }
}