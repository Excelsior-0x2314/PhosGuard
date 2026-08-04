<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: sans-serif; font-size: 12px; }
        h1 { font-size: 18px; margin-bottom: 4px; }
        p.subtitle { color: #666; margin-top: 0; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ccc; padding: 6px 8px; text-align: left; }
        th { background-color: #f1f5f9; }
    </style>
</head>
<body>
    <h1>Rapport des Équipements — PhosGuard</h1>
    <p class="subtitle">Généré le {{ $dateGeneration }} — {{ count($equipements) }} équipement(s)</p>

    <table>
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
                    <td>{{ $equipement->statut->label() }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>