<?php

namespace App\Http\Requests\V1;

use Illuminate\Foundation\Http\FormRequest;

class StoreConstructionProjectRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'title'       => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'images'      => ['nullable', 'array'],
            'images.*'    => ['string', 'max:1000'],
            'category'    => ['nullable', 'string', 'max:100'],
            'location'    => ['nullable', 'string', 'max:255'],
            'startDate'   => ['nullable', 'date'],
            'endDate'     => ['nullable', 'date', 'after_or_equal:startDate'],
            'status'      => ['nullable', 'in:ongoing,completed,on-hold'],
            'link'        => ['nullable', 'string', 'max:500'],
            'services'    => ['nullable', 'array'],
            'services.*'  => ['string', 'max:255'],
        ];
    }
}
