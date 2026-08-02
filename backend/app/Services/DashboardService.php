<?php

namespace App\Services;

use App\Enums\TicketStatut;
use App\Models\Equipement;
use App\Models\Ticket;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardService
{
    public function getStats(): array
    {
        return [
            'nombre_equipements' => Equipement::count(),
            'nombre_tickets' => Ticket::count(),
            'tickets_ouverts' => Ticket::where('statut', TicketStatut::Ouvert)->count(),
            'tickets_fermes' => Ticket::whereIn('statut', [TicketStatut::Resolu, TicketStatut::Ferme])->count(),
            'tickets_en_retard' => $this->countTicketsEnRetard(),
            'repartition_par_statut' => $this->repartitionParStatut(),
            'repartition_par_priorite' => $this->repartitionParPriorite(),
        ];
    }

    private function countTicketsEnRetard(): int
    {
        $tickets = Ticket::whereNotIn('statut', [TicketStatut::Resolu, TicketStatut::Ferme])->get();

        return $tickets->filter(function (Ticket $ticket) {
            $limiteGtr = $ticket->created_at->addHours($ticket->priorite->gtrHeures());
            return Carbon::now()->greaterThan($limiteGtr);
        })->count();
    }

    private function repartitionParStatut(): array
    {
        return Ticket::select('statut', DB::raw('count(*) as total'))
            ->groupBy('statut')
            ->get()
            ->mapWithKeys(fn ($row) => [$row->statut->value => $row->total])
            ->toArray();
    }

    private function repartitionParPriorite(): array
    {
        return Ticket::select('priorite', DB::raw('count(*) as total'))
            ->groupBy('priorite')
            ->get()
            ->mapWithKeys(fn ($row) => [$row->priorite->value => $row->total])
            ->toArray();
    }
}