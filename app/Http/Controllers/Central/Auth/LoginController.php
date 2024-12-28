<?php

namespace App\Http\Controllers\Central\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Central\LoginRequest;
use App\Models\Central\CentralUser;
use App\Models\Central\Tenant;
use App\Models\Tenant\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

class LoginController extends Controller
{
    public function index()
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    public function store(LoginRequest $request)
    {
        $request->authenticate();
        $request->session()->regenerate();

        $availableTenants = $request->user()->tenants;
        $tenant = $availableTenants->first();

        return $this->redirectUserToTenant($request->user(), $tenant);
    }

    public function destroy(Request $request)
    {
        Auth::guard()->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Inertia::location(route('login'));
    }

    private function redirectUserToTenant(CentralUser $user, Tenant $tenant)
    {
        $tenantUser = $tenant->run(fn() => User::firstWhere('global_id', $user->global_id));

        return Inertia::location($tenant->impersonationUrl($tenantUser));
    }
}
