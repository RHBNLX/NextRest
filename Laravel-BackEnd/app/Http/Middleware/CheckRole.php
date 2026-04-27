<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        // If user is not authenticated
        if (!$request->user()) {
            return response()->json(['message' => 'Hozzáférés megtagadva: Nincs bejelentkezve.'], 403);
        }

        $userRole = $request->user()->role;
        if ($userRole instanceof \BackedEnum) {
            $userRole = $userRole->value;
        }

        // Check if user's role is in the allowed roles
        if (!in_array((string) $userRole, array_map('strval', $roles), true)) {
            return response()->json(['message' => 'Hozzáférés megtagadva: Nincs megfelelő jogosultság.'], 403);
        }

        return $next($request);
    }
}
