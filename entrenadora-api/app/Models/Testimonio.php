<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Testimonio extends Model
{
    protected $table = 'testimonio';
    protected $primaryKey = 'id_testimonio';
    public $timestamps = false;

    protected $fillable = [
        'titulo',
        'descripcion',
        'nombre_alumna',
        'activo'
    ];

    public function imagenes()
    {
        return $this->hasMany(TestimonioImagen::class, 'id_testimonio', 'id_testimonio');
    }
}