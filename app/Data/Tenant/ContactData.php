<?php

namespace App\Data\Tenant;

use App\Enums\Tenant\ContactLabels;
use App\Enums\Tenant\ContactTypes;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript("Contact")]
class ContactData extends Data
{
    public function __construct(
        public readonly int $id,
        public readonly ContactTypes $type,
        public readonly ContactLabels $label,
        public readonly string $value,
        public readonly bool $is_primary,
        #[Optional]
        public readonly ?string $comment,
    ) {
    }
}
