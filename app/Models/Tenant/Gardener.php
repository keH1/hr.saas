<?php

namespace App\Models\Tenant;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

class Gardener extends Model
{
    use HasFactory;
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'last_name',
        'first_name',
        'middle_name',
        'residence_address',
        'mailing_address',
        'is_member'
    ];

    protected $hidden = ['pivot'];
    protected $appends = ['ownership_percentage'];

    public function getOwnershipPercentageAttribute(): ?string
    {
        return $this->pivot ? $this->pivot->ownership_percentage : null;
    }

    /**
     * @return BelongsToMany
     */
    public function plots(): BelongsToMany
    {
        return $this->belongsToMany(Plot::class, 'gardener_plot')
                    ->withPivot('ownership_percentage')
                    ->withTimestamps();
    }

    public function contacts(): MorphToMany
    {
        return $this->morphToMany(Contact::class, 'contactable');
    }
}
