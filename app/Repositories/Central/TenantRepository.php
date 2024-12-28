<?php

namespace App\Repositories\Central;

use App\Data\Central\RegistrationUserData;
use App\Helpers\Transliterator;
use App\Models\Central\Tenant;
use App\Models\Tenant\User;

class TenantRepository
{
    private int $randomNumber;

    public function __construct()
    {
        $this->randomNumber = rand(1, 10);
    }

    /**
     * Creating tenant and generates domain by organization name
     *
     * @param  string  $organizationName
     * @return \App\Models\Central\Tenant
     */
    public function createTenant(string $organizationName): Tenant
    {
        $tenant = Tenant::create([
            'id' => $this->generateName($organizationName),
            'name' => $organizationName,
        ]);
        $tenant->domains()->create([
            'domain' => $this->generateDomainName($organizationName)
        ]);

        return $tenant->load('domains');
    }

    /**
     * Deleting tenant
     *
     * @param  string  $tenant
     * @return bool|null
     */
    public function deleteTenant(string $tenant): ?bool
    {
        return tenancy()->find($tenant)->delete();
    }

    /**
     * Creating user for tenant from central
     *
     * @param  \App\Data\Central\RegistrationUserData  $userData
     * @param  \App\Models\Central\Tenant  $tenant
     * @return \App\Models\Tenant\User
     */
    public function createTenantUser(RegistrationUserData $userData, Tenant $tenant): User
    {
        return $tenant->run(function () use ($userData) {
            return User::create($userData->toArray());
        });
    }

    public function generateDomainName(string $organizationName): string {
        $domains = config('tenancy.central_domains');
        $domain = $domains[array_rand(config('tenancy.central_domains'))];

        return $this->generateName($organizationName) . '.' . $domain;
    }

    public function generateName(string $organizationName): string
    {
        $transliterated = Transliterator::transliterate($organizationName);

        return $transliterated . $this->randomNumber;
    }
}
