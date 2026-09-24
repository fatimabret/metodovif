<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\EjercicioService;
use Illuminate\Support\Facades\DB;

class EjercicioController extends Controller
{
    protected $servicio;

    public function __construct(EjercicioService $servicio)
    {
        $this->servicio = $servicio;
    }

    public function index() 
    { 
        // Usamos Eloquent para traer TODOS los ejercicios
        $ejercicios = \App\Models\Ejercicio::with(['categorias', 'etiquetas'])
            ->orderBy('id_ejercicio', 'desc')
            ->get();

        $ejerciciosFormateados = $ejercicios->map(function($ej) {
            return [
                'id_categoria' => $ej->categorias->first()->id_categoria ?? null,
                'categoria' => [
                    'titulo' => $ej->categorias->first()->titulo ?? 'Sin categoría'
                ],
                'id_ejercicio' => $ej->id_ejercicio,
                'titulo' => $ej->titulo,
                'descripcion' => $ej->descripcion,
                'video_url' => $ej->video_url,
                'activo' => (bool) $ej->activo,
                'es_de_prueba' => (bool) $ej->es_de_prueba,
                'guardados' => $ej->guardados, 
                'etiquetas' => $ej->etiquetas->map(function($et) {
                    return [
                        'id_etiqueta' => $et->id_etiqueta,
                        'titulo' => $et->titulo
                    ];
                })
            ];
        });

        return response()->json($ejerciciosFormateados, 200); 
    }
    
    public function show(string $id) { 
        return response()->json($this->servicio->obtenerPorId($id), 200); 
    }

    public function store(Request $request)
    {
        $datosValidados = $request->validate([
            'titulo' => 'required|string|max:100',
            'descripcion' => 'nullable|string', 
            'video_url' => 'required|url|max:255',
            'id_categoria' => 'required|exists:categoria,id_categoria',
            'id_etiquetas' => 'sometimes|array',
            'id_etiquetas.*' => 'exists:etiqueta,id_etiqueta'
        ]);

        $idCategoria = $datosValidados['id_categoria'];
        $idEtiquetas = $datosValidados['id_etiquetas'] ?? [];
        
        unset($datosValidados['id_categoria'], $datosValidados['id_etiquetas']);
        
        $datosValidados['es_de_prueba'] = $request->input('es_de_prueba', false);

        $nuevoEjercicio = $this->servicio->crear($datosValidados);

        DB::table('categoria_ejercicio')->insert([
            'id_categoria' => $idCategoria,
            'id_ejercicio' => $nuevoEjercicio->id_ejercicio
        ]);

        foreach ($idEtiquetas as $idEtiqueta) {
            DB::table('ejercicio_etiqueta')->insert([
                'id_ejercicio' => $nuevoEjercicio->id_ejercicio,
                'id_etiqueta' => $idEtiqueta
            ]);
        }

        $categoriaBD = DB::table('categoria')->where('id_categoria', $idCategoria)->first();
        $etiquetasBD = DB::table('etiqueta')->whereIn('id_etiqueta', $idEtiquetas)->get();

        return response()->json([
            'id_ejercicio' => $nuevoEjercicio->id_ejercicio,
            'titulo' => $nuevoEjercicio->titulo,
            'descripcion' => $nuevoEjercicio->descripcion,
            'video_url' => $nuevoEjercicio->video_url,
            'activo' => true,
            'guardados' => 0,
            'categoria' => [
                'titulo' => $categoriaBD->titulo
            ],
            'es_de_prueba' => (bool) $nuevoEjercicio->es_de_prueba,
            'etiquetas' => $etiquetasBD
        ], 201);
    }

    public function update(Request $request, string $id)
    {
        $datosValidados = $request->validate([
            'titulo' => 'sometimes|string|max:100',
            'descripcion' => 'nullable|string',
            'video_url' => 'sometimes|url|max:255',
            'es_de_prueba' => 'sometimes|boolean',
            'id_categoria' => 'sometimes|exists:categoria,id_categoria',
            'id_etiquetas' => 'sometimes|array',
            'id_etiquetas.*' => 'exists:etiqueta,id_etiqueta'
        ]);

        $idCategoria = $request->input('id_categoria');
        $idEtiquetas = $request->input('id_etiquetas');
        unset($datosValidados['id_categoria'], $datosValidados['id_etiquetas']);

        $this->servicio->actualizar($id, $datosValidados);

        if ($request->has('id_categoria')) {
            \Illuminate\Support\Facades\DB::table('categoria_ejercicio')->where('id_ejercicio', $id)->delete();
            \Illuminate\Support\Facades\DB::table('categoria_ejercicio')->insert([
                'id_categoria' => $idCategoria,
                'id_ejercicio' => $id
            ]);
        }

        if ($request->has('id_etiquetas')) {
            \Illuminate\Support\Facades\DB::table('ejercicio_etiqueta')->where('id_ejercicio', $id)->delete();
            foreach ($idEtiquetas as $idEtiqueta) {
                \Illuminate\Support\Facades\DB::table('ejercicio_etiqueta')->insert([
                    'id_ejercicio' => $id,
                    'id_etiqueta' => $idEtiqueta
                ]);
            }
        }

        $ej = \App\Models\Ejercicio::with(['categorias', 'etiquetas'])->find($id);
        
        return response()->json([
            'id_ejercicio' => $ej->id_ejercicio,
            'titulo' => $ej->titulo,
            'descripcion' => $ej->descripcion,
            'video_url' => $ej->video_url,
            'activo' => (bool) $ej->activo,
            'es_de_prueba' => (bool) $ej->es_de_prueba,
            'guardados' => $ej->guardados, 
            'id_categoria' => $ej->categorias->first()->id_categoria ?? null,
            'categoria' => ['titulo' => $ej->categorias->first()->titulo ?? 'Sin categoría'],
            'etiquetas' => $ej->etiquetas->map(fn($et) => ['id_etiqueta' => $et->id_etiqueta, 'titulo' => $et->titulo])
        ], 200);
    }

    public function destroy(string $id)
    {
        $ejercicioBaja = $this->servicio->eliminar($id);
        
        return response()->json([
            'mensaje' => 'Ejercicio inabilitado.',
            'ejercicio' => $ejercicioBaja
        ], 200);
    }

    public function activar(string $id)
    {
        $ejercicioReactivado = $this->servicio->activar($id);
        
        return response()->json([
            'mensaje' => 'Ejercicio habilitado.',
            'ejercicio' => $ejercicioReactivado
        ], 200);
    }
}