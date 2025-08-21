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
        $rules = [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['sometimes', 'required', 'string'],
            'price' => ['sometimes', 'required', 'numeric', 'min:0'],
            'compare_price' => ['nullable', 'numeric', 'min:0'],
            'sale_price' => ['nullable', 'numeric', 'min:0'],
            'sku' => ['nullable', 'string', 'max:255'],
            'stock_quantity' => ['nullable', 'integer', 'min:0'],
            'min_stock_level' => ['nullable', 'integer', 'min:0'],
            'images' => ['nullable', 'array'],
            'images.*' => ['nullable'],
            'files' => ['nullable', 'array'],
            'files.*' => ['nullable'],
            'category' => ['sometimes', 'required', 'string'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['string'],
            'status' => ['sometimes', 'required', 'in:active,inactive,draft,archived'],
            'inventory' => ['nullable', 'array'],
            'attributes' => ['nullable', 'array'],
            'seo' => ['nullable', 'array'],
        ];

        // Si c'est une création (POST), rendre certains champs obligatoires
        if ($this->isMethod('POST')) {
            $rules['name'] = ['required', 'string', 'max:255'];
            $rules['description'] = ['required', 'string'];
            $rules['price'] = ['required', 'numeric', 'min:0'];
            $rules['category'] = ['required', 'string'];
            $rules['status'] = ['required', 'in:active,inactive,draft,archived'];
        }

        return $rules;
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            // Valider les images
            if ($this->has('images') && is_array($this->input('images'))) {
                foreach ($this->input('images') as $index => $image) {
                    if ($image !== null && !is_string($image) && !is_array($image)) {
                        $validator->errors()->add("images.{$index}", 'L\'image doit être une chaîne ou un objet média.');
                    }
                }
            }

            // Valider les fichiers
            if ($this->has('files') && is_array($this->input('files'))) {
                foreach ($this->input('files') as $index => $file) {
                    if ($file !== null && !is_string($file) && !is_array($file)) {
                        $validator->errors()->add("files.{$index}", 'Le fichier doit être une chaîne ou un objet média.');
                    }
                }
            }
        });
    }
}
