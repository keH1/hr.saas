<?php

namespace App\Models\Tenant;

use App\Enums\Tenant\ContactLabels;
use App\Enums\Tenant\ContactTypes;
use App\Models\Tenant\Gardener;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

class Contact extends Model
{
    use HasFactory;

    protected $fillable = [
        'type',
        'label',
        'value',
        'is_primary',
        'comment',
    ];

    protected function casts(): array
    {
        return [
            'type' => ContactTypes::class,
            'label' => ContactLabels::class,
        ];
    }

    public function gardeners(): MorphToMany
    {
        return $this->morphedByMany(Gardener::class, 'contactable');
    }
}
