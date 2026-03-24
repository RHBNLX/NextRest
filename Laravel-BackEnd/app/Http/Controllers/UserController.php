<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    public function login(Request $request)
    {
        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Hibás adatok'], 401);
        }
        if (!method_exists($user, 'createToken')) {
            return response()->json(['message' => 'Sanctum nincs beállítva a User modellben!'], 500);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ]);
    }
    public function index()
    {
        $users = User::all();
        return response()->json($users, 200, options: JSON_UNESCAPED_UNICODE);
    }
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'phone_number' => 'required|string|max:255',
            'role' => 'required|string|max:255',
            'avatar_url' => 'nullable|string|max:255'
        ], [
            "required" => "A(z) :attribute mező kötelező.",
            "string" => "A :attribute mezőnek szöveges értéknek kell lennie.",
            "max" => "A :attribute mező nem lehet hosszabb, mint :max karakter.",
            "email" => "A :attribute mezőnek érvényes email címnek kell lennie.",
            "unique" => "A megadott :attribute már létezik.",
            "min" => "A :attribute mezőnek legalább :min karakter hosszúnak kell lennie.",
            "nullable" => "A :attribute mező lehet üres."
        ], [
            "name" => "név",
            "email" => "email cím",
            "password" => "jelszó",
            "phone_number" => "telefonszám",
            "role" => "szerep",
            "avatar_url" => "avatar URL"
        ]);

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'phone_number' => $request->phone_number,
            'role' => $request->role,
            'avatar_url' => $request->avatar_url
        ]);
        return response()->json(['uzenet' => 'Sikeres felhasználó létrehozás!'], 201, options: JSON_UNESCAPED_UNICODE);
    }

    public function update(Request $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'Felhasználó nem található'], 404);
        }
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'phone_number' => 'nullable|string|max:20',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validációs hiba',
                'errors' => $validator->errors()
            ], 422);
        }
        $user->name = $request->name;
        $user->phone_number = $request->phone_number;
        $user->save();
        return response()->json([
            'message' => 'Profil sikeresen frissítve!',
            'user' => $user
        ], 200);
    }
    public function destroy(string $id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['uzenet' => 'Nincs ilyen azonosítóval rendelkező felhasználó!'], 404, options: JSON_UNESCAPED_UNICODE);
        }
        $user->delete();
        return response()->json(['uzenet' => 'Sikeres felhasználó törlés!'], 200, options: JSON_UNESCAPED_UNICODE);
    }
}
