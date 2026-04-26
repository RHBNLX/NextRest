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
            'license_plate' => $this->faker->regexify('[A-Z]{4}-[0-9]{3}'),
            'status' => $this->faker->randomElement(CourierStatus::cases()),
        ];
    }
}
