<?php

namespace Database\Seeders;

use App\Models\Tenant\Contact;
use App\Models\Tenant\Gardener;
use App\Models\Tenant\Plot;
use Database\Seeders\Tenant\StreetsTableSeeder;
use Illuminate\Database\Seeder;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class TenantDatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(StreetsTableSeeder::class);

        Plot::factory()
            ->count(178)
            ->sequence(
                fn($sequence) => ['plot_number' => $sequence->index + 1]
            )
            ->create()
            ->each(function ($plot) {
                $gardener = Gardener::factory()->create();
                $plot->owners()->attach($gardener->id, ['ownership_percentage' => 100]);
                $gardener->contacts()->createMany(
                    Contact::factory()->count(3)->make()->toArray()
                );
            });
    }
}
