<?php

declare(strict_types=1);

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Tenant\GardenersController;
use App\Http\Controllers\Tenant\PlotsController;
use App\Http\Controllers\Tenant\StreetsController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Tenant Pages
|--------------------------------------------------------------------------
|
| Here you can register the tenant pages for your application.
| These pages are loaded by the TenantRouteServiceProvider.
|
*/

Route::group(['prefix' => 'ajax'], function () {
    Route::get('/gardeners/options', [GardenersController::class, 'options'])->name('gardeners.options');
    Route::get('/plots/plot-existence', [PlotsController::class, 'checkPlotExistence'])->name('plots.check-existence');
});

