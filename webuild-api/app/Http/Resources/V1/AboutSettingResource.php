<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AboutSettingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'companyName' => $this->company_name,
            'tagline'     => $this->tagline,
            'description' => $this->description,
            'mission'     => $this->mission,
            'vision'      => $this->vision,
            'founded'     => $this->founded,
            'employees'   => $this->employees,
            'clients'     => $this->clients,
            'awards'      => $this->awards,
            'heroImage'   => $this->hero_image,
            'teamImage'   => $this->team_image,
            'phone'       => $this->phone,
            'email'       => $this->email,
            'address'     => $this->address,
            'facebook'    => $this->facebook,
            'twitter'     => $this->twitter,
            'instagram'   => $this->instagram,
            'linkedin'    => $this->linkedin,
        ];
    }
}
