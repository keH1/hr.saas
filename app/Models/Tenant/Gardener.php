<?php

namespace App\Models\Tenant;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Laravel\Scout\Searchable;

class Gardener extends Model
{
    use HasFactory;
    use Searchable;

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
    protected $appends = ['ownership_percentage', 'primary_contact', 'name'];

    public function getOwnershipPercentageAttribute(): ?string
    {
        return $this->pivot ? $this->pivot->ownership_percentage : null;
    }

    public function getNameAttribute(): ?string
    {
        return "$this->last_name $this->first_name $this->middle_name";
    }

    public function getPrimaryContactAttribute(): ?Contact
    {
        if ($this->relationLoaded('contacts')) {
            return $this->contacts()->where('is_primary', true)->first();
        }

        return $this->contacts()->where('is_primary', true)->first();
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

    public function toSearchableArray(): array
    {
        return [
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'middle_name' => $this->middle_name,
        ];
    }
}
