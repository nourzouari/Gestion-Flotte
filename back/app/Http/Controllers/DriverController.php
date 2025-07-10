<?php

namespace App\Http\Controllers;




use App\Models\Driver;
use App\Models\Assignment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use App\Models\Vehicle;

class DriverController extends Controller
{
    /**
     * Display a listing of drivers
     */
     public function index()
    {
        try {
            $drivers = Driver::with(['assignments.vehicle'])
                ->select(['id', 'name', 'license_number', 'email', 'phone', 'is_active'])
                ->latest()
                ->get();

            return response()->json([
                'success' => true,
                'data' => $drivers
            ]);

        } catch (\Exception $e) {
            Log::error('DriverController@index - ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des conducteurs',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Display the specified driver
     */
    public function show(Driver $driver)
    {
        try {
            return response()->json([
                'success' => true,
                'data' => $driver->load(['assignments.vehicle'])
            ]);

        } catch (\Exception $e) {
            Log::error('DriverController@show - ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération du conducteur'
            ], 500);
        }
    }

    /**
     * Store a newly created driver
     */
    public function store(Request $request)
{
    try {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'license_number' => 'required|string|max:100|unique:drivers,license_number',
            'phone' => 'nullable|string|max:20',
            'email' => 'required|email|max:255|unique:drivers,email',
            'password' => 'required|string|min:8',
            'address' => 'nullable|string|max:255'
        ]);

        $validated['password'] = Hash::make($validated['password']);
        $validated['is_active'] = true; // Activer le compte par défaut

        $driver = Driver::create($validated);

        return response()->json([
            'success' => true,
            'data' => $driver,
            'message' => 'Conducteur créé avec succès'
        ], 201);
    } catch (\Exception $e) {
        Log::error('DriverController@store - ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'Erreur lors de la création du conducteur: ' . $e->getMessage()
        ], 500);
    }
}

    /**
     * Update the specified driver
     */
    public function update(Request $request, Driver $driver)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'license_number' => [
                    'required',
                    'string',
                    'max:100',
                    Rule::unique('drivers')->ignore($driver->id)
                ],
                'phone' => 'nullable|string|max:20',
                'email' => [
                    'nullable',
                    'email',
                    'max:255',
                    Rule::unique('drivers')->ignore($driver->id)
                ],
                'password' => 'nullable|string|min:8' // Mot de passe optionnel pour la mise à jour
            ]);

            if (isset($validated['password'])) {
                $validated['password'] = Hash::make($validated['password']); // Hachage si nouveau mot de passe
            }

            $driver->update($validated);

            return response()->json([
                'success' => true,
                'data' => $driver,
                'message' => 'Conducteur mis à jour avec succès'
            ]);
        } catch (\Exception $e) {
            Log::error('DriverController@update - ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour du conducteur'
            ], 500);
        }
    }

    /**
     * Remove the specified driver
     */
    public function destroy(Driver $driver)
    {
        try {
            $driver->delete();

            return response()->json([
                'success' => true,
                'message' => 'Conducteur supprimé avec succès'
            ]);
        } catch (\Exception $e) {
            Log::error('DriverController@destroy - ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression du conducteur'
            ], 500);
        }
    }

  

public function updatePassword(Request $request)
{
    $request->validate([
        'new_password' => 'required|min:8'
    ]);

    $request->user()->update([
        'password' => Hash::make($request->new_password) // Hachage ici
    ]);

    return response()->json(['message' => 'Mot de passe mis à jour']);
}


}