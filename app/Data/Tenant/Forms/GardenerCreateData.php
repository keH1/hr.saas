<?php

namespace App\Data\Tenant\Forms;

use Carbon\CarbonImmutable;
use Spatie\LaravelData\Data;

class GardenerCreateData extends Data
{
    public function __construct(
        public readonly ?int $id,
        public readonly bool $isNew,
        public readonly ?string $last_name,
        public readonly ?string $first_name,
        public readonly ?string $middle_name,
        public readonly ?string $registration_address,
        public readonly ?string $residence_address,
        public readonly ?string $mailing_address,
        public readonly bool $is_member,
        public readonly ?CarbonImmutable $membership_start_date,
        public readonly ?CarbonImmutable $membership_end_date,
        public readonly ?float $ownership_percentage,
    ) {
    }

    public static function fromOwnerData(array $ownerData): self
    {
        return new self(
            id: $ownerData['gardenerId']['value'] ?? null,
            isNew: $ownerData['isNew'],
            last_name: $ownerData['lastName']['value'] ?? null,
            first_name: $ownerData['firstName']['value'] ?? null,
            middle_name: $ownerData['secondName']['value'] ?? null,
            registration_address: $ownerData['registration_address']['value'] ?? null,
            residence_address: $ownerData['residence_address']['value'] ?? null,
            mailing_address: $ownerData['mailing_address']['value'] ?? null,
            is_member: $ownerData['is_member'],
            membership_start_date: isset($ownerData['membership_start_date']) ? CarbonImmutable::parse($ownerData['membership_start_date']) : null,
            membership_end_date: isset($ownerData['membership_end_date']) ? CarbonImmutable::parse($ownerData['membership_end_date']) : null,
            ownership_percentage: $ownerData['ownership_percentage'] ?? null,
        );
    }
}
