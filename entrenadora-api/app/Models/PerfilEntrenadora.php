<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PerfilEntrenadora extends Model
{
    protected $table = 'perfil_entrenadora';
    protected $primaryKey = 'id_perfil';
    public $timestamps = false;

    protected $fillable = [
        'titulo_principal',
        'biografia',
        'anos_experiencia',
        'cantidad_alumnas',
        'cantidad_disciplinas',
        'url_foto',
        'activo',
        'terminos_condiciones',
        'mostrar_testimonios'
    ];

    protected $casts = [
        'mostrar_testimonios' => 'boolean',
    ];
}