<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
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
}