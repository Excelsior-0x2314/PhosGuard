<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\AssignTicketRequest;
use App\Http\Requests\StoreTicketRequest;
use App\Http\Requests\UpdateTicketStatusRequest;
use App\Http\Resources\TicketResource;
use App\Models\Ticket;
use App\Services\TicketService;
use Illuminate\Http\Request;
use App\Enums\UserRole;
use App\Http\Requests\ConsumePiecesRequest;
use App\Services\PieceRechangeService;

class TicketController extends Controller
{
      public function __construct(
        private TicketService $ticketService,
        private PieceRechangeService $pieceService
    ) {
    }

    public function index(Request $request)
    {
        $tickets = $this->ticketService->list($request);

        return TicketResource::collection($tickets);
    }

    public function show(Ticket $ticket)
    {
        $ticket->load(['equipement', 'technicien', 'creator']);

        return new TicketResource($ticket);
    }

    public function store(StoreTicketRequest $request)
    {
        $ticket = $this->ticketService->create($request->validated(), $request->user()->id);

        return (new TicketResource($ticket))->response()->setStatusCode(201);
    }

    public function assign(AssignTicketRequest $request, Ticket $ticket)
    {
        $updatedTicket = $this->ticketService->assign($ticket, $request->validated()['technicien_id']);

        return new TicketResource($updatedTicket);
    }

   public function updateStatus(UpdateTicketStatusRequest $request, Ticket $ticket)
    {
        $currentUser = $request->user();
        $isAdminOrResponsable = in_array($currentUser->role, [UserRole::Admin, UserRole::Responsable], true);
        $isAssignedTechnicien = $ticket->technicien_id === $currentUser->id;

        if (! $isAdminOrResponsable && ! $isAssignedTechnicien) {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        $updatedTicket = $this->ticketService->updateStatus($ticket, $request->validated()['statut']);

        return new TicketResource($updatedTicket);
    }
    public function consumePieces(ConsumePiecesRequest $request, Ticket $ticket)
    {
        $currentUser = $request->user();
        $isAdminOrResponsable = in_array($currentUser->role, [UserRole::Admin, UserRole::Responsable], true);
        $isAssignedTechnicien = $ticket->technicien_id === $currentUser->id;

        if (! $isAdminOrResponsable && ! $isAssignedTechnicien) {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        try {
            $this->pieceService->consumeForTicket($request->validated()['pieces'], $ticket->id, $currentUser->id);
        } catch (\RuntimeException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['message' => 'Pièce introuvable.'], 404);
        }

        return response()->json(['message' => 'Pièces consommées avec succès.']);
    }
    public function destroy(Ticket $ticket)
    {
        $this->ticketService->delete($ticket);

        return response()->json(['message' => 'Ticket supprimé.'], 200);
    }
}