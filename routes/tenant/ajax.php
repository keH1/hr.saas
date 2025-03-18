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

//Plots
Route::resource('plots', PlotsController::class);
//        Route::get('/plots/{id}', [PlotsController::class, 'detail'])->where('id', '[0-9]+')->name('plots.detail');

//Gardeners
Route::get('/gardeners', [GardenersController::class, 'index'])->name('gardeners.list');

//Streets
Route::post('/streets', [StreetsController::class, 'store'])->name('streets.store');

Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

