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

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function chatMessages()
    {
        return $this->hasMany(ChatMessage::class, 'support_ticket_id');
    }
}
