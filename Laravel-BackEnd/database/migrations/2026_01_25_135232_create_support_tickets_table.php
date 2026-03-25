<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('support_tickets', function (Blueprint $table) {
            $table->id();
            $table->foreignId("user_id")->constrained("users", "id")->cascadeOnDelete();
            $table->foreignId("order_id")->constrained("orders", "id")->cascadeOnDelete()->optional();
            $table->string("subject");
            $table->text("message");
            $table->string("status");
            $table->timestamps();
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('support_tickets');
    }
};
