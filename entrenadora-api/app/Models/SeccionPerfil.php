<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SeccionPerfil extends Model
{
    use HasFactory;

    protected $table = 'seccion_perfil';
    protected $primaryKey = 'id_seccion';

    protected $fillable = [
        'id_perfil',
        'titulo',
        'descripcion',
        'orden',
        'activo'
    ];

    public function perfil()
    {
        return $this->belongsTo(PerfilEntrenadora::class, 'id_perfil', 'id_perfil');
    }
}