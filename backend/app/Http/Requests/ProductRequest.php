<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductRequest extends FormRequest
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
            'price' => ['required', 'numeric', 'min:0'],
            'compare_price' => ['nullable', 'numeric', 'min:0'],
            'images' => ['required', 'array'],
            'images.*' => ['string'],
            'category' => ['required', 'string'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['string'],
            'status' => ['required', 'in:active,inactive,draft'],
            'inventory' => ['required', 'array'],
            'inventory.quantity' => ['required', 'integer', 'min:0'],
            'inventory.trackQuantity' => ['required', 'boolean'],
            'inventory.allowBackorder' => ['required', 'boolean'],
            'seo' => ['nullable', 'array'],
            'seo.title' => ['nullable', 'string'],
            'seo.description' => ['nullable', 'string'],
        ];
    }
}
