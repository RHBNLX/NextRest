<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\ChatMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ChatMessageController extends Controller
{
    // Üzenetek listázása egy adott ticket-hez
    public function index(Request $request)
    {
        $request->validate([
            'support_ticket_id' => 'required|exists:support_tickets,id'
        ]);

        $messages = ChatMessage::with('user:id,name,avatar_url')
            ->where('support_ticket_id', $request->support_ticket_id)
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json($messages);
    }

    // Új üzenet mentése
    public function store(Request $request)
    {
        $validated = $request->validate([
            'support_ticket_id' => 'required|exists:support_tickets,id',
            'message' => 'required|string|max:1000',
        ]);

        $chatMessage = ChatMessage::create([
            'user_id' => Auth::id(), // A bejelentkezett felhasználó ID-ja
            'support_ticket_id' => $validated['support_ticket_id'],
            'message' => $validated['message'],
        ]);

        // Betöltjük a felhasználót is a válaszhoz, hogy a frontend rögtön meg tudja jeleníteni
        return response()->json($chatMessage->load('user:id,name,avatar_url'), 201);
    }
}