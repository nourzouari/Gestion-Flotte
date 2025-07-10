<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Vehicle;
use App\Models\Assignment;
use App\Models\Driver;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use App\Mail\AssignmentCreatedMail;

class AssignementController extends Controller
{
    /**
     * Liste des assignations
     */
    public function index()
    {
        return response()->json(
            Assignment::with(['vehicle', 'driver'])->get()
        );
    }

    /**
     * Créer une nouvelle assignation
     */
   public function store(Request $request)
{
    $validated = $request->validate([
        'vehicle_id' => 'required|exists:vehicles,id',
        'driver_id' => 'required|exists:drivers,id',
        'start_date' => 'required|date',
        'end_date' => 'required|date|after_or_equal:start_date'
    ]);

    $vehicle = Vehicle::find($validated['vehicle_id']);

    if (!$vehicle) {
        return response()->json(['message' => 'Véhicule introuvable'], 404);
    }

    if (!$vehicle->isAvailableBetween($validated['start_date'], $validated['end_date'])) {
        return response()->json(['message' => 'Le véhicule n\'est pas disponible pour cette période'], 422);
    }

    $assignment = Assignment::create($validated);

    $driver = Driver::find($validated['driver_id']);

    if ($driver && $driver->email) {
        // Envoi en file d'attente (asynchrone)
        Mail::to($driver->email)->queue(new AssignmentCreatedMail($assignment));
        //Mail::to($driver->email)->send(new AssignmentCreatedMail($assignment));

    }

    return response()->json($assignment->load(['vehicle', 'driver']), 201);
}

    /**
     * Affiche une assignation spécifique
     */
    public function show(string $id)
    {
        $assignment = Assignment::with(['vehicle', 'driver'])->find($id);

        if (!$assignment) {
            return response()->json(['message' => 'Assignation introuvable'], 404);
        }

        return response()->json($assignment);
    }

    /**
     * Modifier une assignation
     */
    public function update(Request $request, string $id)
{
    $assignment = Assignment::find($id);

    if (!$assignment) {
        return response()->json(['message' => 'Assignation introuvable'], 404);
    }

    $validated = $request->validate([
        'vehicle_id' => 'sometimes|exists:vehicles,id',
        'driver_id' => 'sometimes|exists:drivers,id',
        'start_date' => 'sometimes|date',
        'end_date' => 'sometimes|date|after_or_equal:start_date',
        'notes' => 'sometimes|string|nullable|max:1000'  // ← ici

    ]);

    Log::debug('Requête reçue pour update', $validated);

    if (isset($validated['vehicle_id'])) {
        $vehicle = Vehicle::find($validated['vehicle_id']);

        if (!$vehicle) {
            return response()->json(['message' => 'Véhicule introuvable'], 404);
        }

        if (!$vehicle->isAvailableBetween(
    $validated['start_date'] ?? $assignment->start_date,
    $validated['end_date'] ?? $assignment->end_date,
    $assignment->id // exclure l'assignation en cours
)) {
    return response()->json(['message' => 'Véhicule indisponible'], 422);
}

    }

    $assignment->fill($validated);

    Log::debug('Champs modifiés : ', $assignment->getDirty());

    $assignment->save();

    return response()->json($assignment->load(['vehicle', 'driver']));
}

    /**
     * Supprimer une assignation
     */
    public function destroy(string $id)
    {
        $assignment = Assignment::find($id);

        if (!$assignment) {
            return response()->json(['message' => 'Assignation introuvable'], 404);
        }

        $assignment->delete();

        return response()->json(['message' => 'Assignation supprimée avec succès']);
    }


    
}
