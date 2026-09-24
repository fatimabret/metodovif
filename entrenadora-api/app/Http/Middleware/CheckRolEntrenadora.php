<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRolEntrenadora
{
    public function handle(Request $request, Closure $next): Response
    {
        // Obtenemos quién está haciendo la petición con su token válido
        $usuarioLogueado = $request->user();

        // Si la instancia pertenece al modelo de las alumnas (tabla 'usuario'), la bloqueamos
        if ($usuarioLogueado instanceof \App\Models\Usuario) {
            return response()->json([
                'mensaje' => 'Acceso denegado!'
            ], 403);
        }

        // Si llega hasta aquí, significa que el token pertenece a la Entrenadora (modelo 'User')
        return $next($request);
    }
}