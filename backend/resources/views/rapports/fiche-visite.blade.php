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
        .badge-planifiee { background: #fef3c7; color: #92400e; }
        .badge-effectuee { background: #d1fae5; color: #065f46; }
        .badge-annulee { background: #fee2e2; color: #991b1b; }
        .footer { margin-top: 30px; display: flex; justify-content: space-between; font-size: 11px; }
        .footer .visa { border: 1px solid #ccc; padding: 15px; width: 45%; text-align: center; }
    </style>
</head>
<body>
    <div class="header">
        <img src="{{ public_path('logos/logo-ocp.png') }}" alt="OCP">
        <div>
            <h1>PROCÈS VERBAL DE MAINTENANCE PRÉVENTIVE</h1>
            <p class="ref">N° de Visite : VIS-{{ str_pad($visite->id, 4, '0', STR_PAD_LEFT) }}</p>
        </div>
        <img src="{{ public_path('logos/logo-phosguard.png') }}" alt="PhosGuard" style="height: 45px;">
    </div>

    <table class="info">
        <tr>
            <td class="label">Équipement</td>
            <td>{{ $visite->equipement->nom ?? '—' }} ({{ $visite->equipement->reference ?? '—' }})</td>
            <td class="label">Localisation</td>
            <td>{{ $visite->equipement->localisation ?? '—' }}</td>
        </tr>
        <tr>
            <td class="label">Planifiée par</td>
            <td>{{ $visite->creator->name ?? '—' }}</td>
            <td class="label">Date planifiée</td>
            <td>{{ \Carbon\Carbon::parse($visite->date_planifiee)->format('d/m/Y') }}</td>
        </tr>
        <tr>
            <td class="label">Technicien assigné</td>
            <td>{{ $visite->technicien->name ?? 'Non assigné' }}</td>
            <td class="label">Date de réalisation</td>
            <td>{{ $visite->date_realisation ? \Carbon\Carbon::parse($visite->date_realisation)->format('d/m/Y') : 'En attente' }}</td>
        </tr>
    </table>

    <div class="section-title">STATUT</div>
    <div class="section-content">
        <span class="badge badge-{{ $visite->statut->value }}">{{ $visite->statut->label() }}</span>
    </div>

    <div class="section-title">CHECKLIST DE MAINTENANCE</div>
    <div class="section-content">
        {{ $visite->checklist ?: 'Aucune checklist renseignée.' }}
    </div>

    <div class="section-title">COMPTE RENDU D'INTERVENTION</div>
    <div class="section-content">
        {{ $visite->compte_rendu ?: 'Intervention non encore réalisée.' }}
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