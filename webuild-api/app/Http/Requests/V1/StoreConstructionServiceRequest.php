<?php

namespace App\Http\Requests\V1;

use Illuminate\Foundation\Http\FormRequest;

class StoreConstructionServiceRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'title'       => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'image'       => ['nullable', 'string', 'max:1000'],
            'price'       => ['nullable', 'string', 'max:100'],
            'features'    => ['nullable', 'array'],
            'features.*'  => ['string', 'max:255'],
            'status'      => ['nullable', 'in:active,inactive'],
        ];
    }
}
