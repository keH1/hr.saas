<?php

namespace App\Providers;

use App\Rules\NullableIf;
use Illuminate\Auth\Middleware\RedirectIfAuthenticated;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rule;

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

        $this->macro();
    }

    private function macro(): void
    {
        Rule::macro('nullableIf', fn($callback) => new NullableIf($callback));
    }
}
