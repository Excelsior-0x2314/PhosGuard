<?php

namespace App\Enums;

enum TicketStatut: string
{
    case Ouvert = 'ouvert';
    case EnCours = 'en_cours';
    case Resolu = 'resolu';
    case Ferme = 'ferme';

    public function label(): string
    {
        return match ($this) {
            self::Ouvert => 'Ouvert',
            self::EnCours => 'En cours',
            self::Resolu => 'Résolu',
            self::Ferme => 'Fermé',
        };
    }
}