<?php

namespace App\Enums;

enum SupportTicketsStatus: string
{
    case open = 'open';
    case in_progress = 'in_progress';
    case closed = 'closed';
}
?>
