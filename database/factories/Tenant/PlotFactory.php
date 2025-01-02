<?php

namespace Database\Factories\Tenant;

use Illuminate\Database\Eloquent\Factories\Factory;

class PlotFactory extends Factory
{
    public function definition(): array
    {
        return [
            'street_id' => $this->faker->numberBetween(1, 7),
            'cadastre_number' => $this->faker->unique()->numerify('40:26:000058:###'),
            'area' => $this->faker->numberBetween(450, 900),
        ];
    }
}
