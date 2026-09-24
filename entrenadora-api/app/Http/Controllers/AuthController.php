<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Usuario; 
use App\Models\User;    
use Illuminate\Support\Facades\Hash;
use Google\Client as GoogleClient;
use Illuminate\Support\Facades\Mail;
use App\Mail\RecuperarPasswordMail;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $mensajes = [
            'correo.required' => 'El correo electrónico es obligatorio.',
            'correo.email' => 'El formato del correo no es válido.',
            'contrasenia.required' => 'La contraseña es obligatoria.',
        ];

        $request->validate([
            'correo' => 'required|email',
            'contrasenia' => 'required|string',
        ], $mensajes);

        $entrenadora = User::where('email', $request->correo)->first();

        if ($entrenadora && Hash::check($request->contrasenia, $entrenadora->password)) {
            $token = $entrenadora->createToken('auth_token')->plainTextToken;
            
            return response()->json([
                'mensaje' => 'Bienvenida al panel de control!',
                'token' => $token,
                'rol' => 'entrenadora',
                'usuario' => $entrenadora 
            ], 200);
        }

        $alumna = Usuario::where('correo', $request->correo)->first();

        if ($alumna && Hash::check($request->contrasenia, $alumna->contrasenia)) {
            
            if (in_array($alumna->estado, ['inactiva', 'baja'])) {
                return response()->json(['mensaje' => 'Tu cuenta se encuentra inactiva o vencida. Comunícate con la entrenadora.'], 403);
            }

            if ($alumna->estado === 'pendiente') {
                return response()->json(['mensaje' => 'Tu cuenta aún está pendiente de aprobación. Comunícate con la entrenadora.'], 403);
            }

            $token = $alumna->createToken('auth_token')->plainTextToken;

            return response()->json([
                'mensaje' => 'Bienvenida a tu entrenamiento!',
                'token' => $token,
                'rol' => 'alumna', 
                'usuario' => $alumna 
            ], 200);
        }

        return response()->json([
            'mensaje' => 'Correo o contraseña incorrectos.'
        ], 401);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'mensaje' => 'Sesión cerrada!'
        ], 200);
    }
    
    public function loginGoogle(Request $request)
    {
        $request->validate(['token' => 'required']);

        $client = new GoogleClient(['client_id' => env('GOOGLE_CLIENT_ID')]);
        $payload = $client->verifyIdToken($request->token);

        if (!$payload) {
            return response()->json(['mensaje' => 'Token de Google inválido'], 401);
        }

        $alumna = Usuario::where('correo', $payload['email'])->first();

        if (!$alumna) {
            $nombreCompleto = $payload['given_name'];
            if (isset($payload['family_name'])) {
                $nombreCompleto .= ' ' . $payload['family_name'];
            }

            $alumna = Usuario::create([
                'nombre' => $nombreCompleto,
                'correo' => $payload['email'],
                'google_id' => $payload['sub'],
                'estado' => 'pendiente',
                'contrasenia' => null
            ]);
        }

        if (in_array($alumna->estado, ['inactiva', 'baja'])) {
            return response()->json(['mensaje' => 'Tu cuenta se encuentra inactiva o vencida.'], 403);
        }

        if ($alumna->estado === 'pendiente') {
            return response()->json([
                'mensaje' => 'Tu cuenta ha sido creada y está pendiente de aprobación por la entrenadora.',
                'usuario' => $alumna,
                'estado' => 'pendiente'
            ], 202); 
        }

        $token = $alumna->createToken('auth_token')->plainTextToken;

        return response()->json([
            'mensaje' => 'Bienvenida a tu entrenamiento!',
            'token' => $token,
            'usuario' => $alumna 
        ], 200);
    }

    public function forgotPassword(Request $request)
    {
        $request->validate([
            'correo' => 'required|email'
        ]);

        $entrenadora = User::where('email', $request->correo)->first();
        $alumna = Usuario::where('correo', $request->correo)->first();

        if (!$entrenadora && !$alumna) {
            return response()->json(['mensaje' => 'No encontramos una cuenta con ese correo.'], 404);
        }

        $token = \Illuminate\Support\Str::random(64);

        \Illuminate\Support\Facades\DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $request->correo],
            [
                'token' => $token,
                'created_at' => now()
            ]
        );

        try {
            Mail::to($request->correo)->send(new RecuperarPasswordMail($token, $request->correo));
            return response()->json(['mensaje' => 'Correo de recuperación enviado. Revisa tu bandeja.']);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Error enviando correo de recuperación: ' . $e->getMessage());
            return response()->json(['mensaje' => 'No se pudo enviar el correo. Verifica la configuración del servidor.'], 500);
        }
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required|string',
            'correo' => 'required|email',
            'contrasenia' => 'required|string|min:6'
        ]);

        $resetRecord = \Illuminate\Support\Facades\DB::table('password_reset_tokens')
            ->where('email', $request->correo)
            ->where('token', $request->token)
            ->first();

        if (!$resetRecord) {
            return response()->json(['mensaje' => 'El enlace es inválido o no corresponde a este correo.'], 400);
        }

        if (\Carbon\Carbon::parse($resetRecord->created_at)->addMinutes(60)->isPast()) {
            return response()->json(['mensaje' => 'El enlace de recuperación ha expirado. Solicita uno nuevo.'], 400);
        }

        $entrenadora = User::where('email', $request->correo)->first();
        
        if ($entrenadora) {
            if (Hash::check($request->contrasenia, $entrenadora->password)) {
                return response()->json(['mensaje' => 'La nueva contraseña debe ser diferente a la que ya tienes.'], 400);
            }
            $entrenadora->password = Hash::make($request->contrasenia);
            $entrenadora->save();
        } else {
            $alumna = Usuario::where('correo', $request->correo)->first();
            if ($alumna) {
                if (Hash::check($request->contrasenia, $alumna->contrasenia)) {
                    return response()->json(['mensaje' => 'La nueva contraseña debe ser diferente a la que ya tienes.'], 400);
                }
                $alumna->contrasenia = Hash::make($request->contrasenia);
                $alumna->save();
            } else {
                return response()->json(['mensaje' => 'Cuenta no encontrada.'], 404);
            }
        }

        \Illuminate\Support\Facades\DB::table('password_reset_tokens')->where('email', $request->correo)->delete();

        return response()->json(['mensaje' => 'Contraseña actualizada correctamente. Ya puedes iniciar sesión.']);
    }

    public function changePassword(Request $request)
    {
        $request->validate([
            'contrasenia_actual' => 'required|string',
            'nueva_contrasenia' => 'required|string|min:6|different:contrasenia_actual'
        ], [
            'nueva_contrasenia.different' => 'La nueva contraseña debe ser diferente a la actual.'
        ]);

        $usuario = $request->user();

        $hashActual = $usuario instanceof Usuario ? $usuario->contrasenia : $usuario->password;

        if (!Hash::check($request->contrasenia_actual, $hashActual)) {
            return response()->json(['mensaje' => 'La contraseña actual es incorrecta.'], 400);
        }

        if ($usuario instanceof Usuario) {
            $usuario->contrasenia = Hash::make($request->nueva_contrasenia);
        } else {
            $usuario->password = Hash::make($request->nueva_contrasenia);
        }
        
        $usuario->save();

        return response()->json(['mensaje' => 'Contraseña actualizada correctamente.']);
    }
}