<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MfaVerifyRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'mfa_token' => 'required|string',
            'code' => 'required|string|min:6|max:8',
            'is_backup_code' => 'boolean',
        ];
    }

    public function messages()
    {
        return [
            'mfa_token.required' => 'Token MFA requis',
            'code.required' => 'Code de vérification requis',
            'code.min' => 'Le code doit contenir au moins 6 caractères',
            'code.max' => 'Le code ne peut pas dépasser 8 caractères',
        ];
    }
}
