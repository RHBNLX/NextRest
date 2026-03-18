<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Enums\OrderStatus;

class Order_Status_History extends Model
{
    protected $fillable = [
        'order_id',
        'old_status',
        'new_status',
        'changed_at',
        'changed_by',
    ];

    protected $casts = [
        'old_status' => OrderStatus::class,
        'new_status' => OrderStatus::class,
    ];

    public function order()
    {
        return $this->belongsTo(Order::class, 'order_id');
    }
}
