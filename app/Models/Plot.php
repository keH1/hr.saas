<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Plot extends Model
{

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

    /**
     * @return BelongsTo
     */
    public function street(): BelongsTo
    {
        return $this->BelongsTo(Street::class);
    }

    /**
     * @return BelongsToMany
     */
    public function gardeners(): BelongsToMany
    {
        return $this->BelongsToMany(Gardener::class,'gardener_plot');
    }
}
