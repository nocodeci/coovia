<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MfaSetupRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'code' => 'required|string|size:6',
        ];
    }

    public function messages()
    {
        return [
            'code.required' => 'Code de vérification requis',
            'code.size' => 'Le code doit contenir exactement 6 chiffres',
        ];
    }
}
