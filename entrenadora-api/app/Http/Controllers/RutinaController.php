<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\RutinaService;

class RutinaController extends Controller
{
    protected $servicio;

    public function __construct(RutinaService $servicio)
    {
        $this->servicio = $servicio;
    }

    public function index(Request $request)
    {
        $usuario = $request->user();

        // Si es una Alumna (Aislamiento)
        if ($usuario instanceof \App\Models\Usuario) {
            
            // 1. Verificamos que tenga la membresía al día
            if ($usuario->estado !== 'activa' || $usuario->fecha_vencimiento < now()) {
                return response()->json(['mensaje' => 'Membresía vencida!'], 403);
            }

            // 2. Devolvemos EXCLUSIVAMENTE las rutinas que la entrenadora le asignó
            // (Utiliza la relación 'rutinas()' que ya tienes en el modelo Usuario)
            $rutinasAsignadas = $usuario->rutinas()->get();
            return response()->json($rutinasAsignadas);
        }

        // Si es la Entrenadora (modelo User), devolvemos el catálogo completo
        $todasLasRutinas = $this->servicio->obtenerTodos(); // o Rutina::all()
        return response()->json($todasLasRutinas);
    }
    
    public function show(Request $request, $id)
    {
        $usuarioLogueado = $request->user();

        // Validaciones exclusivas si quien consulta es una alumna
        if ($usuarioLogueado instanceof \App\Models\Usuario) {
            
            if ($usuarioLogueado->estado !== 'activa' || $usuarioLogueado->fecha_vencimiento < now()) {
                return response()->json(['mensaje' => 'Membresía vencida!'], 403);
            }

            // Comprobamos si el ID de la rutina solicitada existe en su tabla pivote 'usuario_rutina'
            $tieneRutina = $usuarioLogueado->rutinas()->where('rutina.id_rutina', $id)->exists();

            if (!$tieneRutina) {
                return response()->json(['mensaje' => 'Acceso denegado!'], 403);
            }
        }

        // Si es la entrenadora o si la alumna superó las validaciones, devolvemos la rutina
        $rutina = $this->servicio->obtenerPorId($id);
        return response()->json($rutina);
    }

    public function store(Request $request)
    {
        $datosValidados = $request->validate([
            'titulo' => 'required|string|max:150',
            'descripcion' => 'nullable|string',
            'categoria' => 'required|string|max:100',
            'ejercicios' => 'sometimes|array',
            
            'ejercicios.*.id_ejercicio' => 'required|integer|exists:ejercicio,id_ejercicio',
            'ejercicios.*.series' => 'required|integer|min:1',
            'ejercicios.*.repeticiones' => 'required|string|max:50',
            'ejercicios.*.nota' => 'nullable|string|max:255'
        ]);
        
        return response()->json($this->servicio->crear($datosValidados), 201);
    }
    
    public function update(Request $request, string $id)
    {
        $datosValidados = $request->validate([
            'titulo' => 'sometimes|string|max:150',
            'descripcion' => 'sometimes|string',
            'categoria' => 'sometimes|string|max:100',
            'ejercicios' => 'sometimes|array',
            
            'ejercicios.*.id_ejercicio' => 'required|integer|exists:ejercicio,id_ejercicio',
            'ejercicios.*.series' => 'required|integer|min:1',
            'ejercicios.*.repeticiones' => 'required|string|max:50',
            'ejercicios.*.nota' => 'nullable|string|max:255'
        ]);
    
        return response()->json($this->servicio->actualizar($id, $datosValidados), 200);
    }

    public function destroy(string $id)
    {
        $rutinaBaja = $this->servicio->eliminar($id);
        
        return response()->json([
            'mensaje' => 'Rutina deshabilitada.',
            'rutina' => $rutinaBaja
        ], 200);
    }

    public function activar(string $id)
    {
        $rutinaReactivada = $this->servicio->activar($id);
        
        return response()->json([
            'mensaje' => 'Rutina habilitada.',
            'rutina' => $rutinaReactivada
        ], 200);
    }
}