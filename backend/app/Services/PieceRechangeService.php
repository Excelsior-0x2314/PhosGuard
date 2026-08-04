<?php

namespace App\Services;

use App\Enums\UserRole;
use App\Models\PieceRechange;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;

class PieceRechangeService
{
    public function __construct(private NotificationService $notificationService)
    {
    }

    public function list(Request $request): LengthAwarePaginator
    {
        $query = PieceRechange::query();

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('nom', 'like', "%{$search}%")
                    ->orWhere('reference', 'like', "%{$search}%");
            });
        }

        if ($request->filled('localisation')) {
            $query->where('localisation', 'like', '%' . $request->input('localisation') . '%');
        }

        return $query->orderBy('nom')->paginate(15);
    }

    public function create(array $data): PieceRechange
    {
        $piece = PieceRechange::create($data);

        return $piece->fresh();
    }

    public function update(PieceRechange $piece, array $data): PieceRechange
    {
        $piece->update($data);

        return $piece->fresh();
    }

    public function delete(PieceRechange $piece): void
    {
        $piece->delete();
    }

    /**
     * @throws \RuntimeException
     */
    public function addMouvement(
        PieceRechange $piece,
        string $type,
        int $quantite,
        int $creatorId,
        ?string $motif = null,
        ?int $ticketId = null
    ): PieceRechange {
        if ($type === 'sortie' && $piece->quantite < $quantite) {
            throw new \RuntimeException('Stock insuffisant pour cette sortie.');
        }

        $etaitAuDessusDuSeuil = $piece->quantite > $piece->seuil_minimum;

        $nouvelleQuantite = $type === 'entree'
            ? $piece->quantite + $quantite
            : $piece->quantite - $quantite;

        $piece->update(['quantite' => $nouvelleQuantite]);

        $piece->mouvements()->create([
            'type' => $type,
            'quantite' => $quantite,
            'ticket_id' => $ticketId,
            'created_by' => $creatorId,
            'motif' => $motif,
        ]);

        $piece = $piece->fresh();

        if ($etaitAuDessusDuSeuil && $piece->quantite <= $piece->seuil_minimum) {
            $this->notificationService->notifyRoles(
                [UserRole::Admin, UserRole::Responsable],
                'stock_bas',
                'Stock bas sur la pièce : ' . $piece->nom . ' (' . $piece->quantite . ' restant, seuil ' . $piece->seuil_minimum . ')',
                '/pieces/' . $piece->id
            );
        }

        return $piece;
    }

    public function listMouvements(PieceRechange $piece)
    {
        return $piece->mouvements()->with('creator')->latest()->get();
    }

    public function consumeForTicket(array $piecesData, int $ticketId, int $creatorId): void
    {
        foreach ($piecesData as $item) {
            $piece = PieceRechange::findOrFail($item['piece_id']);

            $this->addMouvement(
                $piece,
                'sortie',
                $item['quantite'],
                $creatorId,
                'Consommation ticket #' . $ticketId,
                $ticketId
            );
        }
    }
}