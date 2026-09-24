<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NivelMembresia extends Model
{
    protected $table = 'nivel_membresia';
    protected $primaryKey = 'id_nivel';
    public $timestamps = false;
    
    protected $fillable = [
        'titulo',
        'descripcion',
        'precio',
        'activo',
        'incluye_rutinas',
        'es_popular'
    ];

    protected $casts = [
        'incluye_rutinas' => 'boolean',
        'es_popular' => 'boolean',
    ];
}