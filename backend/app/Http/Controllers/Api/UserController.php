<?php

namespace App\Http\Controllers\Api;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Http\Requests\StoreUserRequest;
use App\Services\UserService;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function __construct(private UserService $userService)
    {
    }

    public function index()
    {
        $users = User::all();

        return UserResource::collection($users);
    }

    public function show(Request $request, User $user)
    {
        $currentUser = $request->user();

        $canViewAny = in_array($currentUser->role, [UserRole::Admin, UserRole::Responsable], true);

        if (! $canViewAny && $currentUser->id !== $user->id) {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        return new UserResource($user);
    }

    public function store(StoreUserRequest $request)
    {
        $user = $this->userService->create($request);

        return (new UserResource($user))->response()->setStatusCode(201);
    }
    public function update(UpdateUserRequest $request, User $user)
    {
        $currentUser = $request->user();

        $isOwner = $currentUser->id === $user->id;
        $isAdmin = $currentUser->role === UserRole::Admin;

        if (! $isAdmin && ! $isOwner) {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        if ($request->filled('role') && ! $isAdmin) {
            return response()->json(['message' => 'Seul un administrateur peut modifier le rôle.'], 403);
        }

        $updatedUser = $this->userService->update($request, $user);

        return new UserResource($updatedUser);
    }
    public function destroy(User $user)
    {
        $this->userService->delete($user);

        return response()->json(['message' => 'Utilisateur supprimé.'], 200);
    }
    public function toggleActive(User $user)
    {
        $updatedUser = $this->userService->toggleActive($user);

        return new UserResource($updatedUser);
    }
}