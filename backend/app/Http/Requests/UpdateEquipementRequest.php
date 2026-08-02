<?php

namespace App\Http\Requests;

use App\Enums\EquipementStatut;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum;

class UpdateEquipementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nom' => ['sometimes', 'string', 'max:255'],
            'reference' => ['sometimes', 'string', 'max:255', Rule::unique('equipements', 'reference')->ignore($this->route('equipement'))],
            'localisation' => ['sometimes', 'string', 'max:255'],
            'statut' => ['sometimes', new Enum(EquipementStatut::class)],
        ];
    }
}