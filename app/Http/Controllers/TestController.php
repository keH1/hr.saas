<?php

namespace App\Http\Controllers;

use App\Models\Central\Tenant;
use App\Repositories\Central\CentralUserRepository;
use App\Repositories\Central\TenantRepository;

class TestController extends Controller
{
    public function index(TenantRepository $tenantRepository, CentralUserRepository $centralUserRepository)
    {
//        dump($tenant->domains->first()->domain);
//        dump(tenant());
//        dd($user);


        Tenant::get()->each(function (Tenant $tenant) use ($tenantRepository) {
            dump($tenantRepository->deleteTenant($tenant->id));
        });
    }
}
