<?php

namespace App\Models;

use App\Enums\TicketPriorite;
use App\Enums\TicketStatut;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Ticket extends Model
{
    use HasFactory;

    protected $fillable = [
        'titre',
        'description',
        'equipement_id',
        'technicien_id',
        'created_by',
        'statut',
        'priorite',
        'date_prise_en_charge',
        'date_resolution',
    ];

    protected function casts(): array
    {
        return [
            'statut' => TicketStatut::class,
            'priorite' => TicketPriorite::class,
            'date_prise_en_charge' => 'datetime',
            'date_resolution' => 'datetime',
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