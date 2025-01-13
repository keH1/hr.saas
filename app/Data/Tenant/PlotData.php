<?php

namespace App\Data\Tenant;

use Carbon\CarbonImmutable;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Casts\DateTimeInterfaceCast;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript("Plot")]
class PlotData extends Data
{
    public function __construct(
        public readonly int $id,
        public readonly int $plot_number,
        public readonly int $street_id,
        public readonly StreetData $street,
        /** @var array<GardenerData> */
        public readonly ?array $owners,
        public readonly int $area,
        public readonly string $cadastre_number,
        #[WithCast(DateTimeInterfaceCast::class, format: 'Y-m-d\TH:i:s.u\Z')]
        public readonly CarbonImmutable $created_at,
        #[WithCast(DateTimeInterfaceCast::class, format: 'Y-m-d\TH:i:s.u\Z')]
        public readonly CarbonImmutable $updated_at
    ) {
    }
}
