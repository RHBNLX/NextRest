<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order_Status_History;

class OrderStatusHistoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $order_status_histories = Order_Status_History::all();
        return response()->json($order_status_histories, 200, options: JSON_UNESCAPED_UNICODE);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request -> validate([
            'order_id' => 'required|integer|exists:orders,id',
            'old_status' => 'required|string|max:255',
            'new_status' => 'required|string|max:255',
            'changed_at' => 'required|date',
            'changed_by' => 'required|integer|exists:users,id'
        ], [
            "required" => "A(z) :attribute mező kötelező.",
            "integer" => "A :attribute mezőnek egész számnak kell lennie.",
            "exists" => "A megadott :attribute idegenkulcsnak értéknek kell léteznie.",
            "string" => "A :attribute mezőnek szöveges értéknek kell lennie.",
            "max" => "A :attribute mező nem lehet hosszabb, mint :max karakter.",
            "date" => "A :attribute mezőnek érvényes dátumnak kell lennie."
        ], [
            "order_id" => "rendelés azonosító",
            "old_status" => "régi állapot",
            "new_status" => "új állapot",
            "changed_at" => "változás időpontja",
            "changed_by" => "változást végrehajtó felhasználó azonosító"
        ]);
        Order_Status_History::create([
            'order_id' => $request->order_id,
            'old_status' => $request->old_status,
            'new_status' => $request->new_status,
            'changed_at' => $request->changed_at,
            'changed_by' => $request->changed_by
        ]);
        return response()->json(['uzenet' => 'Sikeresen változott a rendelés állapota!'], 201, options: JSON_UNESCAPED_UNICODE);
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
        $order_status_history = Order_Status_History::find($id);
        if (!$order_status_history) {
            return response()->json(['uzenet' => 'Nincs ilyen azonosítóval rendelés állapotváltozás!'], 404, options: JSON_UNESCAPED_UNICODE);
        } else {
            $order_status_history->delete();
            return response()->json(['uzenet' => 'Sikeresen törölve lett a rendelés állapotváltozása!'], 200, options: JSON_UNESCAPED_UNICODE);
        }

    }
}
