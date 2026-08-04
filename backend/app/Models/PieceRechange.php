<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PieceRechange extends Model
{
    use HasFactory;

    protected $fillable = ['nom', 'reference', 'localisation', 'quantite', 'seuil_minimum'];

    public function mouvements(): HasMany
    {
        return $this->hasMany(MouvementStock::class);
    }
}