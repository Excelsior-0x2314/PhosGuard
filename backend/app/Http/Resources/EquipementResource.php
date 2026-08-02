<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EquipementResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nom' => $this->nom,
            'reference' => $this->reference,
            'localisation' => $this->localisation,
            'statut' => $this->statut->value,
            'statut_label' => $this->statut->label(),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}