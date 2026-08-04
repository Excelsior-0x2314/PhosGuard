<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MouvementStock extends Model
{
    use HasFactory;

    protected $fillable = ['piece_rechange_id', 'type', 'quantite', 'ticket_id', 'created_by', 'motif'];

    public function piece(): BelongsTo
    {
        return $this->belongsTo(PieceRechange::class, 'piece_rechange_id');
    }

    public function ticket(): BelongsTo
    {
        return $this->belongsTo(Ticket::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}