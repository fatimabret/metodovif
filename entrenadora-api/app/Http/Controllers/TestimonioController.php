<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\TestimonioService;
use App\Models\TestimonioImagen;

class TestimonioController extends Controller
{
    protected $servicio;

    public function __construct(TestimonioService $servicio)
    {
        $this->servicio = $servicio;
    }

    public function index(Request $request)
    {
        $soloActivos = $request->query('activos', false);
        return response()->json($this->servicio->obtenerTodos($soloActivos), 200);
    }

    public function show(string $id)
    {
        return response()->json($this->servicio->obtenerPorId($id), 200);
    }

    public function store(Request $request)
    {
        $datosValidados = $request->validate([
            'titulo' => 'nullable|string|max:255',
            'descripcion' => 'nullable|string',
            'nombre_alumna' => 'nullable|string|max:100',
            'activo' => 'nullable|boolean',
            'fotos' => 'nullable|array',
            'fotos.*' => 'image|mimes:jpeg,png,jpg,webp|max:5120'
        ]);

        $testimonioData = [
            'titulo' => $request->filled('titulo') ? $request->titulo : null,
            'descripcion' => $request->filled('descripcion') ? $request->descripcion : null,
            'nombre_alumna' => $request->filled('nombre_alumna') ? $request->nombre_alumna : null,
            'activo' => $request->input('activo', true)
        ];

        $nuevoTestimonio = $this->servicio->crear($testimonioData);

        if ($request->hasFile('fotos')) {
            foreach ($request->file('fotos') as $foto) {
                $rutaArchivo = $foto->store('testimonios', 'public');
                $urlCompleta = asset('storage/' . $rutaArchivo);

                TestimonioImagen::create([
                    'id_testimonio' => $nuevoTestimonio->id_testimonio,
                    'url_foto' => $urlCompleta
                ]);
            }
        }

        return response()->json($nuevoTestimonio->load('imagenes'), 201);
    }

    public function update(Request $request, string $id)
    {
        $datosValidados = $request->validate([
            'titulo' => 'nullable|string|max:255',
            'descripcion' => 'nullable|string',
            'nombre_alumna' => 'nullable|string|max:100',
            'activo' => 'sometimes|boolean',
            'fotos' => 'nullable|array',
            'fotos.*' => 'image|mimes:jpeg,png,jpg,webp|max:5120'
        ]);

        $testimonioData = [
            'titulo' => $request->filled('titulo') ? $request->titulo : null,
            'descripcion' => $request->filled('descripcion') ? $request->descripcion : null,
            'nombre_alumna' => $request->filled('nombre_alumna') ? $request->nombre_alumna : null,
        ];

        if ($request->has('activo')) {
            $testimonioData['activo'] = $request->input('activo');
        }

        $testimonioActualizado = $this->servicio->actualizar($id, $testimonioData);

        if ($request->hasFile('fotos')) {
            foreach ($request->file('fotos') as $foto) {
                $rutaArchivo = $foto->store('testimonios', 'public');
                $urlCompleta = asset('storage/' . $rutaArchivo);

                TestimonioImagen::create([
                    'id_testimonio' => $testimonioActualizado->id_testimonio,
                    'url_foto' => $urlCompleta
                ]);
            }
        }

        return response()->json($testimonioActualizado->load('imagenes'), 200);
    }

    public function destroy(string $id)
    {
        $testimonioBaja = $this->servicio->eliminar($id);
        return response()->json([
            'mensaje' => 'Testimonio deshabilitado.',
            'testimonio' => $testimonioBaja
        ], 200);
    }

    public function activar(string $id)
    {
        $testimonioReactivado = $this->servicio->activar($id);
        return response()->json([
            'mensaje' => 'Testimonio habilitado.',
            'testimonio' => $testimonioReactivado
        ], 200);
    }

    public function eliminarImagen(string $id)
{
    $imagen = \App\Models\TestimonioImagen::findOrFail($id);
    
    // Extraer la ruta relativa para borrar el archivo físico del disco
    $rutaRelativa = str_replace(asset('storage/'), '', $imagen->url_foto);
    \Illuminate\Support\Facades\Storage::disk('public')->delete($rutaRelativa);

    // Borrar el registro de la base de datos
    $imagen->delete();

    return response()->json([
        'mensaje' => 'Imagen y archivo eliminados con éxito.'
    ], 200);
}
}