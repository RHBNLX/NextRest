<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Enums\CourierStatus;
use App\Enums\VehicleType;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Courier extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'vehicle_type',
        'license_plate',
        'location',
        'status',
        'rating',
    ];
    protected $casts = [
        'status' => CourierStatus::class,
        'vehicle_type' => VehicleType::class,
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
