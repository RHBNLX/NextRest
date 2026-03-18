<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users  = User::all();
        return response()->json($users, 200, options: JSON_UNESCAPED_UNICODE);
    }

    /**
     * Store a newly created resource in storage.
     */
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
            'password' => $request-> password, //bcrypt($request->password)
            'phone_number' => $request->phone_number,
            'role' => $request->role,
            'avatar_url' => $request->avatar_url
        ]);
        return response()->json(['uzenet' => 'Sikeres felhasználó létrehozás!'], 201, options: JSON_UNESCAPED_UNICODE);
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
        $user = User::find($id);
        if (!$user) {
            return response()->json(['uzenet' => 'Nincs ilyen azonosítóval rendelkező felhasználó!'], 404, options: JSON_UNESCAPED_UNICODE);
        }
        $user->delete();
        return response()->json(['uzenet' => 'Sikeres felhasználó törlés!'], 200, options: JSON_UNESCAPED_UNICODE);
    }
}
