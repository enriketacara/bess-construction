<?php

namespace App\Http\Requests\V1;

use Illuminate\Foundation\Http\FormRequest;

class UpdateConstructionServiceRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'title'       => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['sometimes', 'nullable', 'string'],
            'image'       => ['sometimes', 'nullable', 'string', 'max:1000'],
            'price'       => ['sometimes', 'nullable', 'string', 'max:100'],
            'features'    => ['sometimes', 'nullable', 'array'],
            'features.*'  => ['string', 'max:255'],
            'status'      => ['sometimes', 'nullable', 'in:active,inactive'],
        ];
    }
}
