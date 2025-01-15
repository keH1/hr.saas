<?php

namespace App\Data\Tenant;

use Carbon\CarbonImmutable;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Casts\DateTimeInterfaceCast;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript("Gardener")]
class GardenerData extends Data
{
    public function __construct(
        public readonly int $id,
        public readonly string $last_name,
        public readonly string $first_name,
        public readonly ?string $middle_name,
        public readonly string $residence_address,
        public readonly ?string $mailing_address,
        public readonly bool $is_member,
        public readonly ?CarbonImmutable $membership_start_date,
        public readonly ?CarbonImmutable $membership_end_date,
        public readonly bool $archived,
        public readonly ?float $ownership_percentage,
        #[WithCast(DateTimeInterfaceCast::class, format: 'Y-m-d\TH:i:s.u\Z')]
        public readonly CarbonImmutable $created_at,
        #[WithCast(DateTimeInterfaceCast::class, format: 'Y-m-d\TH:i:s.u\Z')]
        public readonly CarbonImmutable $updated_at,
        #[Optional] /** @var array<ContactData> */
        public readonly ?array $contacts,
        #[Optional] /** @var array<PlotData> */
        public readonly ?array $plots,
        #[Optional]
        public readonly ?ContactData $primary_contact
    ) {
    }
}
