<?php

namespace App\Data\Tenant\Frontend\Widgets;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class PageWidgets extends Data
{
    public function __construct(
        /** @var array<PageTotalWidget> */
        public readonly array $widgets,
    )
    {
    }
}
