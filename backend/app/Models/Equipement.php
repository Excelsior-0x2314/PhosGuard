<?php

namespace App\Models;

use App\Enums\EquipementStatut;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Equipement extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'reference',
        'localisation',
        'statut',
    ];

    protected function casts(): array
    {
        return [
            'statut' => EquipementStatut::class,
        ];
    }
}