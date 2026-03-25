<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Courier;
use App\Models\Order;
use App\Models\OrderStatusHistory;
use App\Models\SupportTicket;
use App\Models\ChatMessage;
use App\Models\Rating;
use App\Enums\UserRole;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Adminisztrátor',
            'email' => 'admin@nextrest.hu',
            'password' => Hash::make('password123'),
            'role' => UserRole::Admin,
        ]);
        $customers = User::factory(10)->create(['role' => UserRole::Customer]);
        $courierUsers = User::factory(5)->create(['role' => UserRole::Courier]);
        $couriers = $courierUsers->map(function ($user) {
            return Courier::factory()->create(['user_id' => $user->id]);
        });
        $customers->each(function ($customer) use ($couriers) {
            $orders = Order::factory(2)->create([
                'user_id' => $customer->id,
                'courier_id' => $couriers->random()->id,
            ]);

            $orders->each(function ($order) use ($customer) {
                OrderStatusHistory::factory()->create([
                    'order_id' => $order->id,
                    'changed_by' => $order->user_id,
                ]);
                $ticket = SupportTicket::factory()->create([
                    'user_id' => $customer->id,
                    'order_id' => $order->id,
                ]);
                ChatMessage::create([
                    'user_id' => $customer->id,
                    'support_ticket_id' => $ticket->id,
                    'message' => 'Segítséget szeretnék kérni a rendelésemmel kapcsolatban!',
                ]);
                Rating::factory()->create([
                    'order_id' => $order->id,
                    'customer_id' => $customer->id,
                    'courier_id' => $order->courier->user_id,
                ]);
            });
        });
    }
}