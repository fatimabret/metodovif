<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\UsuarioService;
use App\Models\Usuario;

use Illuminate\Support\Facades\Mail;
use App\Mail\AlumnaAprobadaMail;
use Illuminate\Support\Facades\Log;

use App\Http\Resources\UsuarioResource;

class UsuarioController extends Controller
{
    protected $servicio;

    public function __construct(UsuarioService $servicio)
    {
        $this->servicio = $servicio;
    }

    public function index(Request $request)
    {
        Usuario::whereRaw("LOWER(estado) = 'activa'")
            ->whereNotNull('fecha_vencimiento')
            ->whereDate('fecha_vencimiento', '<', now()->toDateString())
            ->update(['estado' => 'vencida']);

        Usuario::whereRaw("LOWER(estado) = 'vencida'")
            ->whereNotNull('fecha_vencimiento')
            ->whereDate('fecha_vencimiento', '>=', now()->toDateString())
            ->update(['estado' => 'activa']);

        $usuarios = $this->servicio->obtenerTodos();
        
        return response()->json(UsuarioResource::collection($usuarios));
    }

    public function store(Request $request)
    {
        $mensajes = [
            'nombre.required' => 'El nombre completo es obligatorio.',
            'nombre.string' => 'El nombre debe contener texto válido.',
            'nombre.max' => 'El nombre no puede exceder los 100 caracteres.',
            'correo.required' => 'El correo electrónico es obligatorio.',
            'correo.email' => 'Debes ingresar un formato de correo válido.',
            'correo.unique' => 'Este correo ya se encuentra registrado en el sistema.',
            'contrasenia.required' => 'La contraseña es obligatoria.',
            'contrasenia.min' => 'La contraseña debe tener al menos 6 caracteres por seguridad.',
            'extra.max' => 'La información adicional no puede exceder los 500 caracteres.',
        ];

        $datosValidados = $request->validate([
            'nombre' => 'required|string|max:100|regex:/^[\pL\s\-]+$/u',
            'correo' => 'required|email:rfc,dns|max:100|unique:usuario,correo',
            'contrasenia' => 'required|string|min:6',
            'extra' => 'nullable|string|max:500',
        ], $mensajes);

        $datosValidados['estado'] = 'pendiente';

        $nuevoUsuario = $this->servicio->crear($datosValidados);
        
        return response()->json([
            'mensaje' => 'Perfecto! Tu cuenta está pendiente de aprobación por la entrenadora.
                        Recibirás un correo de confirmación y podrás acceder a la plataforma.',
            'usuario' => $nuevoUsuario
        ], 201);
    }

    public function show($id)
    {
        $usuario = $this->servicio->obtenerPorId($id);
        
        $data = UsuarioResource::make($usuario)->resolve();
        $data['ejerciciosFavoritos'] = $usuario->ejerciciosFavoritos;
        
        return response()->json($data);
    }

    public function aprobar(Request $request, string $id)
    {
        $datosValidados = $request->validate([
            'id_nivel' => 'required|integer|exists:nivel_membresia,id_nivel',
            'fecha_vencimiento' => 'required|date'
        ]);

        $usuarioActualizado = $this->servicio->aprobarAlumna($id, $datosValidados);
        
        try {
            Mail::to($usuarioActualizado->correo)->send(new AlumnaAprobadaMail($usuarioActualizado));
        } catch (\Exception $e) {
            Log::error("Error al enviar correo de aprobación a " . $usuarioActualizado->correo . ": " . $e->getMessage());
        }
        
        return response()->json([
            'mensaje' => 'Alumna aprobada y plan asignado!',
            'usuario' => $usuarioActualizado
        ], 200);
    }

