<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\CourierController;
use App\Http\Controllers\OrderStatusHistoryController;
use App\Http\Controllers\SupportTicketController;
use App\Http\Controllers\ChatMessageController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/login', [UserController::class, 'login']);

Route::get('/users', [UserController::class, 'index']);
Route::post('/users', [UserController::class, 'store']);
Route::delete('/users/{id}', [UserController::class, 'destroy']);
Route::put('/users/{id}', [UserController::class, 'update']);

Route::get('/orders', [OrderController::class, 'index']);

Route::middleware('auth:sanctum')->get('/orders/user/{id}', [OrderController::class, 'getUserOrders']);
Route::post('/orders', [OrderController::class, 'store']);
Route::delete('/orders/{id}', [OrderController::class, 'destroy']);
Route::put('/orders/{id}', [OrderController::class, 'update']);

Route::get('/couriers', [CourierController::class, 'index']);
Route::post('/couriers', [CourierController::class, 'store']);
Route::delete('/couriers/{id}', [CourierController::class, 'destroy']);
Route::put('/couriers/{id}', [CourierController::class, 'update']);

Route::get('/order_status_histories', [OrderStatusHistoryController::class, 'index']);
Route::post('/order_status_histories', [OrderStatusHistoryController::class, 'store']);
Route::delete('/order_status_histories/{id}', [OrderStatusHistoryController::class, 'destroy']);
Route::put('/order_status_histories/{id}', [OrderStatusHistoryController::class, 'update']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user/tickets', [SupportTicketController::class, 'getUserTickets']);
});
Route::get('/support_tickets', [SupportTicketController::class, 'index']);
Route::post('/support_tickets', [SupportTicketController::class, 'store']);
Route::delete('/support_tickets/{id}', [SupportTicketController::class, 'destroy']);
Route::put('/support_tickets/{id}', [SupportTicketController::class, 'update']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/chat', [ChatMessageController::class, 'index']);
    Route::post('/chat', [ChatMessageController::class, 'store']);
});