<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Event;

class AuthService
{
    public function register(array $data): User
    {
        return User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);
    }

    public function login(array $credentials): User
    {
        if (! Auth::attempt([
            'email' => $credentials['email'],
            'password' => $credentials['password'],
        ], true)) {
            throw new AuthenticationException('Identifiants invalides.');
        }

        $user = Auth::user();

        if (! $user->is_active) {
            Auth::guard('web')->logout();
            request()->session()->invalidate();
            request()->session()->regenerateToken();

            throw new AuthenticationException('Ce compte a été désactivé.');
        }

        request()->session()->regenerate();

        return $user;
    }

    public function logout(): void
    {
        Auth::guard('web')->logout();

        request()->session()->invalidate();
        request()->session()->regenerateToken();
    }
    public function sendResetLink(string $email): void
    {
        $status = Password::sendResetLink(['email' => $email]);

        if ($status !== Password::RESET_LINK_SENT) {
            throw new AuthenticationException('Impossible d\'envoyer le lien de réinitialisation.');
        }
    }

    public function resetPassword(array $data): void
    {
        $status = Password::reset(
            $data,
            function (User $user, string $password) {
                $user->forceFill([
                    'password' => Hash::make($password),
                ])->save();

                Event::dispatch(new PasswordReset($user));
            }
        );

        if ($status !== Password::PASSWORD_RESET) {
            throw new AuthenticationException('Token invalide ou expiré.');
        }
    }
}