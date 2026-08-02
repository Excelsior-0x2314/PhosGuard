<?php

use App\Enums\TicketPriorite;
use App\Enums\TicketStatut;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tickets', function (Blueprint $table) {
            $table->id();
            $table->string('titre');
            $table->text('description');
            $table->foreignId('equipement_id')->constrained()->cascadeOnDelete();
            $table->foreignId('technicien_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('created_by')->constrained('users')->cascadeOnDelete();
            $table->string('statut')->default(TicketStatut::Ouvert->value);
            $table->string('priorite')->default(TicketPriorite::Moyenne->value);
            $table->timestamp('date_prise_en_charge')->nullable();
            $table->timestamp('date_resolution')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tickets');
    }
};