<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\CategoriaService;

use App\Http\Resources\CategoriaResource;

class CategoriaController extends Controller
{
    protected $servicio;

    public function __construct(CategoriaService $servicio)
    {
        $this->servicio = $servicio;
    }

    public function index()
    {
        // Obtenemos todas las categorías (disciplinas)
        $categorias = $this->servicio->obtenerTodos();
        
        // Mapeamos la colección asegurando que el campo 'activo' viaje como booleano
        $categoriasFormateadas = $categorias->map(function($cat) {
            return [
                'id_categoria' => $cat->id_categoria,
                'titulo' => $cat->titulo,
                'descripcion' => $cat->descripcion,
                'activo' => (bool) $cat->activo
            ];
        });

        return response()->json($categoriasFormateadas, 200);
    }
    
    public function show($id)
    {
        $categoria = $this->servicio->obtenerPorId($id);
        
        return response()->json(CategoriaResource::make($categoria));
    }

    public function store(Request $request)
    {
        $datosValidados = $request->validate([
            'titulo' => 'required|string|max:100',
            'descripcion' => 'required|string'
        ]);
        return response()->json($this->servicio->crear($datosValidados), 201);
    }

    public function update(Request $request, string $id)
    {
        $datosValidados = $request->validate([
            'titulo' => 'sometimes|string|max:100',
            'descripcion' => 'sometimes|string'
        ]);
        return response()->json($this->servicio->actualizar($id, $datosValidados), 200);
    }

    public function destroy(string $id)
    {
        $categoriaBaja = $this->servicio->eliminar($id);
        
        return response()->json([
            'mensaje' => 'Disciplina desabilitada.',
            'categoria' => $categoriaBaja
        ], 200);
    }

    public function activar(string $id)
    {
        $categoriaReactivada = $this->servicio->activar($id);
        
        return response()->json([
            'mensaje' => 'Disciplina habilitada.',
            'categoria' => $categoriaReactivada
        ], 200);
    }
}