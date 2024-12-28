<?php

namespace App\Data\Central;

use App\Data\Casts\PhoneCast;
use Propaganistas\LaravelPhone\PhoneNumber;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Data;

/**
 * DTO for transfer User data when for a registration process only
 */
class RegistrationUserData extends Data
{
    public function __construct(
        public ?string $global_id,
        public readonly string $name,
        public readonly string $email,
        #[WithCast(PhoneCast::class)]
        public readonly PhoneNumber $phone,
        public readonly string $password,
    ) {
    }
}
