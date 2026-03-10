<?php

namespace App\Http\Requests\V1;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSliderRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'title'      => ['sometimes', 'required', 'string', 'max:255'],
            'subtitle'   => ['sometimes', 'nullable', 'string', 'max:255'],
            'image'      => ['sometimes', 'required', 'string', 'max:1000'],
            'buttonText' => ['sometimes', 'nullable', 'string', 'max:80'],
            'buttonLink' => ['sometimes', 'nullable', 'string', 'max:500'],
            'visible'    => ['sometimes', 'nullable', 'boolean'],
            'order'      => ['sometimes', 'nullable', 'integer', 'min:1'],
        ];
    }
}
