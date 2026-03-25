<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Enums\SupportTicketsStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SupportTicket extends Model
{
    use HasFactory;
    protected $table = 'support_tickets';

    protected $fillable = [
        'user_id',
        'order_id',
        'subject',
        'message',
        'status',
    ];

    protected $casts = [
        'status' => SupportTicketsStatus::class,
    ];

    public function order()
    {
        return $this->belongsTo(Order::class, 'order_id');
    }
}
