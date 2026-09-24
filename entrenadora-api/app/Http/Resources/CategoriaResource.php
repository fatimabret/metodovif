<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CategoriaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id_categoria, // Asegúrate de usar el nombre exacto de tu PK
            'titulo' => $this->titulo,
            'descripcion' => $this->descripcion,
            // Las fechas de creación y estados de base de datos se quedan en el servidor
        ];
    }
}