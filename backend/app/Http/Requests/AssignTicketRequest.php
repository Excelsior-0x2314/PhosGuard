<?php

namespace App\Http\Requests;

use App\Enums\UserRole;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class AssignTicketRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'technicien_id' => ['required', 'integer', 'exists:users,id'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            $technicienId = $this->input('technicien_id');

            if ($technicienId && \App\Models\User::find($technicienId)?->role !== UserRole::Technicien) {
                $validator->errors()->add('technicien_id', 'L\'utilisateur sélectionné doit avoir le rôle technicien.');
            }
        });
    }
}