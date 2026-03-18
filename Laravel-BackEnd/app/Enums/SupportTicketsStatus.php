<?php

namespace App\Enums;

enum SupportTicketsStatus: string
{
    case Open = 'open';
    case InProgress = 'in_progress';
    case Closed = 'closed';
}
?>
