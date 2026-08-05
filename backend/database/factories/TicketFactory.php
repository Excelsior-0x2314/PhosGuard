<?php

namespace Database\Factories;

use App\Enums\TicketPriorite;
use App\Enums\TicketStatut;
use App\Models\Equipement;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class TicketFactory extends Factory
{
    public function definition(): array
    {
        return [
            'titre' => fake()->sentence(3),
            'description' => fake()->paragraph(),
            'equipement_id' => Equipement::factory(),
            'created_by' => User::factory(),
            'statut' => TicketStatut::Ouvert,
            'priorite' => TicketPriorite::Moyenne,
        ];
    }
}