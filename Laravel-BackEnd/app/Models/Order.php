<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Enums\OrderStatus;
use App\Enums\PackageStatus;

class Order extends Model
{
    protected $fillable = [
        'user_id',
        'courier_id',
        'pickup_address',
        'dropoff_address',
        'package_status',
        'notes',
        'price',
        'status',
        //'pickup_time',
        //'delivery_time',
    ];

    // protected $casts = [
    //     'status' => OrderStatus::class,
    //     'package_status' => PackageStatus::class,
    // ];

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
        return $this->hasMany(Order_Status_History::class);
    }

    public function rating()
    {
        return $this->hasOne(Rating::class);
    }

    public function support_tickets()
    {
        return $this->hasMany(Support_Ticket::class);
    }


}
