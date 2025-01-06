<?php

namespace App\Http\Controllers\Central\Auth;

use App\Data\Central\RegistrationUserData;
use App\Http\Controllers\Controller;
use App\Models\Central\CentralUser;
use App\Repositories\Central\CentralUserRepository;
use App\Repositories\Central\TenantRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use Propaganistas\LaravelPhone\Rules\Phone;

class RegisterTenantController extends Controller
{
    public function __construct(private TenantRepository $tenantRepository, private CentralUserRepository $centralUserRepository)
    {
    }

    /**
     * Display the registration view.
     */
    public function registerPage(): Response
    {
        return Inertia::render('Central/Auth/Register');
    }

    public function create(Request $request)
    {
        $request->validate($this->rules());

        $userData = RegistrationUserData::from($request);
        $centralUser = $this->centralUserRepository->createUser($userData);
        $userData->global_id = $centralUser->global_id;

        Auth::guard('web')->login($centralUser);

        $tenant = $this->tenantRepository->createTenant($request->input('tenant_name'));
        $user = $this->tenantRepository->createTenantUser($userData, $tenant);

        return Inertia::location($tenant->impersonationUrl($user));
    }

    private function rules(): array
    {
        return [
            'tenant_name' => ['required', 'string', 'max:255'],
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:'.CentralUser::class],
            'phone' => ['required', new Phone()->country('RU'), 'unique:'.CentralUser::class],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ];
    }
}
