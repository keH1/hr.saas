<?php

namespace App\Data\Tenant\Frontend\SelectOptions;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

abstract class SelectOptionsData extends Data
{
    public function __construct(
        public readonly int $value,
        public readonly string $label,
    ) {
    }
}
