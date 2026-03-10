<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ConstructionServiceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'          => (string) $this->id,
            'title'       => $this->title,
            'description' => $this->description,
            'image'       => $this->image,
            'price'       => $this->price,
            'features'    => $this->features ?? [],
            'status'      => $this->status,
            'createdAt'   => optional($this->created_at)->toISOString(),
            'updatedAt'   => optional($this->updated_at)->toISOString(),
        ];
    }
}