    public function update(Request $request, string $id)
    {
        $datosValidados = $request->validate([
            'nombre' => 'sometimes|string|max:100',
            'correo' => 'sometimes|email|max:100|unique:usuario,correo,' . $id . ',id_usuario',
            'contrasenia' => 'sometimes|string|min:6',
            'extra' => 'nullable|string',
            'id_nivel' => 'sometimes|integer|exists:nivel_membresia,id_nivel',
            'estado' => 'sometimes|string|in:activa,inactiva,pendiente,baja,vencida',
            'fecha_vencimiento' => 'sometimes|date' 
        ]);

        $usuarioPrevio = Usuario::findOrFail($id);
        $estadoAnterior = strtolower($usuarioPrevio->estado);

        if (isset($datosValidados['fecha_vencimiento'])) {
            $fecha = \Carbon\Carbon::parse($datosValidados['fecha_vencimiento'])->startOfDay();
            
            if ($fecha->greaterThanOrEqualTo(now()->startOfDay())) {
                $datosValidados['estado'] = 'activa';
            }
        }

        $usuarioActualizado = $this->servicio->actualizar($id, $datosValidados);
        
        $estadoNuevo = strtolower($usuarioActualizado->estado);
        if ($estadoNuevo === 'activa' && $estadoAnterior !== 'activa') {
            try {
                Mail::to($usuarioActualizado->correo)->send(new AlumnaAprobadaMail($usuarioActualizado));
            } catch (\Exception $e) {
                Log::error("Error al enviar correo de reactivación a " . $usuarioActualizado->correo . ": " . $e->getMessage());
            }
        }
        
        return response()->json($usuarioActualizado, 200);
    }

    public function darDeBaja(string $id)
    {
        $usuarioActualizado = $this->servicio->darDeBajaAlumna($id);
        return response()->json([
            'mensaje' => 'Alumna dada de baja!',
            'usuario' => $usuarioActualizado
        ], 200);
    }

    public function destroy(string $id)
    {
        $usuarioBaja = $this->servicio->eliminar($id);
        
        return response()->json([
            'mensaje' => 'Alumna deshabilitada.',
            'usuario' => $usuarioBaja
        ], 200);
    }

    public function asignarRutinas(Request $request, string $id)
    {
        $datosValidados = $request->validate([
            'rutinas' => 'required|array',
            'rutinas.*' => 'integer|exists:rutina,id_rutina'
        ]);

        $usuarioActualizado = $this->servicio->asignarRutinas($id, $datosValidados['rutinas']);

        return response()->json([
            'mensaje' => 'Rutinas asignadas con éxito!',
            'usuario' => $usuarioActualizado
        ], 200);
    }

    public function miPerfil(Request $request)
    {
        $usuario = $request->user()->load(['ejerciciosFavoritos', 'rutinas.ejercicios']);
        
        $diasRestantes = 0;
        if ($usuario->fecha_vencimiento) {
            $fechaVencimiento = \Carbon\Carbon::parse($usuario->fecha_vencimiento)->startOfDay();
            $hoy = now()->startOfDay();
            $diasRestantes = $hoy->diffInDays($fechaVencimiento, false);

            if ($diasRestantes > 0 && strtolower($usuario->estado) === 'vencida') {
                $usuario->estado = 'activa';
                $usuario->save();
            } elseif ($diasRestantes <= 0 && strtolower($usuario->estado) === 'activa') {
                $usuario->estado = 'vencida';
                $usuario->save();
            }

            if ($diasRestantes < 0) $diasRestantes = 0;
        }

        $plan = \Illuminate\Support\Facades\DB::table('nivel_membresia')
                    ->where('id_nivel', $usuario->id_nivel)->first();

        return response()->json([
            'nombre' => $usuario->nombre,
            'plan' => $plan ? $plan->titulo : 'Sin plan',
            'diasRestantes' => intval($diasRestantes),
            'permiteRutinas' => $plan ? (bool) $plan->incluye_rutinas : false,
            'estado' => $usuario->estado,
            'favoritos' => $usuario->ejerciciosFavoritos->pluck('id_ejercicio'),
            'rutinas' => $usuario->rutinas
        ], 200);
    }

    public function toggleFavorito(Request $request, string $idEjercicio)
    {
        $usuario = $request->user();
        
        $usuario->ejerciciosFavoritos()->toggle($idEjercicio);

        return response()->json([
            'mensaje' => 'Lista de guardados actualizada.',
            'favoritos' => $usuario->ejerciciosFavoritos()->pluck('ejercicio.id_ejercicio')
        ], 200);
    }
}