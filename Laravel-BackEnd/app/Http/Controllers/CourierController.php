<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Courier;

class CourierController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $couriers = Courier::all();
        return response()->json($couriers, 200, options: JSON_UNESCAPED_UNICODE);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'status' => 'required|string|max:255',
            'rating' => 'required|decimal:1,1|between:1,5', //itt kérdéses, hogy a megadott rating lesz-e a véglege vagy vagy majd 2 tizedes jegyre lesz kiszámolva a leadott értékelések alapján ezt Illiánnal még dumáld meg, hogy milyen legyen a rating mező pontosan
            'vehicle_type' => 'required|string|max:255'
        ], [
            "required" => "A(z) :attribute mező kötelező.",
            "string" => "A :attribute mezőnek szöveges értéknek kell lennie.",
            "between" => "A :attribute mezőnek :min és :max között kell lennie.",
            "max" => "A :attribute mező nem lehet hosszabb, mint :max karakter.",
            "exists" => "A megadott :attribute idegen kulcsnak léteznie kell.",
            "decimal" => "A :attribute mezőnek egy tizedesjegy pontosságú számnak kell lennie."
        ], [
            "user_id" => "felhasználó",
            "status" => "állapot",
            "rating" => "értékelés",
            "vehicle_type" => "jármű típusa"
        ]);

        Courier::create([
            'user_id' => $request->user_id,
            'status' => $request->status,
            'rating' => $request->rating,
            'vehicle_type' => $request->vehicle_type
        ]);
        return response()->json(['uzenet' => 'Sikeres futár lett a rendszerhez adva!'], 201, options: JSON_UNESCAPED_UNICODE);
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
        $courier = Courier::find($id);
        if (!$courier) {
            return response()->json(['uzenet' => 'Nincs ilyen azonosítóval futár!'], 404, options: JSON_UNESCAPED_UNICODE);
        } else {
            $courier->delete();
            return response()->json(['uzenet' => 'A futár sikeresen törölve lett a rendszerből!'], 200, options: JSON_UNESCAPED_UNICODE);
        }
    }
}
