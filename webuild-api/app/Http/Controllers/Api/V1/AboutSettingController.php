<?php

namespace App\Http\Controllers\Api\V1;

use App\Domain\Construction\Services\AboutSettingService;
use App\Http\Controllers\Controller;
use App\Http\Requests\V1\UpdateAboutSettingRequest;
use App\Http\Resources\V1\AboutSettingResource;

class AboutSettingController extends Controller
{
    public function __construct(private readonly AboutSettingService $service) {}

    public function show()
    {
        return new AboutSettingResource($this->service->get());
    }

    public function update(UpdateAboutSettingRequest $request)
    {
        return new AboutSettingResource($this->service->update($request->validated()));
    }
}
