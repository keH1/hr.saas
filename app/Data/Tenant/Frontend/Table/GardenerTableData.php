<?php

namespace App\Data\Tenant\Frontend\Table;

use App\Data\Tenant\GardenerData;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript("Gardeners")]
class GardenerTableData extends TableData
{
    /** @var array<GardenerData> */
    public ?array $data;
}
