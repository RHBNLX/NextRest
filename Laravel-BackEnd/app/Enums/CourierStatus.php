<?php

namespace App\Enums;

enum CourierStatus: string
{
    case Active = 'active';
    case Offline = 'offline';
    case Busy = 'busy';
}
?>