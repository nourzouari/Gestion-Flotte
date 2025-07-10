<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory; // Ajoutez cette ligne
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable; // Ajoutez si manquant
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Driver extends Authenticatable 
{
    use HasFactory, HasApiTokens, Notifiable; // HasFactory doit être présent

    protected $fillable = [
        'name', 
        'license_number',
        'phone',
        'email',
        'password',
        'is_active'
    ];

    protected $hidden = [
        'password',
        'remember_token', // Ajoutez ceci
    ];
    protected $attributes = [
        'is_active' => true // Valeur par défaut
    ];
    // Relation avec les véhicules (many-to-many)
     public function vehicles(): BelongsToMany
    {
        return $this->belongsToMany(Vehicle::class, 'assignments')
                    ->using(Assignment::class)
                    ->withPivot(['start_date', 'end_date', 'notes'])
                    ->withTimestamps();
    }

    // Relation avec l'historique
    public function histories()
    {
        return $this->hasMany(DrivingHistory::class);
    }

     public function assignments(): HasMany
    {
        return $this->hasMany(Assignment::class);
    }

}