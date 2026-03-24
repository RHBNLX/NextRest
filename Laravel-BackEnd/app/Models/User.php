<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Enums\UserRole;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'phone_number',
        'password',
        'role',
        'avatar_url',
    ];
    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'role' => UserRole::class,
        'password' => 'hashed',
    ];

    // Kapcsolatok
    public function orders()
    {
        return $this->hasMany(Order::class);
    }
    public function courier_profiles()
    {
        return $this->hasMany(Courier::class);
    }
    public function ratings()
    {
        return $this->hasMany(Rating::class);
    } // Javítva: ratings (elírás volt)
}