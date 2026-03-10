<?php

namespace App\Domain\Construction\Services;

use App\Domain\Construction\Repositories\ConstructionProjectRepository;
use App\Models\ConstructionProject;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class ConstructionProjectService
{
    public function __construct(
        private readonly ConstructionProjectRepository $repo,
        private readonly ActivityLogger $activity
    ) {}

    public function list(?string $search, ?string $category, ?string $service, int $perPage): LengthAwarePaginator
    {
        return $this->repo->paginate($search, $category, $service, $perPage);
    }

    public function all(?string $category = null): Collection
    {
        return $this->repo->all($category);
    }

    public function get(string $id): ConstructionProject
    {
        return $this->repo->findOrFail($id);
    }

    public function create(array $payload): ConstructionProject
    {
        $project = $this->repo->create($this->map($payload));
        $this->activity->log('Project created', 'construction_project', (string) $project->id, $project->title);
        return $project;
    }

    public function update(string $id, array $payload): ConstructionProject
    {
        $project = $this->repo->findOrFail($id);
        $updated = $this->repo->update($project, $this->map($payload));
        $this->activity->log('Project updated', 'construction_project', (string) $updated->id, $updated->title);
        return $updated;
    }

    public function delete(string $id): void
    {
        $project = $this->repo->findOrFail($id);
        $title   = $project->title;
        $this->repo->delete($project);
        $this->activity->log('Project deleted', 'construction_project', $id, $title);
    }

    public function reorder(array $orderedIds): void
    {
        $this->repo->reorder($orderedIds);
        $this->activity->log('Projects reordered', 'construction_project', null, null);
    }

    private function map(array $p): array
    {
        return [
            'title'       => $p['title']       ?? null,
            'description' => $p['description'] ?? null,
            'category'    => $p['category']    ?? 'General',
            'location'    => $p['location']    ?? null,
            'start_date'  => $p['startDate']   ?? null,
            'end_date'    => $p['endDate']      ?? null,
            'status'      => $p['status']       ?? 'ongoing',
            'public_link' => $p['link']         ?? null,
            'images'      => $p['images']       ?? [],
            'services'    => $p['services']     ?? [],
        ];
    }
}
