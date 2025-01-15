<?php

namespace App\Models\Tenant;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Laravel\Scout\Searchable;
use Propaganistas\LaravelPhone\Casts\E164PhoneNumberCast;

class Plot extends Model
{
    use HasFactory;
    use Searchable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'plot_number',
        'cadastre_number',
        'area',
    ];

    protected $with = ['street'];

    public function toSearchableArray(): array
    {
        return [
            'plot_number' => $this->plot_number,
            'cadastre_number' => $this->cadastre_number,
        ];
    }

    /**
     * @return BelongsTo
     */
    public function street(): BelongsTo
    {
        return $this->belongsTo(Street::class);
    }

    /**
     * @return BelongsToMany
     */
    public function owners(): BelongsToMany
    {
        return $this->belongsToMany(Gardener::class, 'gardener_plot')
                    ->withPivot('ownership_percentage')
                    ->withTimestamps();
    }
}
