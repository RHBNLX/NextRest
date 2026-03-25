<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Order;
use App\Enums\PackageSize;
use App\Enums\OrderStatus;
/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
{

    protected $model = Order::class;
    public function definition(): array
    {
        return [
            'user_id' => \App\Models\User::factory(),
            'courier_id' => \App\Models\Courier::factory(),
            'pickup_address' => $this->faker->address(),
            'dropoff_address' => $this->faker->address(),
            'package_size' => $this->faker->randomElement(PackageSize::cases()),
            'notes' => $this->faker->optional()->sentence(),
            'price' => $this->faker->numberBetween(1000, 10000),
            'status' => $this->faker->randomElement(OrderStatus::cases()),
        ];
    }
}
