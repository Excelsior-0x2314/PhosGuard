<?php

namespace App\Services;

use App\Models\Equipement;
use App\Models\Ticket;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Carbon;

class RapportService
{
    public function genererRapportTickets()
    {
        $tickets = Ticket::with(['equipement', 'technicien'])->latest()->get();

        $pdf = Pdf::loadView('rapports.tickets', [
            'tickets' => $tickets,
            'dateGeneration' => Carbon::now()->format('d/m/Y H:i'),
        ]);

        return $pdf;
    }

    public function genererRapportEquipements()
    {
        $equipements = Equipement::latest()->get();

        $pdf = Pdf::loadView('rapports.equipements', [
            'equipements' => $equipements,
            'dateGeneration' => Carbon::now()->format('d/m/Y H:i'),
        ]);

        return $pdf;
    }
}