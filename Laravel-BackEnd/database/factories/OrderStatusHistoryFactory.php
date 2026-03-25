<?php

namespace Database\Factories;

use App\Models\OrderStatusHistory;
use App\Enums\OrderStatus;
use Illuminate\Database\Eloquent\Factories\Factory;


class OrderStatusHistoryFactory extends Factory
{
    protected $model = OrderStatusHistory::class;
    public function definition(): array
    {
        return [
            'order_id' => \App\Models\Order::factory(),
            'old_status' => $this->faker->randomElement(OrderStatus::cases()),
            'new_status' => $this->faker->randomElement(OrderStatus::cases()),
            'changed_at' => $this->faker->dateTime(),
            'changed_by' => \App\Models\User::factory(),
        ];
    }
}
