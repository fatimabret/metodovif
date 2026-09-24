<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rutina extends Model
{
    protected $table = 'rutina';
    protected $primaryKey = 'id_rutina';
    public $timestamps = false;

    protected $fillable = [
        'titulo',
        'descripcion',
        'categoria',
        'activo'
    ];

    public function ejercicios()
    {
        return $this->belongsToMany(Ejercicio::class, 'rutina_ejercicio', 'id_rutina', 'id_ejercicio')
                    ->withPivot('series', 'repeticiones', 'nota');
    }
}