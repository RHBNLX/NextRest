<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Courier;
use App\Enums\CourierStatus;
use App\Enums\VehicleType;

class CourierController extends Controller
{
    public function index()
    {
        $couriers = Courier::with('user')->get();
        return response()->json($couriers, 200, options: JSON_UNESCAPED_UNICODE);
    }

    public function store(Request $request)
    {
        $validVehicleTypes = array_map(fn($case) => $case->value, VehicleType::cases());
        $validStatuses = array_map(fn($case) => $case->value, CourierStatus::cases());

        $request->validate([
            'user_id' => 'required|exists:users,id',
            'status' => ['required', 'in:' . implode(',', $validStatuses)],
            'vehicle_type' => ['required', 'in:' . implode(',', $validVehicleTypes)],
            'license_plate' => 'nullable|string|max:255',
        ], [
            "required" => "A(z) :attribute mező kötelező.",
            "string" => "A :attribute mezőnek szöveges értéknek kell lennie.",
            "in" => "A :attribute mezőnek érvényes értéknek kell lennie.",
            "max" => "A :attribute mező nem lehet hosszabb, mint :max karakter.",
            "exists" => "A megadott :attribute idegen kulcsnak léteznie kell.",
        ], [
            "user_id" => "felhasználó",
            "status" => "állapot",
            "vehicle_type" => "jármű típusa",
            "license_plate" => "rendszám"
        ]);

        Courier::create([
            'user_id' => $request->user_id,
            'status' => $request->status,
            'vehicle_type' => $request->vehicle_type,
            'license_plate' => $request->license_plate,
        ]);
        return response()->json(['uzenet' => 'Sikeres futár lett a rendszerhez adva!'], 201, options: JSON_UNESCAPED_UNICODE);
    }

    public function update(Request $request, string $id)
    {
        $courier = Courier::find($id);

        if (!$courier) {
            return response()->json(['uzenet' => 'Nincs ilyen azonosítóval futár!'], 404, options: JSON_UNESCAPED_UNICODE);
        }

        $validStatuses = array_map(fn($case) => $case->value, CourierStatus::cases());

        $request->validate([
            'status' => ['sometimes', 'in:' . implode(',', $validStatuses)],
            'vehicle_type' => ['sometimes', 'in:car,bike,scooter,van'],
            'license_plate' => 'sometimes|string|max:255',
        ], [
            "in" => "A :attribute mezőnek érvényes értéknek kell lennie.",
            "string" => "A :attribute mezőnek szövegesnek kell lennie.",
            "max" => "A :attribute mező nem lehet hosszabb, mint :max karakter.",
        ]);

        $courier->update($request->only(['status', 'vehicle_type', 'license_plate']));

        return response()->json([
            'uzenet' => 'Futár sikeresen frissítve!',
            'courier' => $courier
        ], 200, options: JSON_UNESCAPED_UNICODE);
    }

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
