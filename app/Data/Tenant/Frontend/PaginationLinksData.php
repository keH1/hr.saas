<?php

namespace App\Data\Tenant\Frontend;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript("PaginationLinks")]
class PaginationLinksData extends Data
{
    public function __construct(
        public readonly string $label,
        public readonly ?string $url,
        public readonly bool $active
    ) {
    }
}
