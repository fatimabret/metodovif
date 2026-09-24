<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Usuario;
use App\Models\Ejercicio;
use App\Models\NivelMembresia;

class DashboardController extends Controller
{
    public function getResumen()
    {
        Usuario::whereRaw("LOWER(estado) = 'activa'")
            ->whereNotNull('fecha_vencimiento')
            ->whereDate('fecha_vencimiento', '<', now()->toDateString())
            ->update(['estado' => 'vencida']);

        Usuario::whereRaw("LOWER(estado) = 'vencida'")
            ->whereNotNull('fecha_vencimiento')
            ->whereDate('fecha_vencimiento', '>=', now()->toDateString())
            ->update(['estado' => 'activa']);

        $metricas = [
            'alumnasActivas' => Usuario::whereRaw("LOWER(estado) = 'activa'")->count(),
            'alumnasInactivas' => Usuario::whereRaw("LOWER(estado) IN ('baja', 'inactiva', 'vencida', 'pendiente')")->count(),
            'videosActivos' => Ejercicio::where('activo', true)->count(),
            'videosOcultos' => Ejercicio::where('activo', false)->count(),
            'planesVisibles' => NivelMembresia::where('activo', true)->count(),
            'guardadosTotales' => DB::table('ejercicio_favorito')->count()
        ];

        $videoDestacado = null;
        $topVideo = DB::table('ejercicio_favorito')
            ->join('ejercicio', 'ejercicio_favorito.id_ejercicio', '=', 'ejercicio.id_ejercicio')
            ->select('ejercicio.id_ejercicio', 'ejercicio.titulo', DB::raw('COUNT(ejercicio_favorito.id_ejercicio) as cantidad'))
            ->groupBy('ejercicio.id_ejercicio', 'ejercicio.titulo')
            ->orderByDesc('cantidad')
            ->first();

        if ($topVideo) {
            $disciplina = DB::table('categoria_ejercicio')
                ->join('categoria', 'categoria_ejercicio.id_categoria', '=', 'categoria.id_categoria')
                ->where('categoria_ejercicio.id_ejercicio', $topVideo->id_ejercicio)
                ->value('categoria.titulo');

            $videoDestacado = [
                'videoTitulo' => $topVideo->titulo,
                'disciplina' => $disciplina ?: 'Sin categoría',
                'cantidadGuardados' => $topVideo->cantidad
            ];
        }

        $distribucion = DB::table('nivel_membresia')
            ->leftJoin('usuario', function($join) {
                $join->on('nivel_membresia.id_nivel', '=', 'usuario.id_nivel')
                     ->whereRaw("LOWER(usuario.estado) = 'activa'");
            })
            ->select('nivel_membresia.titulo as plan_titulo', DB::raw('COUNT(usuario.id_usuario) as cantidad_alumnas'))
            ->groupBy('nivel_membresia.id_nivel', 'nivel_membresia.titulo')
            ->get()
            ->map(function($item) {
                return [
                    'planTitulo' => $item->plan_titulo,
                    'cantidadAlumnas' => (int) $item->cantidad_alumnas
                ];
            });

        return response()->json([
            'metricas' => $metricas,
            'videoDestacado' => $videoDestacado,
            'distribucion' => $distribucion
        ]);
    }
}