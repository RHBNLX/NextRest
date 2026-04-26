<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Enums\UserRole;

class ChatMessage extends Model
{
    protected $fillable = ['user_id', 'support_ticket_id', 'message'];

    protected $appends = ['is_admin'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function ticket(): BelongsTo
    {
        return $this->belongsTo(SupportTicket::class, 'support_ticket_id');
    }
    public function getIsAdminAttribute(): bool
    {
        return $this->user?->role === UserRole::admin;
    }
}