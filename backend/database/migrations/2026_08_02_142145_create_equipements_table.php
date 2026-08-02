<?php

use App\Enums\EquipementStatut;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('equipements', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->string('reference')->unique();
            $table->string('localisation');
            $table->string('statut')->default(EquipementStatut::Fonctionnel->value);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('equipements');
    }
};