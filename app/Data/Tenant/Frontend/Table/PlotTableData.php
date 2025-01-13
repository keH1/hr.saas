<?php

namespace App\Data\Tenant\Frontend\Table;

use App\Data\Tenant\PlotData;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript("Plots")]
class PlotTableData extends TableData
{
    /** @var array<PlotData> */
    public ?array $data;
}
