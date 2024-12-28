<?php

namespace App\Data\Casts;

use Propaganistas\LaravelPhone\PhoneNumber;
use Spatie\LaravelData\Casts\Cast;
use Spatie\LaravelData\Support\Creation\CreationContext;
use Spatie\LaravelData\Support\DataProperty;

class PhoneCast implements Cast
{

    /**
     * @inheritDoc
     */
    public function cast(DataProperty $property, mixed $value, array $properties, CreationContext $context): mixed
    {
        if ($value instanceof PhoneNumber) {
            return $value;
        }

        if (empty($value)) {
            return null;
        }

        return new PhoneNumber($value, 'RU');
    }
}
