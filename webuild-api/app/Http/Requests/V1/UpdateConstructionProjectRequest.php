<?php

namespace App\Http\Requests\V1;

use Illuminate\Foundation\Http\FormRequest;

class UpdateConstructionProjectRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'title'       => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['sometimes', 'nullable', 'string'],
            'images'      => ['sometimes', 'nullable', 'array'],
            'images.*'    => ['string', 'max:1000'],
            'category'    => ['sometimes', 'nullable', 'string', 'max:100'],
            'location'    => ['sometimes', 'nullable', 'string', 'max:255'],
            'startDate'   => ['sometimes', 'nullable', 'date'],
            'endDate'     => ['sometimes', 'nullable', 'date'],
            'status'      => ['sometimes', 'nullable', 'in:ongoing,completed,on-hold'],
            'link'        => ['sometimes', 'nullable', 'string', 'max:500'],
            'services'    => ['sometimes', 'nullable', 'array'],
            'services.*'  => ['string', 'max:255'],
        ];
    }
}
