<?php

namespace App\Http\Controllers\Api;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\AssignVisiteRequest;
use App\Http\Requests\CompleteVisiteRequest;
use App\Http\Requests\StoreVisiteRequest;
use App\Http\Resources\VisiteResource;
use App\Models\VisiteMaintenance;
use App\Services\VisiteMaintenanceService;
use Illuminate\Http\Request;

class VisiteMaintenanceController extends Controller
{
    public function __construct(private VisiteMaintenanceService $visiteService)
    {
    }

    public function index(Request $request)
    {
        $visites = $this->visiteService->list($request);

        return VisiteResource::collection($visites);
    }

    public function show(VisiteMaintenance $visite)
    {
        $visite->load(['equipement', 'technicien', 'creator']);

        return new VisiteResource($visite);
    }

    public function store(StoreVisiteRequest $request)
    {
        $visite = $this->visiteService->create($request->validated(), $request->user()->id);

        return (new VisiteResource($visite))->response()->setStatusCode(201);
    }

    public function assign(AssignVisiteRequest $request, VisiteMaintenance $visite)
    {
        $updatedVisite = $this->visiteService->assign($visite, $request->validated()['technicien_id']);

        return new VisiteResource($updatedVisite);
    }

    public function complete(CompleteVisiteRequest $request, VisiteMaintenance $visite)
    {
        $currentUser = $request->user();
        $isAdminOrResponsable = in_array($currentUser->role, [UserRole::Admin, UserRole::Responsable], true);
        $isAssignedTechnicien = $visite->technicien_id === $currentUser->id;

        if (! $isAdminOrResponsable && ! $isAssignedTechnicien) {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        $updatedVisite = $this->visiteService->complete(
            $visite,
            $request->validated()['compte_rendu'],
            $currentUser->id
        );

        return new VisiteResource($updatedVisite);
    }

    public function cancel(VisiteMaintenance $visite)
    {
        $updatedVisite = $this->visiteService->cancel($visite);

        return new VisiteResource($updatedVisite);
    }

    public function destroy(VisiteMaintenance $visite)
    {
        $this->visiteService->delete($visite);

        return response()->json(['message' => 'Visite supprimée.'], 200);
    }
}