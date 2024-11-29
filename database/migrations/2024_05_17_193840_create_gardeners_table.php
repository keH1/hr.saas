<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('gardeners', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users');
            $table->string('last_name');
            $table->string('first_name');
            $table->string('middle_name')->nullable();
            $table->string('real_address');
            $table->string('mailing_address')->nullable();
            $table->boolean('is_member')->default(false);
            $table->timestamps();


        });
    }

    public function down(): void
    {
        Schema::dropIfExists('gardeners');
    }
};
