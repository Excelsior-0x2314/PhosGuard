<?php

namespace App\Http\Requests;

use App\Enums\EquipementStatut;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class StoreEquipementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nom' => ['required', 'string', 'max:255'],
            'reference' => ['required', 'string', 'max:255', 'unique:equipements,reference'],
            'localisation' => ['required', 'string', 'max:255'],
            'statut' => ['sometimes', new Enum(EquipementStatut::class)],
        ];
    }
}