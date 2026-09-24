<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\GaleriaService;

class GaleriaController extends Controller
{
    protected $servicio;

    public function __construct(GaleriaService $servicio)
    {
        $this->servicio = $servicio;
    }

    public function index() 
    { 
        $fotosActivas = \App\Models\Galeria::where('activo', true)
                                           ->orderBy('id_galeria', 'desc')
                                           ->get();
                                           
        return response()->json($fotosActivas, 200); 
    }
    
    public function show(string $id) { 
        return response()->json($this->servicio->obtenerPorId($id), 200); 
    }

    public function store(Request $request)
{
    // 1. Validamos que reciba un archivo de imagen real (máximo 5MB)
    $request->validate([
        'foto' => 'required|image|mimes:jpeg,png,jpg,webp|max:5120',
        'descripcion' => 'nullable|string|max:255'
    ]);

    // 2. Guardamos el archivo físico en storage/app/public/galeria
    $rutaArchivo = $request->file('foto')->store('galeria', 'public');

    // 3. Generamos la URL pública automáticamente
    $urlPublica = asset('storage/' . $rutaArchivo);
    
    // 4. Guardamos en la base de datos
    $datosParaGuardar = [
        'url_foto' => $urlPublica,
        'descripcion' => $request->descripcion
    ];

    return response()->json($this->servicio->crear($datosParaGuardar), 201);
}

    public function update(Request $request, string $id)
    {
        $datosValidados = $request->validate([
            'url_foto' => 'sometimes|url|max:255',
            'descripcion' => 'nullable|string|max:255'
        ]);
        
        return response()->json($this->servicio->actualizar($id, $datosValidados), 200);
    }

    public function destroy(string $id)
    {
        $fotoBaja = $this->servicio->eliminar($id);
        
        return response()->json([
            'mensaje' => 'Foto removida de la galería.',
            'galeria' => $fotoBaja
        ], 200);
    }

    public function activar(string $id)
    {
        $fotoReactivada = $this->servicio->activar($id);
        
        return response()->json([
            'mensaje' => 'Foto subida en la galería.',
            'galeria' => $fotoReactivada
        ], 200);
    }
}