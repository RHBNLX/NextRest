<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Enums\OrderStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class OrderStatusHistory extends Model
{
    use HasFactory;
    protected $table = "order_status_history";
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
