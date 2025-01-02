<?php

namespace Database\Factories\Tenant;

use App\Enums\Tenant\ContactLabels;
use App\Enums\Tenant\ContactTypes;
use Illuminate\Database\Eloquent\Factories\Factory;

class ContactFactory extends Factory
{
    public function definition(): array
    {
        $type = $this->faker->randomElement([ContactTypes::PHONE, ContactTypes::EMAIL]);
        $label = $this->faker->randomElement([ContactLabels::PRIMARY, ContactLabels::SECONDARY]);

        return [
            'type' => $type,
            'label' => $label,
            'value' => $type === ContactTypes::PHONE ? $this->faker->phoneNumber : $this->faker->safeEmail,
            'is_primary' => $label === ContactLabels::PRIMARY,
            'comment' => $this->faker->optional()->sentence,
        ];
    }
}
