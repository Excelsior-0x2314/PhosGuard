<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: sans-serif; font-size: 11px; color: #1a1a1a; }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #1e5f8a; padding-bottom: 10px; margin-bottom: 6px; }
        .header img { height: 45px; }
        .header .titles { text-align: center; }
        .header h1 { font-size: 17px; margin: 0; }
        .header .subtitle { font-size: 10px; color: #666; margin-top: 3px; }
        table.data { width: 100%; border-collapse: collapse; margin-top: 14px; }
        table.data th { background: #1e5f8a; color: white; padding: 7px 8px; text-align: left; font-size: 10px; }
        table.data td { border-bottom: 1px solid #e2e8f0; padding: 6px 8px; font-size: 10px; }
        table.data tr:nth-child(even) { background: #f8fafc; }
        .badge { display: inline-block; padding: 2px 7px; border-radius: 3px; font-size: 9px; font-weight: bold; }
        .badge-fonctionnel { background: #d1fae5; color: #065f46; }
        .badge-en_panne { background: #fecaca; color: #991b1b; }
        .footer { margin-top: 16px; font-size: 9px; color: #888; text-align: center; }
    </style>
</head>
<body>
    <div class="header">
        <img src="{{ public_path('logos/logo-ocp.png') }}" alt="OCP">
        <div class="titles">
            <h1>RAPPORT DES ÉQUIPEMENTS</h1>
            <p class="subtitle">{{ count($equipements) }} équipement(s) — généré le {{ $dateGeneration }}</p>
        </div>
        <img src="{{ public_path('logos/logo-phosguard.png') }}" alt="PhosGuard" style="height: 50px;">
    </div>

    <table class="data">
        <thead>
            <tr>
                <th>Nom</th>
                <th>Référence</th>
                <th>Localisation</th>
                <th>Statut</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($equipements as $equipement)
                <tr>
                    <td>{{ $equipement->nom }}</td>
                    <td>{{ $equipement->reference }}</td>
                    <td>{{ $equipement->localisation }}</td>
                    <td><span class="badge badge-{{ $equipement->statut->value }}">{{ $equipement->statut->label() }}</span></td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <p class="footer">Document généré automatiquement par PhosGuard — Office Chérifien des Phosphates</p>
</body>
</html>