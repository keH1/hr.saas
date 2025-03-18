<?php

declare(strict_types=1);


use App\Http\Controllers\Tenant\LogoutController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Stancl\Tenancy\Features\UserImpersonation;
use Stancl\Tenancy\Middleware\InitializeTenancyByDomain;
use Stancl\Tenancy\Middleware\PreventAccessFromCentralDomains;

/*
|--------------------------------------------------------------------------
| Tenant Routes
|--------------------------------------------------------------------------
|
| Here you can register the tenant routes for your application.
| These routes are loaded by the TenantRouteServiceProvider.
|
| Feel free to customize them however you want. Good luck!
|
*/

Route::middleware([
    'web',
    InitializeTenancyByDomain::class,
    PreventAccessFromCentralDomains::class,
])->group(function () {
    Route::middleware('auth:tenant')->group(function () {
        Route::get('/dashboard', function () {
            return Inertia::render('Tenant/Dashboard');
        })->name('dashboard');

        Route::post('logout', [LogoutController::class, 'logout'])->name('logout');

        require __DIR__.'/tenant/pages.php';
        require __DIR__.'/tenant/ajax.php';
    });

    //Stable routes
    Route::get('/impersonate/{token}', function ($token) {
        return UserImpersonation::makeResponse($token);
    })->name('impersonate');
});
