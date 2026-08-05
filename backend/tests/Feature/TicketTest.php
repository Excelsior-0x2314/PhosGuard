<?php

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\Equipement;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TicketTest extends TestCase
{
    use RefreshDatabase;

    public function test_technicien_can_create_ticket(): void
    {
        $technicien = User::factory()->create(['role' => UserRole::Technicien]);
        $equipement = Equipement::factory()->create();

        $response = $this->actingAs($technicien)->postJson('/api/tickets', [
            'titre' => 'Panne moteur',
            'description' => 'Bruit anormal au demarrage',
            'equipement_id' => $equipement->id,
            'priorite' => 'haute',
        ]);

        $response->assertStatus(201);
        $response->assertJsonPath('data.titre', 'Panne moteur');
        $response->assertJsonPath('data.statut', 'ouvert');
        $this->assertDatabaseHas('tickets', ['titre' => 'Panne moteur']);
    }

    public function test_ticket_requires_equipement(): void
    {
        $technicien = User::factory()->create(['role' => UserRole::Technicien]);

        $response = $this->actingAs($technicien)->postJson('/api/tickets', [
            'titre' => 'Panne moteur',
            'description' => 'Test',
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['equipement_id']);
    }

    public function test_assigned_technicien_can_update_ticket_status(): void
    {
        $technicien = User::factory()->create(['role' => UserRole::Technicien]);
        $equipement = Equipement::factory()->create();
        $ticket = Ticket::factory()->create([
            'equipement_id' => $equipement->id,
            'technicien_id' => $technicien->id,
            'statut' => 'ouvert',
        ]);

        $response = $this->actingAs($technicien)->patchJson("/api/tickets/{$ticket->id}/status", [
            'statut' => 'en_cours',
        ]);

        $response->assertStatus(200);
        $response->assertJsonPath('data.statut', 'en_cours');
        $this->assertNotNull($ticket->fresh()->date_prise_en_charge);
    }

    public function test_unassigned_technicien_cannot_update_ticket_status(): void
    {
        $assignedTechnicien = User::factory()->create(['role' => UserRole::Technicien]);
        $otherTechnicien = User::factory()->create(['role' => UserRole::Technicien]);
        $equipement = Equipement::factory()->create();

        $ticket = Ticket::factory()->create([
            'equipement_id' => $equipement->id,
            'technicien_id' => $assignedTechnicien->id,
            'statut' => 'ouvert',
        ]);

        $response = $this->actingAs($otherTechnicien)->patchJson("/api/tickets/{$ticket->id}/status", [
            'statut' => 'en_cours',
        ]);

        $response->assertStatus(403);
    }

    public function test_only_admin_or_responsable_can_assign_ticket(): void
    {
        $admin = User::factory()->create(['role' => UserRole::Admin]);
        $technicien = User::factory()->create(['role' => UserRole::Technicien]);
        $equipement = Equipement::factory()->create();

        $ticket = Ticket::factory()->create([
            'equipement_id' => $equipement->id,
        ]);

        $response = $this->actingAs($admin)->patchJson("/api/tickets/{$ticket->id}/assign", [
            'technicien_id' => $technicien->id,
        ]);

        $response->assertStatus(200);
        $response->assertJsonPath('data.technicien.id', $technicien->id);
    }

    public function test_gti_target_matches_priority(): void
    {
        $technicien = User::factory()->create(['role' => UserRole::Technicien]);
        $equipement = Equipement::factory()->create();

        $response = $this->actingAs($technicien)->postJson('/api/tickets', [
            'titre' => 'Urgence critique',
            'description' => 'Test',
            'equipement_id' => $equipement->id,
            'priorite' => 'critique',
        ]);

        $response->assertJsonPath('data.gti_cible_heures', 1);
        $response->assertJsonPath('data.gtr_cible_heures', 4);
    }
}