<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Enums\OrderStatus;
use App\Enums\PackageSize;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Order extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'courier_id',
        'pickup_address',
        'dropoff_address',
        'package_size',
        'notes',
        'price',
        'status',
    ];

    protected $casts = [
        'status' => OrderStatus::class,
        'package_size' => PackageSize::class,
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    public function courier()
    {
        return $this->belongsTo(Courier::class, 'courier_id');
    }

    public function order_status_histories()
    {
        return $this->hasMany(OrderStatusHistory::class);
    }

    public function rating()
    {
        return $this->hasOne(Rating::class);
    }

    public function support_tickets()
    {
        return $this->hasMany(SupportTicket::class);
    }


}
