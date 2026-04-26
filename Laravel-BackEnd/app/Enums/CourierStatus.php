<?php

namespace App\Enums;

enum CourierStatus: string
{
    case active = 'active';
    case offline = 'offline';
    case busy = 'busy';
}
?>