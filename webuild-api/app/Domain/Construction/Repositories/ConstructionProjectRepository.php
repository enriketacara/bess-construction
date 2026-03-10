<?php

namespace App\Domain\Construction\Repositories;

use App\Models\ConstructionProject;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class ConstructionProjectRepository
{
    public function paginate(?string $search, ?string $category, ?string $service, int $perPage = 10): LengthAwarePaginator
    {
        $q = ConstructionProject::query();

        if ($search) {
            $q->where(function ($sub) use ($search) {
                $sub->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('location', 'like', "%{$search}%");
            });
        }

        if ($category) {
            $q->where('category', $category);
        }

        if ($service) {
            $q->whereJsonContains('services', $service);
        }

        return $q->orderBy('sort_order')->orderByDesc('created_at')->paginate($perPage);
    }

    public function all(?string $category = null): Collection
    {
        $q = ConstructionProject::query();
        if ($category) {
            $q->where('category', $category);
        }
        return $q->orderBy('sort_order')->orderByDesc('created_at')->get();
    }

    public function findOrFail(string $id): ConstructionProject
    {
        return ConstructionProject::query()->findOrFail($id);
    }

    public function create(array $data): ConstructionProject
    {
        // New projects go to the end
        $max = (int) ConstructionProject::query()->max('sort_order');
        $data['sort_order'] = $max + 1;
        return ConstructionProject::query()->create($data);
    }

    public function update(ConstructionProject $project, array $data): ConstructionProject
    {
        $project->fill($data);
        $project->save();
        return $project->refresh();
    }

    public function delete(ConstructionProject $project): void
    {
        $project->delete();
    }

    /**
     * Reorder projects by receiving an ordered array of IDs.
     */
    public function reorder(array $orderedIds): void
    {
        foreach ($orderedIds as $position => $id) {
            ConstructionProject::query()
                ->where('id', $id)
                ->update(['sort_order' => $position + 1]);
        }
    }
}
