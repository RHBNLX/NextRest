<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId("user_id")->constrained("users", "id")->cascade();
            $table->foreignId("courier_id")->constrained("users", "id")->cascade()->nullable();
            $table->string("pickup_address");
            $table->string("dropoff_address");
            $table->string("package_status");
            $table->text("notes")->nullable();
            $table->integer("price");
            $table->string("status");
            //$table->dateTime("pickup_time")->nullable(); ha esetleg kellene???
            //table->dateTime("delivery_time")->nullable(); ha esetleg kellene???
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
