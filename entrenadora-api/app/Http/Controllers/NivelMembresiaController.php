<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\NivelMembresiaService;
use Illuminate\Support\Facades\DB;

class NivelMembresiaController extends Controller
{
    protected $servicio;

    public function __construct(NivelMembresiaService $servicio) 
    {
        $this->servicio = $servicio;
    }

    public function index(Request $request)
    {
        $usuarioLogueado = $request->user();
        $soloActivos = $usuarioLogueado instanceof \App\Models\Usuario; 
        $niveles = \App\Models\NivelMembresia::with('categorias')->get();

        $nivelesFormateados = $niveles->map(function($nivel) {
            return [
                'id_nivel' => $nivel->id_nivel,
                'titulo' => $nivel->titulo,
                'descripcion' => $nivel->descripcion,
                'precio' => $nivel->precio,
                'activo' => (bool) $nivel->activo,
                'incluye_rutinas' => (bool) $nivel->incluye_rutinas,
                'es_popular' => (bool) ($nivel->es_popular ?? false),
                'categorias' => $nivel->categorias->pluck('id_categoria'),
                'categorias_detalle' => $nivel->categorias->pluck('titulo') 
            ];
        });
        
        return response()->json($nivelesFormateados, 200);
    }

    public function store(Request $request)
    {
        $datosValidados = $request->validate([
            'titulo' => 'required|string|max:100',
            'descripcion' => 'required|string|max:255',
            'precio' => 'required|numeric|min:0',
            'incluye_rutinas' => 'required|boolean',
            'es_popular' => 'sometimes|boolean',
            'categorias' => 'nullable|array',
            'categorias.*' => 'exists:categoria,id_categoria'
        ]);

        $idsCategorias = $datosValidados['categorias'] ?? [];
        unset($datosValidados['categorias']);

        $nuevoNivel = $this->servicio->crear($datosValidados);

        if (!empty($idsCategorias)) {
            foreach ($idsCategorias as $idCat) {
                DB::table('nivel_membresia_categoria')->insert([
                    'id_nivel' => $nuevoNivel->id_nivel,
                    'id_categoria' => $idCat
                ]);
            }
        }

        return response()->json($nuevoNivel, 201); 
    }

    public function show(string $id)
    {
        $nivel = $this->servicio->obtenerPorId($id);
        return response()->json($nivel, 200);
    }

    public function update(Request $request, string $id)
    {
        $datosValidados = $request->validate([
            'titulo' => 'sometimes|string|max:100',
            'descripcion' => 'sometimes|string|max:255',
            'precio' => 'sometimes|numeric|min:0',
            'incluye_rutinas' => 'required|boolean',
            'es_popular' => 'sometimes|boolean',
            'categorias' => 'nullable|array',
            'categorias.*' => 'exists:categoria,id_categoria'
        ]);

        $idsCategorias = $request->input('categorias', null);
        unset($datosValidados['categorias']);

        $nivelActualizado = $this->servicio->actualizar($id, $datosValidados);

        if ($idsCategorias !== null) {
            DB::table('nivel_membresia_categoria')->where('id_nivel', $id)->delete();
            foreach ($idsCategorias as $idCat) {
                DB::table('nivel_membresia_categoria')->insert([
                    'id_nivel' => $id,
                    'id_categoria' => $idCat
                ]);
            }
        }

        return response()->json($nivelActualizado, 200);
    }

    public function activar(string $id)
    {
        $nivelReactivado = $this->servicio->activar($id);
        
        return response()->json([
            'mensaje' => 'Membresía habilitada.',
            'nivel' => $nivelReactivado
        ], 200);
    }

    public function destroy(string $id)
    {
        $nivelBaja = $this->servicio->eliminar($id);
        
        return response()->json([
            'mensaje' => 'Membresía deshabilitada.',
            'nivel' => $nivelBaja
        ], 200);
    }
}