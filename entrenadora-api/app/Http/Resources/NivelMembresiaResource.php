<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NivelMembresiaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id_nivel,
            'descripcion' => $this->descripcion,
            'precio' => $this->costo,
            'activo' => (bool) $this->activo,
        ];
    }
}