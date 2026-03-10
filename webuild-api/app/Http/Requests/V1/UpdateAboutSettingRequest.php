<?php

namespace App\Http\Requests\V1;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAboutSettingRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'companyName' => ['sometimes', 'nullable', 'string', 'max:255'],
            'tagline'     => ['sometimes', 'nullable', 'string', 'max:255'],
            'description' => ['sometimes', 'nullable', 'string'],
            'mission'     => ['sometimes', 'nullable', 'string'],
            'vision'      => ['sometimes', 'nullable', 'string'],
            'founded'     => ['sometimes', 'nullable', 'string', 'max:20'],
            'employees'   => ['sometimes', 'nullable', 'string', 'max:30'],
            'clients'     => ['sometimes', 'nullable', 'string', 'max:30'],
            'awards'      => ['sometimes', 'nullable', 'string', 'max:30'],
            'heroImage'   => ['sometimes', 'nullable', 'string', 'max:1000'],
            'teamImage'   => ['sometimes', 'nullable', 'string', 'max:1000'],
            'phone'       => ['sometimes', 'nullable', 'string', 'max:50'],
            'email'       => ['sometimes', 'nullable', 'email', 'max:100'],
            'address'     => ['sometimes', 'nullable', 'string', 'max:255'],
            'facebook'    => ['sometimes', 'nullable', 'string', 'max:500'],
            'twitter'     => ['sometimes', 'nullable', 'string', 'max:500'],
            'instagram'   => ['sometimes', 'nullable', 'string', 'max:500'],
            'linkedin'    => ['sometimes', 'nullable', 'string', 'max:500'],
        ];
    }
}
