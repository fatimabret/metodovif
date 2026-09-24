<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ContactoResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id_contacto, 
            'plataforma' => $this->plataforma,
            'valor_visible' => $this->valor_visible,
            'enlace' => $this->url_destino,
            'activo' => (bool) $this->activo,
        ];
    }
}