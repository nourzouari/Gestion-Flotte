<?php

namespace App\Http\Controllers;

use App\Models\DrivingHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class DrivingHistoryController extends Controller
{
    /**
     * Display a listing of driving histories.
     */
    public function index()
    {
        try {
            $histories = DrivingHistory::with(['driver', 'vehicle'])->latest()->get();

            return response()->json([
                'success' => true,
                'data' => $histories
            ]);
        } catch (\Exception $e) {
            Log::error('DrivingHistoryController@index - ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des historiques'
            ], 500);
        }
    }

    /**
     * Display the specified driving history.
     */
    public function show(DrivingHistory $history)
    {
        return response()->json([
            'success' => true,
            'data' => $history->load(['driver', 'vehicle'])
        ]);
    }

    /**
     * Store a newly created driving history.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'driver_id'   => 'required|exists:drivers,id',
            'vehicle_id'  => 'required|exists:vehicles,id',
            'type'        => 'required|string|max:100',
            'description' => 'nullable|string',
            'date'        => 'required|date',
        ]);
        

        $history = DrivingHistory::create($validated);

        return response()->json([
            'success' => true,
            'data'    => $history,
            'message' => 'Historique créé avec succès'
        ], 201);
    }

    /**
     * Update the specified driving history.
     */
    public function update(Request $request, DrivingHistory $history)
    {
        try {
            $validated = $request->validate([
                'driver_id'   => 'required|exists:drivers,id',
                'vehicle_id'  => 'required|exists:vehicles,id',
                'type'        => 'required|string|max:100',
                'description' => 'nullable|string',
                'date'        => 'required|date'
            ]);

            $history->update($validated);

            return response()->json([
                'success' => true,
                'data'    => $history,
                'message' => 'Historique mis à jour avec succès'
            ]);
        } catch (\Exception $e) {
            Log::error('DrivingHistoryController@update - ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour',
                'error'   => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Remove the specified driving history.
     */
    public function destroy(DrivingHistory $history)
    {
        try {
            $history->delete();

            return response()->json([
                'success' => true,
                'message' => 'Historique supprimé avec succès'
            ]);
        } catch (\Exception $e) {
            Log::error('DrivingHistoryController@destroy - ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression'
            ], 500);
        }
    }
}
