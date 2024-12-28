<?php

namespace App\Models\Central;

use App\Models\Tenant\User;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Stancl\Tenancy\Contracts\TenantWithDatabase;
use Stancl\Tenancy\Database\Concerns\HasDatabase;
use Stancl\Tenancy\Database\Concerns\HasDomains;
use Stancl\Tenancy\Database\Models\Tenant as BaseTenant;
use Stancl\Tenancy\Database\Models\TenantPivot;

class Tenant extends BaseTenant implements TenantWithDatabase
{
    use HasDatabase;
    use HasDomains;

    protected $fillable = [
        'id',
        'name'
    ];

    public static function getCustomColumns(): array
    {
        return [
            'id',
            'name',
        ];
    }

    public function domains(): HasOne
    {
        return $this->hasOne(config('tenancy.domain_model'), 'tenant_id');
    }

    public function users()
    {
        return $this->belongsToMany(CentralUser::class, 'tenant_users', 'tenant_id', 'global_user_id', 'id', 'global_id')
                    ->using(TenantPivot::class);
    }

    public function impersonationUrl(User $user): string
    {
        $domain = $this->domains()->first()->domain;
        $token = tenancy()->impersonate($this, $user->id, tenant_route($domain,'dashboard'), 'tenant')->token;

        return tenant_route($domain, 'impersonate', ['token' => $token]);
    }
}
