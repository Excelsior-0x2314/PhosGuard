<?php

namespace Database\Factories;

use App\Enums\EquipementStatut;
use Illuminate\Database\Eloquent\Factories\Factory;

class EquipementFactory extends Factory
{
    public function definition(): array
    {
        return [
            'nom' => fake()->words(2, true),
            'reference' => 'EQ-' . fake()->unique()->numberBetween(1000, 9999),
            'localisation' => fake()->randomElement(['Atelier A', 'Atelier B', 'Atelier C']),
            'statut' => EquipementStatut::Fonctionnel,
        ];
    }
}