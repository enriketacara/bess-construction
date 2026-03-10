<?php

namespace App\Domain\Construction\Services;

use App\Models\ActivityLog;
use App\Models\ConstructionProject;
use App\Models\ConstructionService;
use App\Models\Slider;

class DashboardService
{
    public function overview(): array
    {
        $totalProjects  = ConstructionProject::query()->count();
        $activeServices = ConstructionService::query()->where('status', 'active')->count();
        $sliderItems    = Slider::query()->count();

        $recent = ActivityLog::query()
            ->orderByDesc('happened_at')
            ->limit(10)
            ->get()
            ->map(fn(ActivityLog $a) => [
                'action' => $a->action,
                'item'   => $a->label ?? $a->entity,
                'time'   => $a->happened_at->diffForHumans(),
            ])
            ->values()
            ->all();

        return [
            'stats' => [
                'totalProjects'  => (string) $totalProjects,
                'activeServices' => (string) $activeServices,
                'sliderItems'    => (string) $sliderItems,
                'totalViews'     => '—',
            ],
            'recentActivity' => $recent,
        ];
    }
}
