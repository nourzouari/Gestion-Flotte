<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class DrivingHistory extends Model
{
    use HasFactory;

            // DrivingHistory.php
        protected $fillable = [
            'type',
            'description',
            'date',
            'driver_id',
            'vehicle_id' // <== NE PAS OUBLIER !
];


    // Relation avec le conducteur
    public function driver()
    {
        return $this->belongsTo(Driver::class);
    }
public function vehicle()
{
    return $this->belongsTo(Vehicle::class);
}

}