<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('gardeners', function (Blueprint $table) {
            $table->string('registration_address')->after('middle_name');
            $table->string('residence_address')->nullable()->change();
            $table->string('gender')->after('membership_end_date');
        });
    }
};
