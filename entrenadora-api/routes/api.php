<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Controladores
use App\Http\Controllers\AuthController;
use App\Http\Controllers\NivelMembresiaController;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\EjercicioController;
use App\Http\Controllers\PerfilEntrenadoraController;
use App\Http\Controllers\RutinaController;
use App\Http\Controllers\ContactoController;
use App\Http\Controllers\GaleriaController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EtiquetaController;
use App\Http\Controllers\TestimonioController;

/*
| RUTAS DE AUTENTICACIÓN Y REGISTRO
*/
Route::middleware('throttle:auth_attempts')->group(function () {
    Route::post('/auth/login', [AuthController::class, 'login']);
    Route::post('/auth/registro', [UsuarioController::class, 'store']);
    Route::post('/auth/google', [AuthController::class, 'loginGoogle']);
    Route::post('/usuarios', [UsuarioController::class, 'store']);
    Route::post('/auth/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/auth/reset-password', [AuthController::class, 'resetPassword']);
    Route::post('/auth/login-google', [AuthController::class, 'loginGoogle']);
});

/*
| RUTAS TOTALMENTE PÚBLICAS (No requieren inicio de sesión)
*/
Route::middleware('throttle:api')->group(function () {
    
    // Perfil, Contactos y Galerías
    Route::get('/perfil-entrenadora', [PerfilEntrenadoraController::class, 'index']);
    Route::get('/perfil-entrenadora/{id}', [PerfilEntrenadoraController::class, 'show']);
    Route::get('/contactos', [ContactoController::class, 'index']);
    Route::get('/contactos/{id}', [ContactoController::class, 'show']);
    Route::get('/galerias', [GaleriaController::class, 'index']);
    Route::get('/galerias/{id}', [GaleriaController::class, 'show']);
    
    // Planes y Membresías
    Route::get('/membresias', [NivelMembresiaController::class, 'index']);
    Route::get('/membresias/{id}', [NivelMembresiaController::class, 'show']);

    // Catálogo de Ejercicios, Disciplinas y Etiquetas (SOLO LECTURA)
    Route::get('/ejercicios', [EjercicioController::class, 'index']);
    Route::get('/ejercicios/{id}', [EjercicioController::class, 'show']);
    
    Route::get('/categorias', [CategoriaController::class, 'index']);
    Route::get('/categorias/{id}', [CategoriaController::class, 'show']);
    
    Route::get('/etiquetas', [EtiquetaController::class, 'index']);
    Route::get('/etiquetas/{id}', [EtiquetaController::class, 'show']);

    Route::get('/testimonios', [TestimonioController::class, 'index']);
});


/*
| RUTAS PRIVADAS (Requieren Token)
| 
*/
Route::middleware(['auth:sanctum', 'throttle:api'])->group(function () {

    Route::post('/auth/change-password', [AuthController::class, 'changePassword']);

    // Cerrar Sesión
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    
    // Obtener datos de quien está logueado
    Route::get('/perfil', function (Request $request) {
        return $request->user();
    });

    // --- RUTAS EXCLUSIVAS DE LA ALUMNA ---
    Route::get('/rutinas', [RutinaController::class, 'index']);
    Route::get('/rutinas/{id}', [RutinaController::class, 'show']);
    Route::get('/usuarios/{id}', [UsuarioController::class, 'show']);
    Route::get('/alumna/perfil', [UsuarioController::class, 'miPerfil']);
    Route::post('/alumna/favoritos/{id_ejercicio}', [UsuarioController::class, 'toggleFavorito']);
    
    
    // --- RUTAS EXCLUSIVAS DE LA ENTRENADORA ---
    Route::middleware('rol.entrenadora')->group(function () {
        
        // Membresías
        Route::post('/membresias', [NivelMembresiaController::class, 'store']);
        Route::put('/membresias/{id}', [NivelMembresiaController::class, 'update']);
        Route::delete('/membresias/{id}', [NivelMembresiaController::class, 'destroy']);
        Route::patch('/membresias/{id}/activar', [NivelMembresiaController::class, 'activar']);

        // Perfil Entrenadora
        Route::post('/perfil-entrenadora', [PerfilEntrenadoraController::class, 'store']);
        Route::put('/perfil-entrenadora/{id}', [PerfilEntrenadoraController::class, 'update']);
        Route::delete('/perfil-entrenadora/{id}', [PerfilEntrenadoraController::class, 'destroy']);
        Route::patch('/perfil-entrenadora/{id}/activar', [PerfilEntrenadoraController::class, 'activar']);

        // Contactos
        Route::post('/contactos', [ContactoController::class, 'store']);
        Route::put('/contactos/{id}', [ContactoController::class, 'update']);
        Route::delete('/contactos/{id}', [ContactoController::class, 'destroy']);
        Route::patch('/contactos/{id}/activar', [ContactoController::class, 'activar']);

        // Galerías
        Route::post('/galerias', [GaleriaController::class, 'store']);
        Route::put('/galerias/{id}', [GaleriaController::class, 'update']);
        Route::delete('/galerias/{id}', [GaleriaController::class, 'destroy']);
        Route::patch('/galerias/{id}/activar', [GaleriaController::class, 'activar']);

        // Categorías y Ejercicios
        Route::post('/categorias', [CategoriaController::class, 'store']);
        Route::put('/categorias/{id}', [CategoriaController::class, 'update']);
        Route::delete('/categorias/{id}', [CategoriaController::class, 'destroy']);
        Route::patch('/categorias/{id}/activar', [CategoriaController::class, 'activar']);

        Route::apiResource('etiquetas', EtiquetaController::class)->except(['index', 'show']);
        Route::patch('etiquetas/{id}/activar', [EtiquetaController::class, 'activar']);

        Route::apiResource('ejercicios', EjercicioController::class)->except(['index', 'show']);
        Route::patch('/ejercicios/{id}/activar', [EjercicioController::class, 'activar']);

        // Rutinas 
        Route::post('/rutinas', [RutinaController::class, 'store']);
        Route::put('/rutinas/{id}', [RutinaController::class, 'update']);
        Route::delete('/rutinas/{id}', [RutinaController::class, 'destroy']);
        Route::patch('/rutinas/{id}/activar', [RutinaController::class, 'activar']);

        // Gestión de Alumnas
        Route::get('/usuarios', [UsuarioController::class, 'index']); 
        Route::put('/usuarios/{id}', [UsuarioController::class, 'update']);
        Route::delete('/usuarios/{id}', [UsuarioController::class, 'destroy']);
        Route::patch('/usuarios/{id}/aprobar', [UsuarioController::class, 'aprobar']);
        Route::put('/usuarios/{id}/rutinas', [UsuarioController::class, 'asignarRutinas']);
        
        // Dashboard
        Route::get('/entrenadora/dashboard/resumen', [DashboardController::class, 'getResumen']);

        Route::middleware(['auth:sanctum'])->group(function () {
            Route::post('/testimonios', [TestimonioController::class, 'store']);
            Route::put('/testimonios/{id}', [TestimonioController::class, 'update']);
            Route::delete('/testimonios/{id}', [TestimonioController::class, 'destroy']);
            Route::patch('/testimonios/{id}/activar', [TestimonioController::class, 'activar']);
        });

        Route::delete('/testimonios-imagenes/{id}', [TestimonioController::class, 'eliminarImagen']);
    });
});