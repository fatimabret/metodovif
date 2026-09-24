<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TestimonioImagen extends Model
{
    protected $table = 'testimonio_imagen';
    protected $primaryKey = 'id_imagen';
    public $timestamps = false;

    protected $fillable = [
        'id_testimonio',
        'url_foto'
    ];

    public function testimonio()
    {
        return $this->belongsTo(Testimonio::class, 'id_testimonio', 'id_testimonio');
    }
}