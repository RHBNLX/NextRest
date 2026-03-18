<?php

namespace Database\Factories;

use App\Enums\CourierStatus;
use App\Enums\VehicleType;
use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Courier;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Courier>
 */
class CourierFactory extends Factory
{
    protected $model = Courier::class;
    public function definition(): array
    {
        return [
            'user_id' => \App\Models\User::factory(),
            'vehicle_type' => $this->faker->randomElement(VehicleType::cases()),
            'status' => $this->faker->randomElement(CourierStatus::cases()),
            'rating' => $this->faker->randomFloat(1, 1, 5),
        ];
    }
}
