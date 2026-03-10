<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\ConstructionProjectController;
use App\Http\Controllers\Api\V1\ConstructionServiceController;
use App\Http\Controllers\Api\V1\SliderController;
use App\Http\Controllers\Api\V1\AboutSettingController;
use App\Http\Controllers\Api\V1\DashboardController;
use App\Http\Controllers\Api\V1\UploadController;
use App\Http\Controllers\Api\V1\PublicController;

Route::prefix('v1')->group(function () {

    // ─── Public (no auth) — consumed by the website frontend ──────────────────
    Route::prefix('public')->group(function () {
        Route::get('/sliders',  [PublicController::class, 'sliders']);
        Route::get('/about',    [PublicController::class, 'about']);
        Route::get('/services', [PublicController::class, 'services']);
        Route::get('/projects', [PublicController::class, 'projects']);
    });

    // ─── Auth ──────────────────────────────────────────────────────────────────
    Route::post('/auth/login', [AuthController::class, 'login']);

    // ─── Protected (admin dashboard) ──────────────────────────────────────────
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/auth/me',     [AuthController::class, 'me']);

        Route::get('/dashboard/overview', [DashboardController::class, 'overview']);

        Route::post('/uploads/image',  [UploadController::class, 'image']);
        Route::post('/uploads/images', [UploadController::class, 'images']);

        // Construction projects — reorder must be before apiResource to avoid conflict
        Route::post('/construction-projects/reorder', [ConstructionProjectController::class, 'reorder']);
        Route::apiResource('construction-projects', ConstructionProjectController::class);

        // Construction services
        Route::apiResource('construction-services', ConstructionServiceController::class);

        // Sliders
        Route::get('/sliders',                          [SliderController::class, 'index']);
        Route::post('/sliders',                         [SliderController::class, 'store']);
        Route::put('/sliders/{id}',                     [SliderController::class, 'update']);
        Route::delete('/sliders/{id}',                  [SliderController::class, 'destroy']);
        Route::patch('/sliders/{id}/toggle-visibility', [SliderController::class, 'toggleVisibility']);
        Route::patch('/sliders/{id}/move',              [SliderController::class, 'move']);

        // About
        Route::get('/about', [AboutSettingController::class, 'show']);
        Route::put('/about', [AboutSettingController::class, 'update']);
    });
});
