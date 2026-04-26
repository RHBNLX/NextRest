<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('couriers', function (Blueprint $table) {
            $table->id();
            $table->foreignId("user_id")->constrained("users", "id")->cascade();
            $table->string("vehicle_type");
            $table->string("license_plate");
            $table->string("status");
            $table->timestamps();
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('couriers');
    }
};
