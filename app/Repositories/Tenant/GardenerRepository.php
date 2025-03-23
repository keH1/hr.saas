<?php

namespace App\Repositories\Tenant;

use App\Data\Tenant\Forms\GardenerCreateData;
use App\Models\Tenant\Gardener;

class GardenerRepository
{
    public function create(GardenerCreateData $data): Gardener
    {
        $gardener = new Gardener();
        $gardener->last_name = $data->last_name;
        $gardener->first_name = $data->first_name;
        $gardener->middle_name = $data->middle_name;
        $gardener->registration_address = $data->registration_address;
        $gardener->residence_address = $data->residence_address;
        $gardener->mailing_address = $data->mailing_address;
        $gardener->is_member = $data->is_member;
        $gardener->membership_start_date = $data->membership_start_date;
        $gardener->membership_end_date = $data->membership_end_date;

        $gardener->save();

        return $gardener;
    }
}
