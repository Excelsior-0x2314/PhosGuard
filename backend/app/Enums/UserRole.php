<?php

namespace App\Enums;

enum UserRole: string
{
    case Admin = 'admin';
    case Technicien = 'technicien';
    case Responsable = 'responsable';

    public function label(): string
    {
        return match ($this) {
            self::Admin => 'Administrateur',
            self::Technicien => 'Technicien',
            self::Responsable => 'Responsable',
        };
    }
}