<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Support_Ticket;

class Support_TicketController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $support_tickets = Support_Ticket::all();
        return response()->json($support_tickets, 200, options: JSON_UNESCAPED_UNICODE);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // 1. Validáció javítása
        $request->validate([
            'user_id' => 'nullable|integer|exists:users,id', // Lehet null, ha nem bejelentkezett ír
            'order_id' => 'nullable|integer|exists:orders,id', // Lehet null, ha általános a panasz
            'subject' => 'required|string|max:255',
            'message' => 'required|string', // 'text' helyett 'string'!
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

        // 2. Mentés (Mass Assignment használatával egyszerűbb)
        Support_Ticket::create($request->all());

        return response()->json(['uzenet' => 'Sikeres support jegy létrehozás!'], 201, [], JSON_UNESCAPED_UNICODE);
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
        $support_ticket = Support_Ticket::find($id);
        if (!$support_ticket) {
            return response()->json(['uzenet' => 'Nincs ilyen azonosítóval rendelkező support jegy!'], 404, options: JSON_UNESCAPED_UNICODE);
        } else {
            $support_ticket->delete();
            return response()->json(['uzenet' => 'Sikeresen törölve lett a support jegy!'], 200, options: JSON_UNESCAPED_UNICODE);
        }
    }
}
