<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId("user_id")->constrained("users", "id")->cascadeOnDelete();
            $table->foreignId("courier_id")->constrained("couriers", "id")->cascadeOnDelete();
            $table->string("pickup_address");
            $table->string("dropoff_address");
            $table->string("package_size");
            $table->text("notes")->nullable();
            $table->integer("price");
            $table->string("status");
            $table->timestamps();
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
