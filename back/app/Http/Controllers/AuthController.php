<?php

namespace App\Http\Controllers;

use App\Models\Driver;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Authentifie un driver
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        $driver = Driver::where('email', $request->email)->first();

        if (!$driver || !Hash::check($request->password, $driver->password)) {
            throw ValidationException::withMessages([
                'email' => ['Les identifiants sont incorrects.'],
            ]);
        }

        if (!$driver->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'Votre compte est désactivé'
            ], 403);
        }

        $token = $driver->createToken('driver-token', [
            'driver:basic',
            'vehicle:read' // Permissions personnalisées
        ])->plainTextToken;

        return response()->json([
            'success' => true,
            'token' => $token,
            'token_type' => 'Bearer',
            'expires_in' => config('sanctum.expiration'), // En minutes
            'driver' => $driver->only(['id', 'name', 'email', 'license_number'])
        ]);
    }

    /**
     * Déconnecte le driver
     */
    public function logout(Request $request)
    {
        try {
            $request->user()->currentAccessToken()->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Déconnexion réussie'
            ]);
            
        } catch (\Exception $e) {
            \Log::error('Logout error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Échec de la déconnexion'
            ], 500);
        }
    }

    /**
     * Récupère les infos du driver connecté
     */
    public function me(Request $request)
    {
        return response()->json([
            'success' => true,
            'data' => $request->user()
        ]);
    }
}