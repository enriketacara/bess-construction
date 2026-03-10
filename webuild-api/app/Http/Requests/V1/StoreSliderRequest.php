<?php

namespace App\Http\Requests\V1;

use Illuminate\Foundation\Http\FormRequest;

class StoreSliderRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'title'      => ['required', 'string', 'max:255'],
            'subtitle'   => ['nullable', 'string', 'max:255'],
            'image'      => ['required', 'string', 'max:1000'],
            'buttonText' => ['nullable', 'string', 'max:80'],
            'buttonLink' => ['nullable', 'string', 'max:500'],
            'visible'    => ['nullable', 'boolean'],
        ];
    }
}
