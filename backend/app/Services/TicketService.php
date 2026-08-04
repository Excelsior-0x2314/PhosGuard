<?php

namespace App\Services;

use App\Enums\TicketStatut;
use App\Models\Ticket;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Carbon;

class TicketService
{
    public function __construct(private NotificationService $notificationService)
    {
    }

    public function list(Request $request): LengthAwarePaginator
    {
        $query = Ticket::query()->with(['equipement', 'technicien', 'creator']);

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where('titre', 'like', "%{$search}%");
        }

        if ($request->filled('statut')) {
            $query->where('statut', $request->input('statut'));
        }

        if ($request->filled('priorite')) {
            $query->where('priorite', $request->input('priorite'));
        }

        if ($request->filled('equipement_id')) {
            $query->where('equipement_id', $request->input('equipement_id'));
        }

        if ($request->filled('technicien_id')) {
            $query->where('technicien_id', $request->input('technicien_id'));
        }

        return $query->latest()->paginate(15);
    }

    public function create(array $data, int $creatorId): Ticket
    {
        $data['created_by'] = $creatorId;

        $ticket = Ticket::create($data);
        $ticket = $ticket->fresh(['equipement', 'technicien', 'creator']);

        $this->notificationService->notifyAllRoles(
            'ticket_cree',
            'Nouveau ticket créé : ' . $ticket->titre,
            '/tickets/' . $ticket->id
        );

        return $ticket;
    }

    public function assign(Ticket $ticket, int $technicienId): Ticket
    {
        $ticket->update(['technicien_id' => $technicienId]);
        $ticket = $ticket->fresh(['equipement', 'technicien', 'creator']);

        $this->notificationService->notifyUser(
            $technicienId,
            'ticket_assigne',
            'Vous avez été assigné au ticket : ' . $ticket->titre,
            '/tickets/' . $ticket->id
        );

        return $ticket;
    }

    public function updateStatus(Ticket $ticket, string $newStatutValue): Ticket
    {
        $newStatut = TicketStatut::from($newStatutValue);
        $data = ['statut' => $newStatut];

        if ($newStatut === TicketStatut::EnCours && ! $ticket->date_prise_en_charge) {
            $data['date_prise_en_charge'] = Carbon::now();
        }

        if ($newStatut === TicketStatut::Resolu && ! $ticket->date_resolution) {
            $data['date_resolution'] = Carbon::now();
        }

        $ticket->update($data);

        return $ticket->fresh(['equipement', 'technicien', 'creator']);
    }

    public function delete(Ticket $ticket): void
    {
        $ticket->delete();
    }
}