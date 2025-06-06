<?php

namespace App\Enums\Tenant;

use App\Data\Tenant\Frontend\SelectOptions\ContactLabelsOptionsData;

enum ContactLabels: string
{
    case PRIMARY = 'Основной';
    case SECONDARY = 'Дополнительный';

    public static function toSelectOptions(): array
    {
        return array_map(
            fn(self $case) => new ContactLabelsOptionsData(
                value: $case->name,
                label: $case->value
            ),
            self::cases()
        );
    }
}
