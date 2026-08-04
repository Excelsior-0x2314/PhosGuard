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
    <h1>Rapport des Tickets — PhosGuard</h1>
    <p class="subtitle">Généré le {{ $dateGeneration }} — {{ count($tickets) }} ticket(s)</p>

    <table>
        <thead>
            <tr>
                <th>Titre</th>
                <th>Équipement</th>
                <th>Technicien</th>
                <th>Priorité</th>
                <th>Statut</th>
                <th>Créé le</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($tickets as $ticket)
                <tr>
                    <td>{{ $ticket->titre }}</td>
                    <td>{{ $ticket->equipement->nom ?? '—' }}</td>
                    <td>{{ $ticket->technicien->name ?? 'Non assigné' }}</td>
                    <td>{{ $ticket->priorite->label() }}</td>
                    <td>{{ $ticket->statut->label() }}</td>
                    <td>{{ $ticket->created_at->format('d/m/Y') }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>