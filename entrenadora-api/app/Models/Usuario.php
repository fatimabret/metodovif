<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class Usuario extends Authenticatable
{
    use HasApiTokens;

    protected $table = 'usuario';
    protected $primaryKey = 'id_usuario';
    public $timestamps = false;

    protected $fillable = [
        'nombre',
        'correo',
        'contrasenia',
        'extra',
        'fecha_vencimiento',
        'estado',
        'id_nivel',
        'google_id'
    ];

    protected $hidden = [
        'contrasenia',
    ];

    public function ejerciciosFavoritos()
    {
        return $this->belongsToMany(Ejercicio::class, 'ejercicio_favorito', 'id_usuario', 'id_ejercicio')
                    ->withPivot('fecha_agregado');
    }

    public function rutinas()
    {
        return $this->belongsToMany(Rutina::class, 'usuario_rutina', 'id_usuario', 'id_rutina');
    }
}