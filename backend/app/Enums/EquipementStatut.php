<?php

namespace App\Enums;

enum EquipementStatut: string
{
    case Fonctionnel = 'fonctionnel';
    case EnPanne = 'en_panne';

    public function label(): string
    {
        return match ($this) {
            self::Fonctionnel => 'Fonctionnel',
            self::EnPanne => 'En panne',
        };
    }
}