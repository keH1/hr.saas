<?php

namespace App\Data\Tenant\Frontend\Widgets;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript('PageWidget')]
class PageTotalWidget extends Data
{
    public function __construct(
        public readonly string $name,
        public readonly string $data,
        #[Optional]
        public readonly ?string $measureUnit = null,
    )
    {
    }
}
