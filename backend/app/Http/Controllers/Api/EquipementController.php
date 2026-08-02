<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreEquipementRequest;
use App\Http\Requests\UpdateEquipementRequest;
use App\Http\Resources\EquipementResource;
use App\Models\Equipement;
use App\Services\EquipementService;
use Illuminate\Http\Request;

class EquipementController extends Controller
{
    public function __construct(private EquipementService $equipementService)
    {
    }

    public function index(Request $request)
    {
        $equipements = $this->equipementService->list($request);

        return EquipementResource::collection($equipements);
    }

    public function show(Equipement $equipement)
    {
        return new EquipementResource($equipement);
    }

    public function store(StoreEquipementRequest $request)
    {
        $equipement = $this->equipementService->create($request->validated());

        return (new EquipementResource($equipement))->response()->setStatusCode(201);
    }

    public function update(UpdateEquipementRequest $request, Equipement $equipement)
    {
        $updatedEquipement = $this->equipementService->update($equipement, $request->validated());

        return new EquipementResource($updatedEquipement);
    }

    public function destroy(Equipement $equipement)
    {
        $this->equipementService->delete($equipement);

        return response()->json(['message' => 'Équipement supprimé.'], 200);
    }
}