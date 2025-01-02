<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('gardeners', function (Blueprint $table) {
            $table->id();
            $table->string('last_name');
            $table->string('first_name');
            $table->string('middle_name')->nullable();
            $table->string('residence_address');
            $table->string('mailing_address')->nullable();
            $table->boolean('is_member')->default(false);
            $table->date('membership_start_date')->nullable();
            $table->date('membership_end_date')->nullable();
            $table->boolean('archived')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('gardeners');
    }
};
