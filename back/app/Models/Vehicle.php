<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Vehicle extends Model
{
    use HasFactory;

    protected $fillable = [
        'registration_number',
        'brand',
        'model',
        'year',
        'type'
    ];

    // Relation avec les conducteurs (many-to-many)
    public function drivers()
    {
        return $this->belongsToMany(Driver::class)
                    ->withTimestamps()
                    ->withPivot('assigned_at');
    }


    // Relation avec l'historique (en utilisant driver_id comme clé étrangère)
   public function drivingHistories()
{
    return $this->hasManyThrough(
        DrivingHistory::class,
        Driver::class,
        'id',           // Clé locale sur drivers (au lieu de vehicle_id)
        'driver_id',    // Clé étrangère sur driving_histories
        'id',           // Clé locale sur vehicles
        'id'            // Clé étrangère sur drivers
    );
}

public function assignments()
    {
        return $this->hasMany(Assignment::class);
    }

  public function isCurrentlyAvailable()
{
    $now = now();
    return $this->availability_start <= $now && 
           ($this->availability_end === null || $this->availability_end >= $now);
}

public function isAvailableBetween($start, $end, $excludeAssignmentId = null)
{
    return !$this->assignments()
        ->where(function ($query) use ($start, $end) {
            $query->where(function ($q) use ($start, $end) {
                $q->where('start_date', '<=', $end)
                  ->where('end_date', '>=', $start);
            });
        })
        ->when($excludeAssignmentId, function ($query) use ($excludeAssignmentId) {
            $query->where('id', '!=', $excludeAssignmentId);
        })
        ->exists();
}
}


