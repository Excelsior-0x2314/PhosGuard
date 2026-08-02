<?php

namespace App\Services;

use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserService
{
    public function create(StoreUserRequest $request): User
    {
        $validated = $request->validated();

        return User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
        ]);
    }

    public function update(UpdateUserRequest $request, User $user): User
    {
        $validated = $request->validated();

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        $user->update($validated);

        return $user->fresh();
    }
    public function delete(User $user): void
    {
        $user->delete();
    }
    public function toggleActive(User $user): User
    {
        $user->update(['is_active' => ! $user->is_active]);

        return $user->fresh();
    }
}