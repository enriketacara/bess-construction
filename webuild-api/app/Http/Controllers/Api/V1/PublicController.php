<?php

namespace App\Http\Controllers\Api\V1;

use App\Domain\Construction\Repositories\AboutSettingRepository;
use App\Domain\Construction\Repositories\ConstructionProjectRepository;
use App\Domain\Construction\Repositories\ConstructionServiceRepository;
use App\Domain\Construction\Repositories\SliderRepository;
use App\Http\Controllers\Controller;
use App\Http\Resources\V1\AboutSettingResource;
use App\Http\Resources\V1\ConstructionProjectResource;
use App\Http\Resources\V1\ConstructionServiceResource;
use App\Http\Resources\V1\SliderResource;
use Illuminate\Http\Request;

/**
 * Public read-only endpoints consumed by the website frontend.
 * No authentication required.
 */
class PublicController extends Controller
{
    public function __construct(
        private readonly SliderRepository              $sliders,
        private readonly ConstructionServiceRepository $services,
        private readonly ConstructionProjectRepository $projects,
        private readonly AboutSettingRepository        $about,
    ) {}

    /** GET /api/v1/public/sliders — only visible sliders */
    public function sliders()
    {
        return SliderResource::collection($this->sliders->listVisible());
    }

    /** GET /api/v1/public/about */
    public function about()
    {
        return new AboutSettingResource($this->about->getSingleton());
    }

    /** GET /api/v1/public/services — only active services */
    public function services()
    {
        return ConstructionServiceResource::collection($this->services->allActive());
    }

    /** GET /api/v1/public/projects */
    public function projects(Request $request)
    {
        $category = $request->string('category')->toString() ?: null;
        return ConstructionProjectResource::collection($this->projects->all($category));
    }
}
