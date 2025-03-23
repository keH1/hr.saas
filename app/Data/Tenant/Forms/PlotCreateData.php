<?php

namespace App\Data\Tenant\Forms;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

class PlotCreateData extends Data
{
    public function __construct(
        public readonly string $plot_number,
        public readonly int $street_id,
        public readonly string $cadastre_number,
        public readonly int $area,
        #[DataCollectionOf(GardenerCreateData::class)]
        public readonly array $owners,
    )
    {
    }

    public static function fromRequest(array $validatedData): self
    {
        return new self(
            plot_number: $validatedData['plot_number'],
            street_id: $validatedData['street']['value'],
            cadastre_number: $validatedData['cadastre_number'],
            area: $validatedData['area'],
            owners: array_map(function($owner) {
                return GardenerCreateData::fromOwnerData($owner);
            }, $validatedData['owners'])
        );
    }
}
