<?php

namespace App\Http\Middleware;

use App\Enums\UserRole;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (! $user) {
            return response()->json(['message' => 'Non authentifié.'], 401);
        }

        $allowedRoles = array_map(fn (string $role) => UserRole::from($role), $roles);

        if (! in_array($user->role, $allowedRoles, true)) {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        return $next($request);
    }
}