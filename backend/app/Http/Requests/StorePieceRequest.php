<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePieceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nom' => ['required', 'string', 'max:255'],
            'reference' => ['required', 'string', 'max:255', 'unique:piece_rechanges,reference'],
            'localisation' => ['required', 'string', 'max:255'],
            'quantite' => ['sometimes', 'integer', 'min:0'],
            'seuil_minimum' => ['sometimes', 'integer', 'min:0'],
        ];
    }
}