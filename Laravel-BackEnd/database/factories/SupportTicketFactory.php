<?php

namespace Database\Factories;

use App\Models\Support_Ticket;
use App\Enums\SupportTicketsStatus;
use Illuminate\Database\Eloquent\Factories\Factory;


class SupportTicketFactory extends Factory
{
        protected $model = Support_Ticket::class;
    public function definition(): array
    {
        return [
            'user_id' => \App\Models\User::factory(),
            'order_id' => \App\Models\Order::factory(),
            'subject' => $this->faker->sentence(),
            'message' => $this->faker->paragraph(),
            'status' => $this->faker->randomElement(SupportTicketsStatus::cases()),
        ];
    }
}
