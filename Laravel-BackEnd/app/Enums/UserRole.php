<?php

namespace App\Enums;

enum UserRole: string
{
    case admin = 'admin';
    case customer = 'customer';
    case courier = 'courier';
}
?>