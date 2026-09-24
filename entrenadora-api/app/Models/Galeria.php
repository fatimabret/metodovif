<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Galeria extends Model
{
    protected $table = 'galeria';
    protected $primaryKey = 'id_galeria';
    public $timestamps = false;

    protected $fillable = [
        'url_foto',
        'descripcion', // pie de foto
        'activo'
    ];
}