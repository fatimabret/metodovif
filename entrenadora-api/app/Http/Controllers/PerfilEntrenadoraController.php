<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\PerfilEntrenadoraService;
use App\Models\PerfilEntrenadora;

class PerfilEntrenadoraController extends Controller
{
    protected $servicio;

    public function __construct(PerfilEntrenadoraService $servicio)
    {
        $this->servicio = $servicio;
    }

    public function index() 
    { 
        $perfiles = $this->servicio->obtenerTodos();
        
        $perfiles->load(['secciones' => function($query) {
            $query->where('activo', true)->orderBy('orden', 'asc');
        }]);

        return response()->json($perfiles, 200); 
    }
    
    public function show(string $id) 
    { 
        $perfil = $this->servicio->obtenerPorId($id);
        
        $perfil->load(['secciones' => function($query) {
            $query->where('activo', true)->orderBy('orden', 'asc');
        }]);

        return response()->json($perfil, 200); 
    }

    public function store(Request $request)
    {
        $datosValidados = $request->validate([
            'titulo_principal' => 'nullable|string|max:255',
            'biografia' => 'nullable|string',
            'anos_experiencia' => 'nullable|string|max:50',
            'cantidad_alumnas' => 'nullable|string|max:50',
            'cantidad_disciplinas' => 'nullable|string|max:50',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
            'terminos_condiciones' => 'nullable|string',
            'mostrar_testimonios' => 'nullable|boolean',
        ]);

        if ($request->hasFile('foto')) {
            $rutaArchivo = $request->file('foto')->store('perfil', 'public');
            $datosValidados['url_foto'] = asset('storage/' . $rutaArchivo);
        } else {
            $datosValidados['url_foto'] = null;
        }
        
        unset($datosValidados['foto']);

        return response()->json($this->servicio->crear($datosValidados), 201);
    }

    public function update(Request $request, string $id)
    {
        $perfil = PerfilEntrenadora::findOrFail($id);

        if ($request->has('mostrar_testimonios')) {
            $perfil->mostrar_testimonios = $request->boolean('mostrar_testimonios');
            $perfil->save();
        }

        $datosValidados = $request->validate([
            'titulo_principal' => 'nullable|string|max:255',
            'biografia' => 'nullable|string',
            'anos_experiencia' => 'nullable|string|max:50',
            'cantidad_alumnas' => 'nullable|string|max:50',
            'cantidad_disciplinas' => 'nullable|string|max:50',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
            'terminos_condiciones' => 'nullable|string',
            'mostrar_testimonios' => 'nullable|boolean',
            'secciones' => 'nullable'
        ]);

        if ($request->hasFile('foto')) {
            $rutaArchivo = $request->file('foto')->store('perfil', 'public');
            $datosValidados['url_foto'] = asset('storage/' . $rutaArchivo);
            unset($datosValidados['foto']);
        }

        $seccionesRecibidas = $request->input('secciones');
        
        if (is_string($seccionesRecibidas)) {
            $seccionesRecibidas = json_decode($seccionesRecibidas, true);
        }

        unset($datosValidados['secciones']);

        if (!empty($datosValidados)) {
            $this->servicio->actualizar($id, $datosValidados);
        }

        if (is_array($seccionesRecibidas)) {
            $idsRecibidos = collect($seccionesRecibidas)->pluck('id_seccion')->filter()->toArray();

            $perfil->secciones()->whereNotIn('id_seccion', $idsRecibidos)->delete();

            foreach ($seccionesRecibidas as $index => $seccionData) {
                $perfil->secciones()->updateOrCreate(
                    ['id_seccion' => $seccionData['id_seccion'] ?? null],
                    [
                        'titulo' => $seccionData['titulo'],
                        'descripcion' => $seccionData['descripcion'],
                        'orden' => $seccionData['orden'] ?? $index,
                        'activo' => $seccionData['activo'] ?? true
                    ]
                );
            }
        } elseif ($request->has('secciones') && empty($seccionesRecibidas)) {
            $perfil->secciones()->delete();
        }

        return response()->json($perfil->fresh(['secciones' => function($q) {
            $q->orderBy('orden', 'asc');
        }]), 200);
    }

    public function destroy(string $id)
    {
        $perfilBaja = $this->servicio->eliminar($id);
        
        return response()->json([
            'mensaje' => 'Información de inicio deshabilitada.',
            'perfil' => $perfilBaja
        ], 200);
    }

    public function activar(string $id)
    {
        $perfilReactivado = $this->servicio->activar($id);
        
        return response()->json([
            'mensaje' => 'Información de inicio habilitada.',
            'perfil' => $perfilReactivado
        ], 200);
    }
}