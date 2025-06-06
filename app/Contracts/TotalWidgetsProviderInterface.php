<?php

namespace App\Contracts;

use App\Data\Tenant\Frontend\Widgets\PageWidgets;

interface TotalWidgetsProviderInterface
{
    /**
     * Собирает и возвращает виджеты с итоговыми показателями
     *
     * @return \App\Data\Tenant\Frontend\Widgets\PageWidgets
     */
    public function buildTotalWidgets(): PageWidgets;
}
