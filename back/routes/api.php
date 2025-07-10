<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DriverController;
use App\Http\Controllers\VehicleController;
use App\Http\Controllers\DrivingHistoryController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AssignementController;
use Illuminate\Support\Facades\Mail;
use App\Mail\AssignmentCreatedMail;
use App\Models\Assignment;
/*
|--------------------------------------------------------------------------
| Authentification (public + protégée)
|--------------------------------------------------------------------------
*/




// Login API
Route::post('/login', [AuthController::class, 'login']);
Route::post('/driver-login', [AuthController::class, 'login']);
Route::post('/driver-logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

// Profil et mot de passe du conducteur connecté (protégé)
Route::middleware(['auth:sanctum', 'driver'])->group(function () {
    Route::get('/driver/profile', [DriverController::class, 'showProfile']);
    Route::post('/driver/update-password', [DriverController::class, 'updatePassword']);
});

/*
|--------------------------------------------------------------------------
| Ressources de l'application
|--------------------------------------------------------------------------
*/

// ✅ Cette route personnalisée DOIT venir avant le apiResource
Route::get('vehicles-available', [VehicleController::class, 'getAvailableVehicles']);

// Routes REST
Route::apiResource('vehicles', VehicleController::class);
Route::apiResource('drivers', DriverController::class);
Route::apiResource('histories', DrivingHistoryController::class);
Route::apiResource('assignments', AssignementController::class);
