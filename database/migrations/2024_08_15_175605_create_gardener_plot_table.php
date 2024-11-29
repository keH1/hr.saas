<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('gardener_plot', function (Blueprint $table) {
            $table->id();
            $table->foreignId('gardener_id')->constrained('gardeners')->onDelete('cascade');
            $table->foreignId('plot_id')->constrained('plots')->onDelete('cascade');
            $table->decimal('ownership_percentage', 1,3);
            $table->float('debt');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('gardener_plot');
    }
};
