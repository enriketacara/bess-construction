<?php

namespace App\Domain\Construction\Services;

use App\Domain\Construction\Repositories\ConstructionServiceRepository;
use App\Models\ConstructionService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class ConstructionServiceService
{
    public function __construct(
        private readonly ConstructionServiceRepository $repo,
        private readonly ActivityLogger $activity
    ) {}

    public function list(?string $search, ?string $status, int $perPage): LengthAwarePaginator
    {
        return $this->repo->paginate($search, $status, $perPage);
    }

    public function allActive(): Collection
    {
        return $this->repo->allActive();
    }

    public function get(string $id): ConstructionService
    {
        return $this->repo->findOrFail($id);
    }

    public function create(array $payload): ConstructionService
    {
        $created = $this->repo->create($this->map($payload));
        $this->activity->log('Service created', 'construction_service', (string) $created->id, $created->title);
        return $created;
    }

    public function update(string $id, array $payload): ConstructionService
    {
        $service = $this->repo->findOrFail($id);
        $updated = $this->repo->update($service, $this->map($payload));
        $this->activity->log('Service updated', 'construction_service', (string) $updated->id, $updated->title);
        return $updated;
    }

    public function delete(string $id): void
    {
        $service = $this->repo->findOrFail($id);
        $title   = $service->title;
        $this->repo->delete($service);
        $this->activity->log('Service deleted', 'construction_service', $id, $title);
    }

    private function map(array $p): array
    {
        return [
            'title'       => $p['title']       ?? null,
            'description' => $p['description'] ?? null,
            'image'       => $p['image']        ?? null,
            'price'       => $p['price']        ?? null,
            'features'    => $p['features']     ?? [],
            'status'      => $p['status']       ?? 'active',
        ];
    }
}
