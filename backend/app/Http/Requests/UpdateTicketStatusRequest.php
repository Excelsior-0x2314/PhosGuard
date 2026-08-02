<?php

namespace App\Http\Requests;

use App\Enums\TicketStatut;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class UpdateTicketStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'statut' => ['required', new Enum(TicketStatut::class)],
        ];
    }
}