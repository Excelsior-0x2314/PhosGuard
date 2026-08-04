<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePieceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nom' => ['sometimes', 'string', 'max:255'],
            'reference' => ['sometimes', 'string', 'max:255', Rule::unique('piece_rechanges', 'reference')->ignore($this->route('piece'))],
            'localisation' => ['sometimes', 'string', 'max:255'],
            'seuil_minimum' => ['sometimes', 'integer', 'min:0'],
        ];
    }
}