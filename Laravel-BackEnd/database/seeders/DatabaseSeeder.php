<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Courier;
use App\Models\Order;
use App\Models\OrderStatusHistory;
use App\Models\SupportTicket;
use App\Models\ChatMessage;
use App\Enums\UserRole;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Admin létrehozása
        User::factory()->create([
            'name' => 'Adminisztrátor',
            'email' => 'admin@nextrest.hu',
            'password' => Hash::make('password123'),
            'role' => UserRole::admin,
        ]);

        // 2. Specifikus felhasználó létrehozása: Bíró Ádám
        $biroAdam = User::factory()->create([
            'name' => 'Bíró Ádám',
            'email' => 'mir@gmail.com',
            'password' => Hash::make('test1234'),
            'phone_number' => '+36301234567',
            'role' => UserRole::customer,
            'phone_changed_at' => null, // Kezdeti érték
        ]);

        // 3. Futárok létrehozása (szükséges a rendeléshez)
        $courierUsers = User::factory(5)->create(['role' => UserRole::courier]);
        $couriers = $courierUsers->map(function ($user) {
            return Courier::factory()->create(['user_id' => $user->id]);
        });

        // 4. Rendelés és Support Ticket hozzárendelése Bíró Ádámhoz
        $order = Order::factory()->create([
            'user_id' => $biroAdam->id,
            'courier_id' => $couriers->random()->id,
            'status' => 'pending',
        ]);

        OrderStatusHistory::factory()->create([
            'order_id' => $order->id,
            'changed_by' => $biroAdam->id,
        ]);

        $ticket = SupportTicket::factory()->create([
            'user_id' => $biroAdam->id,
            'order_id' => $order->id,
            'subject' => 'Segítség kérés',
            'status' => 'open',
        ]);

        ChatMessage::create([
            'user_id' => $biroAdam->id,
            'support_ticket_id' => $ticket->id,
            'message' => 'Segítséget szeretnék kérni a rendelésemmel kapcsolatban!',
        ]);

        // 5. További véletlenszerű ügyfelek generálása (opcionális, maradék 9 fő)
        $customers = User::factory(9)->create(['role' => UserRole::customer]);

        $customers->push($biroAdam); // Hozzáadjuk a listához a többi generáláshoz

        // Többi ügyfélnek is generálunk alapértelmezett adatokat
        $customers->each(function ($customer) use ($couriers, $biroAdam) {
            // Ádámnak már generáltunk, a többieknek itt:
            if ($customer->id !== $biroAdam->id) {
                $orders = Order::factory(2)->create([
                    'user_id' => $customer->id,
                    'courier_id' => $couriers->random()->id,
                ]);

                $orders->each(function ($order) use ($customer) {
                    $ticket = SupportTicket::factory()->create([
                        'user_id' => $customer->id,
                        'order_id' => $order->id,
                    ]);

                    ChatMessage::create([
                        'user_id' => $customer->id,
                        'support_ticket_id' => $ticket->id,
                        'message' => 'Automata üzenet segítségkéréshez.',
                    ]);
                });
            }
        });
    }
}