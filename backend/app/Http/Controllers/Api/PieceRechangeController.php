<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreMouvementRequest;
use App\Http\Requests\StorePieceRequest;
use App\Http\Requests\UpdatePieceRequest;
use App\Http\Resources\MouvementResource;
use App\Http\Resources\PieceResource;
use App\Models\PieceRechange;
use App\Services\PieceRechangeService;
use Illuminate\Http\Request;

class PieceRechangeController extends Controller
{
    public function __construct(private PieceRechangeService $pieceService)
    {
    }

    public function index(Request $request)
    {
        $pieces = $this->pieceService->list($request);

        return PieceResource::collection($pieces);
    }

    public function show(PieceRechange $piece)
    {
        return new PieceResource($piece);
    }

    public function store(StorePieceRequest $request)
    {
        $piece = $this->pieceService->create($request->validated());

        return (new PieceResource($piece))->response()->setStatusCode(201);
    }

    public function update(UpdatePieceRequest $request, PieceRechange $piece)
    {
        $updatedPiece = $this->pieceService->update($piece, $request->validated());

        return new PieceResource($updatedPiece);
    }

    public function destroy(PieceRechange $piece)
    {
        $this->pieceService->delete($piece);

        return response()->json(['message' => 'Pièce supprimée.'], 200);
    }

    public function mouvement(StoreMouvementRequest $request, PieceRechange $piece)
    {
        $validated = $request->validated();

        try {
            $updatedPiece = $this->pieceService->addMouvement(
                $piece,
                $validated['type'],
                $validated['quantite'],
                $request->user()->id,
                $validated['motif'] ?? null
            );
        } catch (\RuntimeException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }

        return new PieceResource($updatedPiece);
    }

    public function mouvements(PieceRechange $piece)
    {
        $mouvements = $this->pieceService->listMouvements($piece);

        return MouvementResource::collection($mouvements);
    }
}