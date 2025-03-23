<?php

namespace App\Repositories\Tenant;

use App\Data\Tenant\Forms\PlotCreateData;
use App\Models\Tenant\Plot;
use Illuminate\Support\Facades\DB;
use App\Data\Tenant\Forms\GardenerCreateData;

class PlotRepository
{
    public function __construct(
        private GardenerRepository $gardenerRepository
    ) {
    }

    public function create(PlotCreateData $data): Plot
    {
        return DB::transaction(function () use ($data) {
            $plot = new Plot();
            $plot->plot_number = $data->plot_number;
            $plot->street_id = $data->street_id;
            $plot->cadastre_number = $data->cadastre_number;
            $plot->area = $data->area;
            $plot->save();

            // Обрабатываем каждого владельца и прикрепляем к участку
            $this->attachOwnersToPlot($plot, $data->owners);

            return $plot;
        });
    }

    /**
     * @param  \App\Models\Tenant\Plot  $plot
     * @param  array<GardenerCreateData>  $ownersData
     * @return void
     */
    private function attachOwnersToPlot(Plot $plot, array $ownersData): void
    {
        $ownersCount = count($ownersData);

        foreach ($ownersData as $ownerData) {
            $ownershipPercentage = $ownersCount === 1 ? 100 : $ownerData->ownership_percentage;

            if ($ownerData->isNew) {
                $gardener = $this->gardenerRepository->create($ownerData);
                $gardenerId = $gardener->id;
            } else {
                $gardenerId = $ownerData->id;
            }

            // Прикрепляем садовода к участку
            $plot->owners()->attach($gardenerId, [
                'ownership_percentage' => $ownershipPercentage
            ]);
        }
    }
}
