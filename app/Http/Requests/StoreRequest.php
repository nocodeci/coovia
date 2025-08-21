<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Contracts\Validation\Validator;

class StoreRequest extends FormRequest
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
     */
    public function rules(): array
    {
        $storeId = $this->route('store') ? $this->route('store')->id : null;

        return [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'category' => 'nullable|string|max:100',
            'address' => 'nullable|array',
            'address.street' => 'nullable|string|max:255',
            'address.city' => 'nullable|string|max:100',
            'address.country' => 'nullable|string|max:100',
            'address.postal_code' => 'nullable|string|max:20',
            'contact' => 'nullable|array',
            'contact.phone' => 'nullable|string|max:20',
            'contact.email' => 'nullable|email|max:255',
            'contact.whatsapp' => 'nullable|string|max:20',
            'settings' => 'nullable|array',
            'settings.currency' => 'nullable|string|max:10',
            'settings.language' => 'nullable|string|max:10',
            'settings.timezone' => 'nullable|string|max:50',
            'settings.tax_rate' => 'nullable|numeric|min:0|max:100',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Le nom de la boutique est obligatoire.',
            'name.string' => 'Le nom doit être une chaîne de caractères.',
            'name.max' => 'Le nom ne peut pas dépasser 255 caractères.',

            'description.string' => 'La description doit être une chaîne de caractères.',
            'description.max' => 'La description ne peut pas dépasser 1000 caractères.',

            'category.string' => 'La catégorie doit être une chaîne de caractères.',
            'category.max' => 'La catégorie ne peut pas dépasser 100 caractères.',

            'address.array' => 'L\'adresse doit être un objet.',
            'contact.array' => 'Les informations de contact doivent être un objet.',
            'settings.array' => 'Les paramètres doivent être un objet.',

            'contact.email.email' => 'L\'email de contact doit être une adresse email valide.',
            'settings.tax_rate.numeric' => 'Le taux de taxe doit être un nombre.',
            'settings.tax_rate.min' => 'Le taux de taxe ne peut pas être négatif.',
            'settings.tax_rate.max' => 'Le taux de taxe ne peut pas dépasser 100%.',
        ];
    }

    /**
     * Handle a failed validation attempt.
     */
    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(
            response()->json([
                'success' => false,
                'message' => 'Erreurs de validation',
                'errors' => $validator->errors(),
                'data' => null
            ], 422)
        );
    }
}
