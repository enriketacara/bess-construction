<?php

namespace App\Domain\Construction\Repositories;

use App\Models\ConstructionService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class ConstructionServiceRepository
{
    public function paginate(?string $search, ?string $status, int $perPage = 10): LengthAwarePaginator
    {
        $q = ConstructionService::query();

        if ($search) {
            $q->where(function ($sub) use ($search) {
                $sub->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($status) {
            $q->where('status', $status);
        }

        return $q->orderByDesc('created_at')->paginate($perPage);
    }

    public function allActive(): Collection
    {
        return ConstructionService::query()->where('status', 'active')->orderByDesc('created_at')->get();
    }

    public function findOrFail(string $id): ConstructionService
    {
        return ConstructionService::query()->findOrFail($id);
    }

    public function create(array $data): ConstructionService
    {
        return ConstructionService::query()->create($data);
    }

    public function update(ConstructionService $service, array $data): ConstructionService
    {
        $service->fill($data);
        $service->save();
        return $service->refresh();
    }

    public function delete(ConstructionService $service): void
    {
        $service->delete();
    }
}
