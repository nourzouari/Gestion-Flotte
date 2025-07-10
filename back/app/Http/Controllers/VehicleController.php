<?php

namespace App\Http\Controllers;

use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
class VehicleController extends Controller
{

// VehicleController.php

public function getAvailableVehicles(Request $request)
{
    $validated = $request->validate([
        'start_date' => 'required|date',
        'end_date' => 'required|date|after_or_equal:start_date',
    ]);

    $vehicles = Vehicle::whereDoesntHave('assignments', function ($query) use ($validated) {
        $query->where(function ($q) use ($validated) {
            $q->where('start_date', '<=', $validated['end_date'])
              ->where('end_date', '>=', $validated['start_date']);
        });
    })->get();

    return response()->json($vehicles);
}

    /**
     * Display a listing of vehicles with their drivers and histories
     */
    public function index()
    {
        try {
            $vehicles = Vehicle::with(['assignments.driver.histories'])->latest()->get();

            return response()->json([
                'success' => true,
                'data' => $vehicles->map(function ($vehicle) {
                    return [
                        'id' => $vehicle->id,
                        'registration_number' => $vehicle->registration_number,
                        'brand' => $vehicle->brand,
                        'model' => $vehicle->model,
                        'year' => $vehicle->year,
                        'type' => $vehicle->type,
                        'current_drivers' => $vehicle->assignments->map(function ($assignment) {
                            return [
                                'driver' => $assignment->driver,
                                'start_date' => $assignment->start_date,
                                'end_date' => $assignment->end_date
                            ];
                        }),
                        'histories' => $vehicle->assignments->flatMap(function ($assignment) {
                            return $assignment->driver->histories;
                        })
                    ];
                })
            ]);
        } catch (\Exception $e) {
            Log::error('VehicleController@index - ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur technique',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }
    /**
     * Display a specific vehicle with drivers and driving histories
     */
       public function show(Vehicle $vehicle)
    {
        try {
            return response()->json([
                'success' => true,
                'data' => $vehicle->load(['assignments.driver.histories'])
            ]);
        } catch (\Exception $e) {
            Log::error('VehicleController@show - ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération du véhicule'
            ], 500);
        }
    }

    /**
     * Store a newly created vehicle
     */
    public function store(Request $request)
{
    $validated = $request->validate([
        'registration_number' => 'required|string|unique:vehicles|regex:/^[A-Z0-9-]+$/',
        'brand' => 'required|string|max:100',
        'model' => 'required|string|max:100',
        'year' => 'nullable|integer|min:1900|max:'.(date('Y')+1),
        'type' => 'required|string|max:100'
        // Retirer driver_id car la gestion se fait via assignments
    ]);

    DB::beginTransaction();
    try {
        $vehicle = Vehicle::create($validated);
        
        DB::commit();
        
        return response()->json([
            'success' => true,
            'data' => $vehicle,
            'message' => 'Véhicule créé avec succès'
        ], 201);
        
    } catch (\Exception $e) {
        DB::rollBack();
        Log::error('Vehicle creation failed: '.$e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'Erreur technique',
            'error' => config('app.debug') ? $e->getMessage() : null
        ], 500);
    }
}
    /**
     * Update the specified vehicle
     */
 public function update(Request $request, Vehicle $vehicle)
{
    $validated = $request->validate([
        'registration_number' => [
            'required',
            'string',
            Rule::unique('vehicles')->ignore($vehicle->id),
            'regex:/^[A-Z0-9-]+$/'
        ],
        'brand' => 'required|string|max:100',
        'model' => 'required|string|max:100',
        'year' => 'nullable|integer|min:1900|max:' . (date('Y') + 1),
        'type' => 'required|string|max:100'
        // Retirer 'driver_id' car la gestion se fait via assignments
    ]);

    try {
        DB::beginTransaction();
        
        $vehicle->update($validated);
        
        DB::commit();

        return response()->json([
            'success' => true,
            'data' => $vehicle,
            'message' => 'Véhicule mis à jour avec succès'
        ]);

    } catch (\Exception $e) {
        DB::rollBack();
        Log::error('VehicleController@update - ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'Erreur lors de la mise à jour du véhicule',
            'error' => config('app.debug') ? $e->getMessage() : null
        ], 500);
    }
}

    /**
     * Remove the specified vehicle
     */
 /**
 * Remove the specified vehicle
 */
public function destroy(Vehicle $vehicle)
{
    DB::beginTransaction();

    try {
        // 1. Supprimer d'abord les assignations liées (nouveau système)
        $vehicle->assignments()->delete();
        
        // 2. Ne PAS essayer de supprimer driver_vehicle (ancien système)
        // $vehicle->drivers()->detach(); // À NE PAS FAIRE
        
        // 3. Supprimer le véhicule
        $vehicle->delete();

        DB::commit();

        return response()->json([
            'success' => true,
            'message' => 'Véhicule supprimé avec succès'
        ]);

    } catch (\Exception $e) {
        DB::rollBack();
        Log::error('VehicleController@destroy - Error: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'Erreur lors de la suppression du véhicule',
            'error' => config('app.debug') ? $e->getMessage() : null
        ], 500);
    }
}
}
