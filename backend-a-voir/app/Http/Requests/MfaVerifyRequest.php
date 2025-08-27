<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MfaVerifyRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'mfa_token' => ['required', 'string'],
            'code' => ['required', 'string', 'min:6', 'max:8'],
            'is_backup_code' => ['boolean'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'mfa_token.required' => 'Le token MFA est obligatoire.',
            'code.required' => 'Le code de vérification est obligatoire.',
            'code.min' => 'Le code doit contenir au moins 6 caractères.',
            'code.max' => 'Le code ne peut pas dépasser 8 caractères.',
        ];
    }
}
