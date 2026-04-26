<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\OrderStatusHistory;

class OrderStatusHistoryController extends Controller
{
    public function index()
    {
        $order_status_histories = OrderStatusHistory::all();
        return response()->json($order_status_histories, 200, options: JSON_UNESCAPED_UNICODE);
    }

    public function store(Request $request)
    {
        $request->validate([
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
        OrderStatusHistory::create([
            'order_id' => $request->order_id,
            'old_status' => $request->old_status,
            'new_status' => $request->new_status,
            'changed_at' => $request->changed_at,
            'changed_by' => $request->changed_by
        ]);
        return response()->json(['uzenet' => 'Sikeresen változott a rendelés állapota!'], 201, options: JSON_UNESCAPED_UNICODE);
    }
    public function update(Request $request, string $id)
    {
        //
    }
    public function destroy(string $id)
    {
        $order_status_history = OrderStatusHistory::find($id);
        if (!$order_status_history) {
            return response()->json(['uzenet' => 'Nincs ilyen azonosítóval rendelés állapotváltozás!'], 404, options: JSON_UNESCAPED_UNICODE);
        } else {
            $order_status_history->delete();
            return response()->json(['uzenet' => 'Sikeresen törölve lett a rendelés állapotváltozása!'], 200, options: JSON_UNESCAPED_UNICODE);
        }

    }
}
