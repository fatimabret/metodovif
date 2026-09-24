<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Http\Request;

use App\Interfaces\IUsuarioRepository;
use App\Interfaces\INivelMembresiaRepository;
use App\Interfaces\IEjercicioRepository;
use App\Interfaces\IRutinaRepository;
use App\Interfaces\ICategoriaRepository;
use App\Interfaces\IPerfilEntrenadoraRepository;
use App\Interfaces\IGaleriaRepository;
use App\Interfaces\IContactoRepository;
use App\Interfaces\ITestimonioRepository;


use App\Repositories\UsuarioRepository;
use App\Repositories\NivelMembresiaRepository;
use App\Repositories\EjercicioRepository;
use App\Repositories\RutinaRepository;
use App\Repositories\CategoriaRepository;
use App\Repositories\PerfilEntrenadoraRepository;
use App\Repositories\GaleriaRepository;
use App\Repositories\ContactoRepository;
use App\Repositories\TestimonioRepository;


class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(INivelMembresiaRepository::class, NivelMembresiaRepository::class);
        $this->app->bind(IUsuarioRepository::class, UsuarioRepository::class);
        $this->app->bind(ICategoriaRepository::class, CategoriaRepository::class);
        $this->app->bind(IEjercicioRepository::class, EjercicioRepository::class);
        $this->app->bind(IPerfilEntrenadoraRepository::class, PerfilEntrenadoraRepository::class);
        $this->app->bind(IRutinaRepository::class, RutinaRepository::class);
        $this->app->bind(ITestimonioRepository::class, TestimonioRepository::class);
        
        if (interface_exists(IGaleriaRepository::class)) {
            $this->app->bind(IGaleriaRepository::class, GaleriaRepository::class);
        }
        if (interface_exists(IContactoRepository::class)) {
            $this->app->bind(IContactoRepository::class, ContactoRepository::class);
        }
    }

    public function boot(): void
    {
        // 1. Límite para Login y Registro: 5 intentos por minuto por IP
        RateLimiter::for('auth_attempts', function (Request $request) {
            return Limit::perMinute(5)->by($request->ip());
        });

        // 2. Límite general para la API: 60 peticiones por minuto por IP o Usuario
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });
    }

}