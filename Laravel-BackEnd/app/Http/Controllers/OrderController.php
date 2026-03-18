<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $oreders  = Order::all();
        return response()->json($oreders, 200, options: JSON_UNESCAPED_UNICODE);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|integer|exists:users,id',
            'courier_id' => 'required|integer|exists:couriers,id',
            'pickup_address' => 'required|string|max:255',
            'dropoff_address' => 'required|string|max:255',
            'package_status' => 'required|string|max:255',
            'notes' => 'nullable|string|max:255',
            'price' => 'required|integer',
            'status' => 'required|string|max:255',
        ], [
            "required" => "A(z) :attribute mező kötelező.",
            "integer" => "A :attribute mezőnek egész számnak kell lennie.",
            "exists" => "A megadott :attribute idegenkulcsnak értéknek kell léteznie.",
            "string" => "A :attribute mezőnek szöveges értéknek kell lennie.",
            "max" => "A :attribute mező nem lehet hosszabb, mint :max karakter.",
        ],[
            "user_id" => "felhasználó azonosító",
            "courier_id" => "futár azonosító",
            "pickup_address" => "felvételi cím",
            "dropoff_address" => "kézbesítési cím",
            "package_status" => "csomag állapota",
            "notes" => "megjegyzés",
            "price" => "ár",
            "status" => "állapot"
        ]);

        Order::create([
            'user_id' => $request->user_id,
            'courier_id' => $request->courier_id,
            'pickup_address' => $request->pickup_address,
            'dropoff_address' => $request->dropoff_address,
            'package_status' => $request->package_status,
            'notes' => $request->notes,
            'price' => $request->price,
            'status' => $request->status
        ]);
        return response()->json(['uzenet' => 'Sikeres rendelés létrehozás!'], 201, options: JSON_UNESCAPED_UNICODE);

    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
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
