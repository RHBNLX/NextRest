<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Pivot;

class Rating extends Pivot
{
    protected $table = 'ratings';
    protected $fillable = [
        'order_id',
        'courier_id',
        'customer_id',
        'rating',
        'comment',
    ];


    //Pivot kapcsolat tábla lesz ez
    public function customer()
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    public function courier()
    {
        return $this->belongsTo(User::class, 'courier_id');
    }

    public function order()
    {
        return $this->belongsTo(Order::class, 'order_id');
    }
}


