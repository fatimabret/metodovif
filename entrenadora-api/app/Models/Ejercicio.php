<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Ejercicio extends Model
{
    protected $table = 'ejercicio';
    protected $primaryKey = 'id_ejercicio';
    public $timestamps = false;

    protected $fillable = [
        'titulo',
        'descripcion',
        'video_url',
        'es_de_prueba',
        'activo'
    ];

    protected $appends = ['guardados'];

    public function getGuardadosAttribute()
    {
        return DB::table('ejercicio_favorito')
            ->where('id_ejercicio', $this->id_ejercicio)
            ->count();
    }

    public function categorias()
    {
        return $this->belongsToMany(Categoria::class, 'categoria_ejercicio', 'id_ejercicio', 'id_categoria');
    }

    public function etiquetas()
    {
        return $this->belongsToMany(Etiqueta::class, 'ejercicio_etiqueta', 'id_ejercicio', 'id_etiqueta');
    }

    public function favoritos()
    {
        return $this->belongsToMany(Usuario::class, 'ejercicio_favorito', 'id_ejercicio', 'id_usuario');
    }
}