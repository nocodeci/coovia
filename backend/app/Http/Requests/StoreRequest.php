<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

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
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $storeId = $this->route('store') ?? $this->route('id');

        return [
            'name' => 'required|string|max:255',
            'description' => 'required|string|max:1000',
            'category' => 'required|string|max:100',
            'logo' => 'nullable|url|max:500',
            'banner' => 'nullable|url|max:500',
            'contact' => 'nullable|array',
            'contact.email' => 'nullable|email|max:255',
            'contact.phone' => 'nullable|string|max:20',
            'contact.website' => 'nullable|url|max:255',
            'address' => 'nullable|array',
            'address.street' => 'nullable|string|max:255',
            'address.city' => 'nullable|string|max:100',
            'address.state' => 'nullable|string|max:100',
            'address.country' => 'nullable|string|max:100',
            'address.postal_code' => 'nullable|string|max:20',
            'settings' => 'nullable|array',
            'settings.currency' => 'nullable|string|max:10',
            'settings.language' => 'nullable|string|max:10',
            'settings.timezone' => 'nullable|string|max:50',
            'settings.tax_rate' => 'nullable|numeric|min:0|max:100'
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Le nom de la boutique est obligatoire.',
            'name.max' => 'Le nom de la boutique ne peut pas dépasser 255 caractères.',
            'description.required' => 'La description est obligatoire.',
            'description.max' => 'La description ne peut pas dépasser 1000 caractères.',
            'category.required' => 'La catégorie est obligatoire.',
            'contact.email.email' => 'L\'adresse email doit être valide.',
            'contact.website.url' => 'Le site web doit être une URL valide.',
            'logo.url' => 'Le logo doit être une URL valide.',
            'banner.url' => 'La bannière doit être une URL valide.',
        ];
    }
}
