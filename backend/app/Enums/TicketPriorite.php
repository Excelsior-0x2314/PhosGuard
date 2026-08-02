<?php

namespace App\Enums;

enum TicketPriorite: string
{
    case Basse = 'basse';
    case Moyenne = 'moyenne';
    case Haute = 'haute';
    case Critique = 'critique';

    public function label(): string
    {
        return match ($this) {
            self::Basse => 'Basse',
            self::Moyenne => 'Moyenne',
            self::Haute => 'Haute',
            self::Critique => 'Critique',
        };
    }

    public function gtiHeures(): int
    {
        return match ($this) {
            self::Critique => 1,
            self::Haute => 2,
            self::Moyenne => 4,
            self::Basse => 8,
        };
    }

    public function gtrHeures(): int
    {
        return match ($this) {
            self::Critique => 4,
            self::Haute => 8,
            self::Moyenne => 24,
            self::Basse => 72,
        };
    }
}