<?php

namespace App\Models\Tenant;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;


class History extends Model
{

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'action_type',
        'params'
    ];
    /**
     * @return HasMany
     */
    public function plot(): HasMany
    {
        return $this->HasMany(Plot::class);
    }
}
