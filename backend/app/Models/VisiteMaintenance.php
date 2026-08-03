<?php

namespace App\Models;

use App\Enums\VisiteStatut;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VisiteMaintenance extends Model
{
    use HasFactory;

    protected $table = 'visite_maintenances';

    protected $fillable = [
        'equipement_id',
        'technicien_id',
        'created_by',
        'date_planifiee',
        'date_realisation',
        'statut',
        'checklist',
        'compte_rendu',
    ];

    protected function casts(): array
    {
        return [
            'statut' => VisiteStatut::class,
            'date_planifiee' => 'date',
            'date_realisation' => 'date',
        ];
    }

    public function equipement(): BelongsTo
    {
        return $this->belongsTo(Equipement::class);
    }

    public function technicien(): BelongsTo
    {
        return $this->belongsTo(User::class, 'technicien_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}