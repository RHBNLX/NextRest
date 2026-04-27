<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\CourierController;
use App\Http\Controllers\OrderStatusHistoryController;
use App\Http\Controllers\SupportTicketController;
use App\Http\Controllers\ChatMessageController;

Route::post('/login', [UserController::class, 'login']);
Route::post('/users', [UserController::class, 'store']); 

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    
    Route::get('/orders/user/{id}', [OrderController::class, 'getUserOrders']);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::put('/orders/{id}', [OrderController::class, 'update']);
    Route::delete('/orders/{id}', [OrderController::class, 'destroy']);
    
    Route::post('/support_tickets', [SupportTicketController::class, 'store']);
    Route::get('/user/tickets', [SupportTicketController::class, 'getUserTickets']);
    
    Route::get('/chat', [ChatMessageController::class, 'index']);
    Route::post('/chat', [ChatMessageController::class, 'store']);
});

Route::middleware(['auth:sanctum', 'role:admin,courier'])->group(function () {
    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/couriers', [CourierController::class, 'index']);
});

Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::get('/users', [UserController::class, 'index']);
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);
    
    Route::post('/couriers', [CourierController::class, 'store']);
    Route::put('/couriers/{id}', [CourierController::class, 'update']);
    Route::delete('/couriers/{id}', [CourierController::class, 'destroy']);
    
    Route::get('/support_tickets', [SupportTicketController::class, 'index']);
    Route::put('/support_tickets/{id}', [SupportTicketController::class, 'update']);
    Route::delete('/support_tickets/{id}', [SupportTicketController::class, 'destroy']);
    
    Route::get('/order_status_histories', [OrderStatusHistoryController::class, 'index']);
    Route::post('/order_status_histories', [OrderStatusHistoryController::class, 'store']);
    Route::put('/order_status_histories/{id}', [OrderStatusHistoryController::class, 'update']);
    Route::delete('/order_status_histories/{id}', [OrderStatusHistoryController::class, 'destroy']);
});