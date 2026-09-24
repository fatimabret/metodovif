<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Etiqueta extends Model
{
    protected $table = 'etiqueta';
    protected $primaryKey = 'id_etiqueta';
    public $timestamps = false;

    protected $fillable = [
        'titulo',
        'activo'
    ];

    public function ejercicios()
    {
        return $this->belongsToMany(Ejercicio::class, 'ejercicio_etiqueta', 'id_etiqueta', 'id_ejercicio');
    }
}