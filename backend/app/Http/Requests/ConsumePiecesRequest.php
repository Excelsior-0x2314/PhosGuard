<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ConsumePiecesRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'pieces' => ['required', 'array', 'min:1'],
            'pieces.*.piece_id' => ['required', 'integer', 'exists:piece_rechanges,id'],
            'pieces.*.quantite' => ['required', 'integer', 'min:1'],
        ];
    }
}