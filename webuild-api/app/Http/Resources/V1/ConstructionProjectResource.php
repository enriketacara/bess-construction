<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ConstructionProjectResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'          => (string) $this->id,
            'title'       => $this->title,
            'description' => $this->description,
            'images'      => $this->images ?? [],
            'category'    => $this->category,
            'location'    => $this->location,
            'startDate'   => optional($this->start_date)->toDateString(),
            'endDate'     => optional($this->end_date)->toDateString(),
            'status'      => $this->status,
            'link'        => $this->public_link,
            'services'    => $this->services ?? [],
            'createdAt'   => optional($this->created_at)->toISOString(),
            'updatedAt'   => optional($this->updated_at)->toISOString(),
        ];
    }
}
