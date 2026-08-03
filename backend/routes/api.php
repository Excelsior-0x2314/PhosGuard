<?php

use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\EquipementController;
use App\Http\Controllers\Api\TicketController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\VisiteMaintenanceController;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/roles', [RoleController::class, 'index']);

    Route::middleware('role:admin')->group(function () {
        Route::get('/admin/ping', function () {
            return response()->json(['message' => 'Bienvenue admin.']);
        });
    });

    Route::middleware('role:admin,responsable,technicien')->group(function () {
        Route::get('/equipements', [EquipementController::class, 'index']);
        Route::get('/equipements/{equipement}', [EquipementController::class, 'show']);
        Route::get('/tickets', [TicketController::class, 'index']);
        Route::get('/tickets/{ticket}', [TicketController::class, 'show']);
        Route::post('/tickets', [TicketController::class, 'store']);
        Route::patch('/tickets/{ticket}/status', [TicketController::class, 'updateStatus']);
        Route::get('/visites', [VisiteMaintenanceController::class, 'index']);
        Route::get('/visites/{visite}', [VisiteMaintenanceController::class, 'show']);
        Route::patch('/visites/{visite}/complete', [VisiteMaintenanceController::class, 'complete']);
    });

    Route::middleware('role:admin')->group(function () {
        Route::post('/users', [UserController::class, 'store']);
        Route::delete('/users/{user}', [UserController::class, 'destroy']);
        Route::patch('/users/{user}/toggle-active', [UserController::class, 'toggleActive']);
        Route::post('/equipements', [EquipementController::class, 'store']);
        Route::put('/equipements/{equipement}', [EquipementController::class, 'update']);
        Route::delete('/equipements/{equipement}', [EquipementController::class, 'destroy']);
    });

    Route::middleware('role:admin,responsable')->group(function () {
        Route::get('/users', [UserController::class, 'index']);
        Route::patch('/tickets/{ticket}/assign', [TicketController::class, 'assign']);
        Route::delete('/tickets/{ticket}', [TicketController::class, 'destroy']);
        Route::post('/visites', [VisiteMaintenanceController::class, 'store']);
        Route::patch('/visites/{visite}/assign', [VisiteMaintenanceController::class, 'assign']);
        Route::patch('/visites/{visite}/cancel', [VisiteMaintenanceController::class, 'cancel']);
        Route::delete('/visites/{visite}', [VisiteMaintenanceController::class, 'destroy']);
    });

    Route::get('/users/{user}', [UserController::class, 'show']);
    Route::put('/users/{user}', [UserController::class, 'update']);
    Route::get('/dashboard', [DashboardController::class, 'index']);
});

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
    });
});