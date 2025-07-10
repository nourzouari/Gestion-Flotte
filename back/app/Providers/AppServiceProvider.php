<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Route;

class AppServiceProvider extends ServiceProvider
{
    public function boot()
    {
        $this->mapApiRoutes();
    }

    protected function mapApiRoutes()
    {
        Route::prefix('api/v1')
             ->middleware('api')
             ->namespace('App\Http\Controllers')
             ->group(base_path('routes/api.php'));
    }
}