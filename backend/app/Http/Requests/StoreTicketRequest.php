<?php

namespace App\Http\Requests;

use App\Enums\TicketPriorite;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class StoreTicketRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'titre' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'equipement_id' => ['required', 'integer', 'exists:equipements,id'],
            'priorite' => ['sometimes', new Enum(TicketPriorite::class)],
        ];
    }
}