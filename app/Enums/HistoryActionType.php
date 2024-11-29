<?php

namespace App\Enums;

enum HistoryActionType: string
{
    case CREATE = 'create';
    case UPDATE = 'update';
    case DELETE = 'delete';
}
