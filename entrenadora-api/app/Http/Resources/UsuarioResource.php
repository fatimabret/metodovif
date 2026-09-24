<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UsuarioResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id_usuario' => $this->id_usuario,
            'nombre' => $this->nombre,
            'correo' => $this->correo,
            'extra' => $this->extra,
            
            'estado' => $this->estado,
            'id_nivel' => $this->id_nivel,
            'fecha_vencimiento' => $this->fecha_vencimiento,

            'rutinas' => $this->whenLoaded('rutinas')
        ];
    }
}