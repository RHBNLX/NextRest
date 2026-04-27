<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Courier;
use App\Models\Order;
use App\Models\OrderStatusHistory;
use App\Models\SupportTicket;
use App\Models\ChatMessage;
use App\Enums\UserRole;
use App\Enums\OrderStatus;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. ADMINISZTRÁTOR
        User::factory()->create([
            'name' => 'Kovács Péter (Admin)',
            'email' => 'admin@nextrest.hu',
            'password' => Hash::make('test1234'),
            'role' => UserRole::admin,
        ]);

        // 2. ÜGYFÉL (Bíró Ádám)
        $biroAdam = User::factory()->create([
            'name' => 'Bíró Ádám',
            'email' => 'biro.adam@gmail.com',
            'password' => Hash::make('test1234'),
            'phone_number' => '+36301234567',
            'role' => UserRole::customer,
        ]);

        // 3. FUTÁR (Varga János)
        $vJanosUser = User::factory()->create([
            'name' => 'Varga János',
            'email' => 'v.janos@nextrest.hu',
            'password' => Hash::make('test1234'),
            'phone_number' => '+36709876543',
            'role' => UserRole::courier,
        ]);

        $vJanosCourier = Courier::factory()->create([
            'user_id' => $vJanosUser->id,
            'status' => 'active',
            'vehicle_type' => 'car',
        ]);

        // 4. TOVÁBBI FUTÁROK
        $couriers = collect(['Szabó Márk', 'Tóth Bence', 'Nagy Ervin'])->map(function ($name) {
            $user = User::factory()->create([
                'name' => $name,
                'role' => UserRole::courier,
                'password' => Hash::make('test1234'),
            ]);
            return Courier::factory()->create(['user_id' => $user->id]);
        });

        // 5. CÍMEK A TESZTELÉSHEZ
        $addresses = [
            ['p' => '1051 Budapest, Szent István tér 1.', 'd' => '1117 Budapest, Alíz utca 2.'],
            ['p' => '1061 Budapest, Andrássy út 22.', 'd' => '1024 Budapest, Lövőház u. 2.'],
            ['p' => '1072 Budapest, Akácfa u. 42.', 'd' => '1138 Budapest, Váci út 178.'],
            ['p' => '1085 Budapest, Baross u. 10.', 'd' => '1052 Budapest, Petőfi Sándor u. 3.'],
        ];

        // 6. RENDELÉSEK VARGA JÁNOSNAK (Dashboard demóhoz)
        // Aktív feladat (Zöld a Dashboardon)
        Order::factory()->create([
            'user_id' => $biroAdam->id,
            'courier_id' => $vJanosCourier->id,
            'status' => OrderStatus::picked_up,
            'pickup_address' => $addresses[0]['p'],
            'dropoff_address' => $addresses[0]['d'],
            'price' => 2800,
            'package_size' => 'medium',
            'notes' => 'A kapucsengő 12, kérem hívjon érkezéskor.',
        ]);

        // Kiosztott feladat (Kék a Dashboardon)
        Order::factory()->create([
            'user_id' => $biroAdam->id,
            'courier_id' => $vJanosCourier->id,
            'status' => OrderStatus::assigned,
            'pickup_address' => $addresses[1]['p'],
            'dropoff_address' => $addresses[1]['d'],
            'price' => 1500,
            'package_size' => 'small',
        ]);

        // 7. TÖMEGES ADAT AZ ADMIN PANELHEZ (Rendelések + Support)
        $customers = User::factory(10)->create(['role' => UserRole::customer]);
        $customers->push($biroAdam);

        foreach ($customers as $customer) {
            $orderCount = rand(3, 6);
            for ($i = 0; $i < $orderCount; $i++) {
                $addr = $addresses[array_rand($addresses)];
                $order = Order::factory()->create([
                    'user_id' => $customer->id,
                    'courier_id' => $couriers->random()->id,
                    'status' => collect(OrderStatus::cases())->random(),
                    'pickup_address' => $addr['p'],
                    'dropoff_address' => $addr['d'],
                    'price' => rand(1200, 9000),
                ]);

                // Support Ticket szimuláció
                if (rand(1, 4) === 1) {
                    $ticket = SupportTicket::factory()->create([
                        'user_id' => $customer->id,
                        'order_id' => $order->id,
                        'subject' => 'Érdeklődés: #' . $order->id,
                        'status' => 'open',
                    ]);

                    ChatMessage::create([
                        'user_id' => $customer->id,
                        'support_ticket_id' => $ticket->id,
                        'message' => 'Mikorra várható a csomag érkezése?',
                    ]);
                }
            }
        }
    }
}