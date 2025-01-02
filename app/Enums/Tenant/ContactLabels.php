<?php

namespace App\Enums\Tenant;

enum ContactLabels: string
{
    case PRIMARY = 'Основной';
    case SECONDARY = 'Дополнительный';
}
