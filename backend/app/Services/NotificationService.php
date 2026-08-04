<?php

namespace App\Services;

use App\Enums\UserRole;
use App\Models\Notification;
use App\Models\User;

class NotificationService
{
    public function notifyUser(int $userId, string $type, string $message, ?string $lien = null): void
    {
        Notification::create([
            'user_id' => $userId,
            'type' => $type,
            'message' => $message,
            'lien' => $lien,
        ]);
    }

    public function notifyRoles(array $roles, string $type, string $message, ?string $lien = null): void
    {
        $userIds = User::whereIn('role', $roles)->pluck('id');

        foreach ($userIds as $userId) {
            $this->notifyUser($userId, $type, $message, $lien);
        }
    }

    public function notifyAllRoles(string $type, string $message, ?string $lien = null): void
    {
        $this->notifyRoles([UserRole::Admin, UserRole::Responsable, UserRole::Technicien], $type, $message, $lien);
    }

    public function listForUser(int $userId)
    {
        return Notification::where('user_id', $userId)->latest()->limit(30)->get();
    }

    public function countUnread(int $userId): int
    {
        return Notification::where('user_id', $userId)->whereNull('lu_at')->count();
    }

    public function markAsRead(Notification $notification): void
    {
        $notification->update(['lu_at' => now()]);
    }

    public function markAllAsRead(int $userId): void
    {
        Notification::where('user_id', $userId)->whereNull('lu_at')->update(['lu_at' => now()]);
    }
}