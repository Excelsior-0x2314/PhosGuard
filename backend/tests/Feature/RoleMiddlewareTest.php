<?php

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RoleMiddlewareTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_access_admin_only_route(): void
    {
        $admin = User::factory()->create(['role' => UserRole::Admin]);

        $response = $this->actingAs($admin)->getJson('/api/admin/ping');

        $response->assertStatus(200);
    }

    public function test_technicien_cannot_access_admin_only_route(): void
    {
        $technicien = User::factory()->create(['role' => UserRole::Technicien]);

        $response = $this->actingAs($technicien)->getJson('/api/admin/ping');

        $response->assertStatus(403);
    }

    public function test_unauthenticated_user_cannot_access_protected_route(): void
    {
        $response = $this->getJson('/api/admin/ping');

        $response->assertStatus(401);
    }

    public function test_only_admin_can_create_user(): void
    {
        $responsable = User::factory()->create(['role' => UserRole::Responsable]);

        $response = $this->actingAs($responsable)->postJson('/api/users', [
            'name' => 'Nouveau User',
            'email' => 'nouveau@phosguard.com',
            'password' => 'Password123!',
            'role' => 'technicien',
        ]);

        $response->assertStatus(403);
    }
}