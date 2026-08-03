<?php

namespace App\Enums;

enum VisiteStatut: string
{
    case Planifiee = 'planifiee';
    case Effectuee = 'effectuee';
    case Annulee = 'annulee';

    public function label(): string
    {
        return match ($this) {
            self::Planifiee => 'Planifiée',
            self::Effectuee => 'Effectuée',
            self::Annulee => 'Annulée',
        };
    }
}