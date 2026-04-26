<?php

namespace App\Enums;

enum OrderStatus: string
{
    case pending = 'pending';
    case assigned = 'assigned';
    case picked_up = 'picked_up';
    case delivered = 'delivered';
    case cancelled = 'cancelled';
}
?>
