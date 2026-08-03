<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VisiteResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'date_planifiee' => $this->date_planifiee,
            'date_realisation' => $this->date_realisation,
            'statut' => $this->statut->value,
            'statut_label' => $this->statut->label(),
            'checklist' => $this->checklist,
            'compte_rendu' => $this->compte_rendu,
            'equipement' => new EquipementResource($this->whenLoaded('equipement')),
            'technicien' => new UserResource($this->whenLoaded('technicien')),
            'created_by' => new UserResource($this->whenLoaded('creator')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}