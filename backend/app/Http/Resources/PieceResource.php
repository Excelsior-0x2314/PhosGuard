<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PieceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nom' => $this->nom,
            'reference' => $this->reference,
            'localisation' => $this->localisation,
            'quantite' => $this->quantite,
            'seuil_minimum' => $this->seuil_minimum,
            'alerte_stock_bas' => $this->quantite <= $this->seuil_minimum,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}