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

    public function index() { return response()->json($this->servicio->obtenerTodos(), 200); }
    
    public function show(string $id) { return response()->json($this->servicio->obtenerPorId($id), 200); }

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

        // 1. Guardamos el interruptor directamente de forma segura
        if ($request->has('mostrar_testimonios')) {
            $perfil->mostrar_testimonios = $request->boolean('mostrar_testimonios');
            $perfil->save();
        }

        // 2. ¡LA SOLUCIÓN! Cambiamos 'sometimes' por 'nullable' para que acepte nulos
        // sin que Laravel rechace la petición silenciosamente.
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
            unset($datosValidados['foto']);
        }

        if (!empty($datosValidados)) {
            $this->servicio->actualizar($id, $datosValidados);
        }

        return response()->json($perfil->fresh(), 200);
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