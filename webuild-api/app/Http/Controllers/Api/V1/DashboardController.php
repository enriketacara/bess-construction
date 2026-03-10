<?php

namespace App\Http\Controllers\Api\V1;

use App\Domain\Construction\Services\DashboardService;
use App\Http\Controllers\Controller;

class DashboardController extends Controller
{
    public function __construct(private readonly DashboardService $service) {}

    public function overview()
    {
        return response()->json($this->service->overview());
    }
}
