<?php

namespace App\Repositories\Central;

use App\Data\Central\RegistrationUserData;
use App\Models\Central\CentralUser;

class CentralUserRepository
{
    public function createUser(RegistrationUserData $userData): CentralUser
    {
        return CentralUser::create($userData->toArray());
    }

    public function getUserByGlobalId(string $id): CentralUser
    {
        return CentralUser::whereGlobalId($id)->first();
    }
}
