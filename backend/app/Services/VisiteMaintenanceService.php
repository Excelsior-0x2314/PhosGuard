<?php

namespace App\Services;

use App\Enums\VisiteStatut;
use App\Models\VisiteMaintenance;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Carbon;

class VisiteMaintenanceService
{
    private const FREQUENCE_JOURS = 15;

    public function list(Request $request): LengthAwarePaginator
    {
        $query = VisiteMaintenance::query()->with(['equipement', 'technicien', 'creator']);

        if ($request->filled('statut')) {
            $query->where('statut', $request->input('statut'));
        }

        if ($request->filled('equipement_id')) {
            $query->where('equipement_id', $request->input('equipement_id'));
        }

        if ($request->filled('technicien_id')) {
            $query->where('technicien_id', $request->input('technicien_id'));
        }

        return $query->orderBy('date_planifiee')->paginate(15);
    }

    public function create(array $data, int $creatorId): VisiteMaintenance
    {
        $data['created_by'] = $creatorId;

        $visite = VisiteMaintenance::create($data);

        return $visite->fresh(['equipement', 'technicien', 'creator']);
    }

    public function assign(VisiteMaintenance $visite, int $technicienId): VisiteMaintenance
    {
        $visite->update(['technicien_id' => $technicienId]);

        return $visite->fresh(['equipement', 'technicien', 'creator']);
    }

    public function complete(VisiteMaintenance $visite, string $compteRendu, int $creatorId): VisiteMaintenance
    {
        $visite->update([
            'statut' => VisiteStatut::Effectuee,
            'date_realisation' => Carbon::now(),
            'compte_rendu' => $compteRendu,
        ]);

        $this->creerProchaineVisite($visite, $creatorId);

        return $visite->fresh(['equipement', 'technicien', 'creator']);
    }

     private function creerProchaineVisite(VisiteMaintenance $visite, int $creatorId): void
    {
        VisiteMaintenance::create([
            'equipement_id' => $visite->equipement_id,
            'technicien_id' => $visite->technicien_id,
            'created_by' => $creatorId,
            'date_planifiee' => Carbon::now()->addDays(self::FREQUENCE_JOURS),
            'statut' => VisiteStatut::Planifiee,
            'checklist' => $visite->checklist,
        ]);
    }

    public function cancel(VisiteMaintenance $visite): VisiteMaintenance
    {
        $visite->update(['statut' => VisiteStatut::Annulee]);

        return $visite->fresh(['equipement', 'technicien', 'creator']);
    }

    public function delete(VisiteMaintenance $visite): void
    {
        $visite->delete();
    }
}