<?php

namespace App\Models\Central;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Propaganistas\LaravelPhone\Casts\E164PhoneNumberCast;
use Stancl\Tenancy\Database\Concerns\CentralConnection;

class User extends Authenticatable
{
    use CentralConnection;
    use HasFactory;
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'phone',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'phone' => E164PhoneNumberCast::class,
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
    public function gardeners(): HasMany
    {
        return $this->HasMany(Gardener::class);
    }
}
