<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use App\Models\VisiteMaintenance;
use App\Services\RapportService;

class RapportController extends Controller
{
    public function __construct(private RapportService $rapportService)
    {
    }

    public function tickets()
    {
        $pdf = $this->rapportService->genererRapportTickets();

        return $pdf->download('rapport-tickets-' . now()->format('Y-m-d') . '.pdf');
    }

    public function equipements()
    {
        $pdf = $this->rapportService->genererRapportEquipements();

        return $pdf->download('rapport-equipements-' . now()->format('Y-m-d') . '.pdf');
    }

    public function ficheTicket(Ticket $ticket)
    {
        $pdf = $this->rapportService->genererFicheTicket($ticket);

        return $pdf->download('fiche-ticket-' . $ticket->id . '.pdf');
    }

    public function ficheVisite(VisiteMaintenance $visite)
    {
        $pdf = $this->rapportService->genererFicheVisite($visite);

        return $pdf->download('fiche-visite-' . $visite->id . '.pdf');
    }
}