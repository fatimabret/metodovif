<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\ContactoService;
use App\Http\Resources\ContactoResource;

class ContactoController extends Controller
{
    protected $servicio;

    public function __construct(ContactoService $servicio)
    {
        $this->servicio = $servicio;
    }

    public function index(Request $request)
    {
        $usuarioLogueado = $request->user();
        
        // Si es alumna, pasamos 'true' para filtrar solo los activos
        $soloActivos = $usuarioLogueado instanceof \App\Models\Usuario; 

        // El controlador delega la bandera booleana al servicio/repositorio
        $membresias = $this->servicio->obtenerTodos($soloActivos);
        
        return response()->json(ContactoResource::collection($membresias));
    }
    
    public function show(string $id) { 
        return response()->json(ContactoResource::make($this->servicio->obtenerPorId($id)), 200); 
    }

    public function store(Request $request)
    {
        $datosValidados = $request->validate([
            'plataforma' => 'required|string|max:50',
            'valor_visible' => 'required|string|max:100',
            'url_destino' => 'required|string|max:255'
        ]);
        
        return response()->json($this->servicio->crear($datosValidados), 201);
    }

    public function update(Request $request, string $id)
    {
        $datosValidados = $request->validate([
            'plataforma' => 'sometimes|string|max:50',
            'valor_visible' => 'sometimes|string|max:100',
            'url_destino' => 'sometimes|string|max:255'
        ]);
        
        return response()->json($this->servicio->actualizar($id, $datosValidados), 200);
    }

    public function destroy(string $id)
    {
        $contactoBaja = $this->servicio->eliminar($id);
        
        return response()->json([
            'mensaje' => 'Medio de contacto desabilitado.',
            'contacto' => $contactoBaja
        ], 200);
    }

    public function activar(string $id)
    {
        $contactoReactivado = $this->servicio->activar($id);
        
        return response()->json([
            'mensaje' => 'Medio de contacto habilitado.',
            'contacto' => $contactoReactivado
        ], 200);
    }
}