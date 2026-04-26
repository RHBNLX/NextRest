<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SupportTicket;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class SupportTicketController extends Controller
{
    public function getUserTickets()
    {
        $userId = Auth::id();

        $tickets = SupportTicket::where('user_id', $userId)
            ->with('order')
            ->orderBy('created_at', 'desc')
            ->get();

        if ($tickets->isEmpty()) {
            return response()->json([], 200);
        }

        return response()->json($tickets, 200, [], JSON_UNESCAPED_UNICODE);
    }
    public function index()
    {
        $support_tickets = SupportTicket::all();
        return response()->json($support_tickets, 200, options: JSON_UNESCAPED_UNICODE);
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'nullable|integer|exists:users,id',
            'order_id' => 'nullable|integer|exists:orders,id',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
            'status' => 'required|string|max:255',
        ], [
            "required" => "A(z) :attribute mező kötelező.",
            "integer" => "A :attribute mezőnek egész számnak kell lennie.",
            "exists" => "A megadott :attribute nem létezik.",
            "string" => "A :attribute mezőnek szövegesnek kell lennie.",
            "max" => "A :attribute mező nem lehet hosszabb, mint :max karakter.",
        ], [
            "user_id" => "felhasználó azonosító",
            "order_id" => "rendelés azonosító",
            "subject" => "tárgy",
            "message" => "üzenet",
            "status" => "állapot",
        ]);
        SupportTicket::create($validated);

        return response()->json(['uzenet' => 'Sikeres support jegy létrehozás!'], 201, [], JSON_UNESCAPED_UNICODE);
    }
    public function update(Request $request, string $id)
    {
        //
    }
    public function destroy(string $id)
    {
        $support_ticket = SupportTicket::find($id);
        if (!$support_ticket) {
            return response()->json(['uzenet' => 'Nincs ilyen azonosítóval rendelkező support jegy!'], 404, options: JSON_UNESCAPED_UNICODE);
        } else {
            $support_ticket->delete();
            return response()->json(['uzenet' => 'Sikeresen törölve lett a support jegy!'], 200, options: JSON_UNESCAPED_UNICODE);
        }
    }
}
