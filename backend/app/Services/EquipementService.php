<?php

namespace App\Services;

use App\Models\Equipement;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;

class EquipementService
{
    public function list(Request $request): LengthAwarePaginator
    {
        $query = Equipement::query();

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function (Builder $q) use ($search) {
                $q->where('nom', 'like', "%{$search}%")
                    ->orWhere('reference', 'like', "%{$search}%");
            });
        }

        if ($request->filled('statut')) {
            $query->where('statut', $request->input('statut'));
        }

        if ($request->filled('localisation')) {
            $query->where('localisation', 'like', '%' . $request->input('localisation') . '%');
        }

        return $query->latest()->paginate(15);
    }

    public function create(array $data): Equipement
    {
        $equipement = Equipement::create($data);

        return $equipement->fresh();
    }

    public function update(Equipement $equipement, array $data): Equipement
    {
        $equipement->update($data);

        return $equipement->fresh();
    }

    public function delete(Equipement $equipement): void
    {
        $equipement->delete();
    }
}