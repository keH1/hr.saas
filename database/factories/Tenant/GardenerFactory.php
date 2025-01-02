<?php

namespace Database\Factories\Tenant;

use Illuminate\Database\Eloquent\Factories\Factory;

class GardenerFactory extends Factory
{
    public function definition(): array
    {
        return [
            'last_name' => $this->faker->lastName,
            'first_name' => $this->faker->firstName,
            'middle_name' => $this->faker->middleName,
            'residence_address' => $this->faker->address,
            'mailing_address' => $this->faker->optional()->address,
            'is_member' => $this->faker->boolean,
        ];
    }
}
