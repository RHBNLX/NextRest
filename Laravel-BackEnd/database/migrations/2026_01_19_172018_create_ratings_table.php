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
        Schema::create('ratings', function (Blueprint $table) {
            $table->id();
            $table->foreignId("order_id")->constrained("orders", "id")->cascadeOnDelete();
            $table->foreignId("courier_id")->constrained("users", "id")->cascadeOnDelete();
            $table->foreignId("customer_id")->constrained("users", "id")->cascadeOnDelete();
            $table->tinyInteger("rating"); // 1-től 5-ig
            $table->text("comment");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ratings');
    }
};
