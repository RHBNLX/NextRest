<?php

namespace App\Http\Controllers;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
public function login(Request $request)
{
    $request->validate([
        'email' => 'required|email',
        'password' => 'required',
        'mgmt_code' => 'nullable|string'
    ]);

    $user = User::where('email', $request->email)->first();

    if (!$user || !Hash::check($request->password, $user->password)) {
        return response()->json(['message' => 'Hibás adatok'], 401);
    }
    $providedCode = trim($request->mgmt_code ?? '');

    if (!empty($providedCode)) {
        $secret = env('mgmtCode');

        if ($providedCode !== $secret) {
            return response()->json(['message' => 'Érvénytelen menedzsment kód!'], 403);
        }

        $roleValue = $user->role instanceof \App\Enums\UserRole 
            ? $user->role->value 
            : $user->role;

        if (strtolower($roleValue) !== 'admin') {
            return response()->json(['message' => 'Nincs jogosultságod az admin belépéshez!'], 403);
        }
    }

    $token = $user->createToken('auth_token')->plainTextToken;

    return response()->json([
        'access_token' => $token,
        'user' => $user
    ], 200, [], JSON_UNESCAPED_UNICODE);
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
            'phone_number' => [
                'required',
                'string',
                'unique:users',
                'regex:/^(\+36|06|0036)(20|30|31|50|70)\d{7}$/'
            ],
            'role' => 'required|string|max:255',
            'avatar_url' => 'nullable|string|max:255'
        ], [
            "required" => "A(z) :attribute mező kötelező.",
            "string" => "A :attribute mezőnek szöveges értéknek kell lennie.",
            "max" => "A :attribute mező nem lehet hosszabb, mint :max karakter.",
            "email" => "A :attribute mezőnek érvényes email címnek kell lennie.",
            "unique" => "A megadott :attribute már létezik.",
            "regex" => "A :attribute mező formátuma érvénytelen.",
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

        $validated = $request->validate([
            'role' => ['required', 'in:customer'],
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
        'name' => 'sometimes|string|max:255',
        'email' => 'sometimes|email|unique:users,email,' . $user->id,
        'phone_number' => [
            'sometimes',
            'string',
            'unique:users,phone_number,' . $user->id,
            'regex:/^(\+36|06|0036)(20|30|31|50|70)\d{7}$/'
        ],
        'avatar_url' => 'sometimes|nullable|string',
        'status' => 'sometimes|string', 
        'role' => ['sometimes', \Illuminate\Validation\Rule::enum(\App\Enums\UserRole::class)], // DINAMIKUS VALIDÁCIÓ
    ], [
        'unique' => 'A megadott :attribute már használatban van.',
        'regex' => 'A telefonszám formátuma érvénytelen.',
        'email' => 'Érvénytelen email cím.',
        'Illuminate\Validation\Rules\Enum' => 'A szerepkör mező értéke érvénytelen.',
    ]);

    if ($validator->fails()) {
        return response()->json([
            'message' => 'Validációs hiba',
            'errors' => $validator->errors()
        ], 422);
    }

    if ($request->has('email') && $request->has('phone_number')) {
        if ($request->email !== $user->email && $request->phone_number !== $user->phone_number) {
            return response()->json(['message' => 'Biztonsági okokból az email és telefonszám nem módosítható egyszerre!'], 400);
        }
    }

    if ($request->has('phone_number') && $request->phone_number !== $user->phone_number) {
        if ($user->phone_changed_at && Carbon::parse($user->phone_changed_at)->addDays(30)->isFuture()) {
            $hatra_van = Carbon::now()->diffInDays(Carbon::parse($user->phone_changed_at)->addDays(30));
            return response()->json(['message' => "Telefonszámot legközelebb $hatra_van nap múlva módosíthat!"], 403);
        }
        $user->phone_changed_at = now();
        $user->phone_number = $request->phone_number;
    }

    if ($request->has('name')) $user->name = $request->name;
    if ($request->has('email')) $user->email = $request->email;
    if ($request->has('avatar_url')) $user->avatar_url = $request->avatar_url;
    if ($request->has('status')) $user->status = $request->status;
    if ($request->has('role')) $user->role = $request->role;

    $user->save();

    return response()->json([
        'message' => 'Profil sikeresen frissítve!',
        'user' => $user->load('orders') 
    ], 200, [], JSON_UNESCAPED_UNICODE);
}
    public function destroy($id)
{
    try {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'Felhasználó nem található!'], 404);
        }

        $user->delete();

        return response()->json(['message' => 'Sikeres törlés!'], 200);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'A felhasználó nem törölhető, mert kapcsolódó adatok (pl. rendelések) tartoznak hozzá!',
            'error' => $e->getMessage()
        ], 409); 
    }
}
    public function getUserOrders($id)
    {
        if (Auth::id() !== (int) $id) {
            return response()->json([
                'message' => 'Nincs jogosultság az adatok lekéréséhez.'
            ], 403);
        }

        $orders = Order::where('user_id', $id)->get();

        return response()->json($orders, 200, options: JSON_UNESCAPED_UNICODE);
    }
}
