<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SliderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'         => (string) $this->id,
            'title'      => $this->title,
            'subtitle'   => $this->subtitle,
            'image'      => $this->image,
            'buttonText' => $this->button_text,
            'buttonLink' => $this->button_link,
            'order'      => $this->sort_order,
            'visible'    => (bool) $this->visible,
        ];
    }
}
