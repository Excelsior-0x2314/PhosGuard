<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TicketResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'titre' => $this->titre,
            'description' => $this->description,
            'statut' => $this->statut->value,
            'statut_label' => $this->statut->label(),
            'priorite' => $this->priorite->value,
            'priorite_label' => $this->priorite->label(),
            'equipement' => new EquipementResource($this->whenLoaded('equipement')),
            'technicien' => new UserResource($this->whenLoaded('technicien')),
            'created_by' => new UserResource($this->whenLoaded('creator')),
            'date_prise_en_charge' => $this->date_prise_en_charge,
            'date_resolution' => $this->date_resolution,
            'gti_cible_heures' => $this->priorite->gtiHeures(),
            'gtr_cible_heures' => $this->priorite->gtrHeures(),
            'gti_respecte' => $this->when($this->date_prise_en_charge, fn () => $this->created_at->diffInHours($this->date_prise_en_charge) <= $this->priorite->gtiHeures()),
            'gtr_respecte' => $this->when($this->date_resolution, fn () => $this->created_at->diffInHours($this->date_resolution) <= $this->priorite->gtrHeures()),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}