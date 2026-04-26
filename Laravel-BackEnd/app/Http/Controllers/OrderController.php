<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use Illuminate\Validation\Rule;
use App\Enums\PackageSize;
use App\Enums\OrderStatus;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::all();
        return response()->json($orders, 200, options: JSON_UNESCAPED_UNICODE);
    }

    public function getUserOrders($id)
    {
        try {
            $orders = Order::where('user_id', auth()->id())
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json($orders, 200, [], JSON_UNESCAPED_UNICODE);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|integer|exists:users,id',
            'courier_id' => 'required|integer|exists:couriers,id',
            'pickup_address' => 'required|string|max:255',
            'dropoff_address' => 'required|string|max:255',
            'package_size' => ['required', Rule::enum(PackageSize::class)],
            'notes' => 'nullable|string|max:255',
            'price' => 'required|integer',
            'status' => ['required', Rule::enum(OrderStatus::class)],
        ], [
            "required" => "A(z) :attribute mező kötelező.",
            "integer" => "A :attribute mezőnek egész számnak kell lennie.",
            "exists" => "A megadott :attribute nem létezik az adatbázisban.",
            "string" => "A :attribute mezőnek szöveges értéknek kell lennie.",
            "max" => "A :attribute mező nem lehet hosszabb, mint :max karakter.",
            "enum" => "A(z) :attribute mező értéke érvénytelen.",
        ], [
            "user_id" => "felhasználó azonosító",
            "courier_id" => "futár azonosító",
            "pickup_address" => "felvételi cím",
            "dropoff_address" => "kézbesítési cím",
            "package_size" => "csomag mérete",
            "notes" => "megjegyzés",
            "price" => "ár",
            "status" => "állapot"
        ]);
        Order::create($validated);

        return response()->json(['uzenet' => 'Sikeres rendelés létrehozás!'], 201, [], JSON_UNESCAPED_UNICODE);
    }
    public function update(Request $request, string $id)
    {
        //
    }
    public function destroy(string $id)
    {
        $order = Order::find($id);
        if (!$order) {
            return response()->json(['uzenet' => 'Rendelés nem található!'], 404, options: JSON_UNESCAPED_UNICODE);
        }
        $order->delete();
        return response()->json(['uzenet' => 'Sikeres rendelés törlés!'], 200, options: JSON_UNESCAPED_UNICODE);
    }
}
