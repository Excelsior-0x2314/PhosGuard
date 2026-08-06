<?php

namespace App\Services;

use App\Models\Equipement;
use App\Models\Ticket;
use App\Models\VisiteMaintenance;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Carbon;

class RapportService
{
    public function genererRapportTickets()
    {
        $tickets = Ticket::with(['equipement', 'technicien'])->latest()->get();

        return Pdf::loadView('rapports.tickets', [
            'tickets' => $tickets,
            'dateGeneration' => Carbon::now()->format('d/m/Y H:i'),
        ]);
    }

    public function genererRapportEquipements()
    {
        $equipements = Equipement::latest()->get();

        return Pdf::loadView('rapports.equipements', [
            'equipements' => $equipements,
            'dateGeneration' => Carbon::now()->format('d/m/Y H:i'),
        ]);
    }

    public function genererFicheTicket(Ticket $ticket)
    {
        $ticket->load(['equipement', 'technicien', 'creator']);

        return Pdf::loadView('rapports.fiche-ticket', [
            'ticket' => $ticket,
            'dateGeneration' => Carbon::now()->format('d/m/Y H:i'),
        ]);
    }

    public function genererFicheVisite(VisiteMaintenance $visite)
    {
        $visite->load(['equipement', 'technicien', 'creator']);

        return Pdf::loadView('rapports.fiche-visite', [
            'visite' => $visite,
            'dateGeneration' => Carbon::now()->format('d/m/Y H:i'),
        ]);
    }
}