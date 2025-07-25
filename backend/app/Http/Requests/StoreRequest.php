<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'logo' => ['nullable', 'string'],
            'banner' => ['nullable', 'string'],
            'status' => ['required', 'in:active,inactive,pending'],
            'category' => ['required', 'string'],
            'address' => ['required', 'array'],
            'address.street' => ['required', 'string'],
            'address.city' => ['required', 'string'],
            'address.country' => ['required', 'string'],
            'address.postalCode' => ['required', 'string'],
            'contact' => ['required', 'array'],
            'contact.email' => ['required', 'email'],
            'contact.phone' => ['required', 'string'],
            'contact.website' => ['nullable', 'url'],
            'settings' => ['required', 'array'],
            'settings.currency' => ['required', 'string'],
            'settings.language' => ['required', 'string'],
            'settings.timezone' => ['required', 'string'],
            'settings.allowReviews' => ['required', 'boolean'],
            'settings.autoApproveReviews' => ['required', 'boolean'],
        ];
    }
}
