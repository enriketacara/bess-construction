<?php

namespace App\Domain\Construction\Services;

use App\Models\ActivityLog;
use Carbon\Carbon;

class ActivityLogger
{
    public function log(string $action, string $entity, ?string $entityId = null, ?string $label = null): void
    {
        ActivityLog::query()->create([
            'action'      => $action,
            'entity'      => $entity,
            'entity_id'   => $entityId,
            'label'       => $label,
            'happened_at' => Carbon::now(),
        ]);
    }
}
