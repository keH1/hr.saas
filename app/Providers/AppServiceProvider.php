<?php

namespace App\Providers;

use Illuminate\Auth\Middleware\RedirectIfAuthenticated;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        RedirectIfAuthenticated::redirectUsing(function ($request) {
            if (tenant()) {
                return route('dashboard');
            }

            $availableTenants = $request->user()->tenants;
            $domain = $availableTenants->first()->domains->first()->domain;

            return tenant_route($domain, 'dashboard');
        });
    }
}
