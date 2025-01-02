<?php

namespace Database\Seeders\Tenant;

use App\Models\Tenant\Street;
use Illuminate\Database\Seeder;

class StreetsTableSeeder extends Seeder
{
    public function run(): void
    {
        $streets = [
            'Первая',
            'Вторая',
            'Третья',
            'Четвертая',
            'Пятая',
            'Шестая',
            'Окружная',
        ];

        foreach ($streets as $street) {
            $road = new Street();
            $road->name = $street;
            $road->save();
        }
    }
}
