<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckPropietario
{
    public function handle(Request $request, Closure $next): Response
    {
        $usuarioLogueado = $request->user();
        $idSolicitado = $request->route('id');

        // Si es la entrenadora (modelo User), tiene acceso total
        if ($usuarioLogueado instanceof \App\Models\User) {
            return $next($request);
        }

        // Si es una alumna (modelo Usuario), solo puede acceder si el ID solicitado es el suyo
        if ($usuarioLogueado instanceof \App\Models\Usuario) {
            if ($usuarioLogueado->id_usuario != $idSolicitado) {
                return response()->json([
                    'mensaje' => 'Acceso denegado!'
                ], 403);
            }
        }

        return $next($request);
    }
}