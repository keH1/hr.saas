<?php

namespace App\Data\Tenant;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript("Street")]
class StreetData extends Data
{
    public function __construct(
        public readonly int $id,
        public readonly string $name,
    ) {
    }
}
