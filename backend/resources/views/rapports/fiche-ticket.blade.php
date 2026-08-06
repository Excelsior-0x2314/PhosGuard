<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: sans-serif; font-size: 12px; color: #1a1a1a; }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #1e5f8a; padding-bottom: 10px; margin-bottom: 15px; }
        .header img { height: 50px; }
        .header h1 { font-size: 17px; margin: 0; text-align: center; }
        .header .ref { font-size: 11px; color: #555; text-align: center; margin-top: 4px; }
        .header .brand { font-size: 14px; font-weight: bold; color: #1e5f8a; text-align: right; }
        table.info { width: 100%; border-collapse: collapse; margin-bottom: 14px; }
        table.info td { border: 1px solid #ccc; padding: 6px 10px; font-size: 11px; }
        table.info td.label { background: #f1f5f9; font-weight: bold; width: 22%; }
        .section-title { background: #1e5f8a; color: white; font-weight: bold; padding: 5px 10px; font-size: 12px; margin-top: 14px; }
        .section-content { border: 1px solid #ccc; border-top: none; padding: 10px; font-size: 11px; }
        .badge { display: inline-block; padding: 2px 8px; border-radius: 3px; font-size: 10px; font-weight: bold; }
        .badge-ouvert { background: #fef3c7; color: #92400e; }
        .badge-en_cours { background: #dbeafe; color: #1e40af; }
        .badge-resolu { background: #d1fae5; color: #065f46; }
        .badge-ferme { background: #e5e7eb; color: #374151; }
        .footer { margin-top: 30px; display: flex; justify-content: space-between; font-size: 11px; }
        .footer .visa { border: 1px solid #ccc; padding: 15px; width: 45%; text-align: center; }
    </style>
</head>
<body>
    <div class="header">
        <img src="{{ public_path('logos/logo-ocp.png') }}" alt="OCP">
        <div>
            <h1>FICHE D'INTERVENTION CURATIVE</h1>
            <p class="ref">N° du Ticket : TICK-{{ str_pad($ticket->id, 4, '0', STR_PAD_LEFT) }}</p>
        </div>
        <img src="{{ public_path('logos/logo-phosguard.png') }}" alt="PhosGuard" style="height: 45px;">
    </div>

    <table class="info">
        <tr>
            <td class="label">Équipement</td>
            <td>{{ $ticket->equipement->nom ?? '—' }} ({{ $ticket->equipement->reference ?? '—' }})</td>
            <td class="label">Localisation</td>
            <td>{{ $ticket->equipement->localisation ?? '—' }}</td>
        </tr>
        <tr>
            <td class="label">Créé par</td>
            <td>{{ $ticket->creator->name ?? '—' }}</td>
            <td class="label">Date de création</td>
            <td>{{ $ticket->created_at->format('d/m/Y H:i') }}</td>
        </tr>
        <tr>
            <td class="label">Technicien assigné</td>
            <td>{{ $ticket->technicien->name ?? 'Non assigné' }}</td>
            <td class="label">Priorité</td>
            <td>{{ $ticket->priorite->label() }}</td>
        </tr>
        <tr>
            <td class="label">Prise en charge</td>
            <td>{{ $ticket->date_prise_en_charge?->format('d/m/Y H:i') ?? 'En attente' }}</td>
            <td class="label">Résolution</td>
            <td>{{ $ticket->date_resolution?->format('d/m/Y H:i') ?? 'En attente' }}</td>
        </tr>
    </table>

    <div class="section-title">STATUT DE L'INTERVENTION</div>
    <div class="section-content">
        <span class="badge badge-{{ $ticket->statut->value }}">{{ $ticket->statut->label() }}</span>
    </div>

    <div class="section-title">NATURE DU DYSFONCTIONNEMENT</div>
    <div class="section-content">
        {{ $ticket->titre }}<br><br>
        {{ $ticket->description }}
    </div>

    <div class="section-title">RESPECT DES DÉLAIS CONTRACTUELS (SLA)</div>
    <div class="section-content">
        Délai de prise en charge cible (GTI) : {{ $ticket->priorite->gtiHeures() }}h
        — {{ $ticket->date_prise_en_charge ? ($ticket->created_at->diffInHours($ticket->date_prise_en_charge) <= $ticket->priorite->gtiHeures() ? 'Respecté' : 'Dépassé') : 'En attente' }}
        <br>
        Délai de résolution cible (GTR) : {{ $ticket->priorite->gtrHeures() }}h
        — {{ $ticket->date_resolution ? ($ticket->created_at->diffInHours($ticket->date_resolution) <= $ticket->priorite->gtrHeures() ? 'Respecté' : 'Dépassé') : 'En attente' }}
    </div>

    <div class="footer">
        <div class="visa">
            <strong>VISA RESPONSABLE</strong><br><br><br>
            Signature
        </div>
        <div class="visa">
            <strong>VISA TECHNICIEN</strong><br><br><br>
            Signature
        </div>
    </div>

    <p style="margin-top: 20px; font-size: 9px; color: #888;">
        Document généré automatiquement par PhosGuard le {{ $dateGeneration }}.
    </p>
</body>
</html>