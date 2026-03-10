<?php

namespace App\Domain\Construction\Services;

use App\Domain\Construction\Repositories\SliderRepository;
use App\Models\Slider;
use Illuminate\Support\Collection;

class SliderService
{
    public function __construct(
        private readonly SliderRepository $repo,
        private readonly ActivityLogger $activity
    ) {}

    public function list(): Collection
    {
        return $this->repo->list();
    }

    public function listVisible(): Collection
    {
        return $this->repo->listVisible();
    }

    public function create(array $payload): Slider
    {
        $created = $this->repo->create($this->map($payload));
        $this->activity->log('Slider created', 'slider', (string) $created->id, $created->title);
        return $created;
    }

    public function update(string $id, array $payload): Slider
    {
        $slider  = $this->repo->findOrFail($id);
        $updated = $this->repo->update($slider, $this->map($payload));
        $this->activity->log('Slider updated', 'slider', (string) $updated->id, $updated->title);
        return $updated;
    }

    public function delete(string $id): void
    {
        $slider = $this->repo->findOrFail($id);
        $title  = $slider->title;
        $this->repo->delete($slider);
        $this->activity->log('Slider deleted', 'slider', $id, $title);
    }

    public function toggleVisibility(string $id): Slider
    {
        $slider  = $this->repo->findOrFail($id);
        $updated = $this->repo->update($slider, ['visible' => !$slider->visible]);
        $this->activity->log('Slider visibility toggled', 'slider', (string) $updated->id, $updated->title);
        return $updated;
    }

    public function move(string $id, string $direction): Collection
    {
        $slider = $this->repo->findOrFail($id);

        $neighbor = Slider::query()
            ->when($direction === 'up',   fn($q) => $q->where('sort_order', '<', $slider->sort_order)->orderByDesc('sort_order'))
            ->when($direction === 'down', fn($q) => $q->where('sort_order', '>', $slider->sort_order)->orderBy('sort_order'))
            ->first();

        if ($neighbor) {
            [$a, $b] = [$slider->sort_order, $neighbor->sort_order];
            $slider->update(['sort_order' => $b]);
            $neighbor->update(['sort_order' => $a]);
            $this->activity->log("Slider moved {$direction}", 'slider', (string) $slider->id, $slider->title);
        }

        return $this->repo->list();
    }

    private function map(array $p): array
    {
        $out = [
            'title'       => $p['title']      ?? null,
            'subtitle'    => $p['subtitle']   ?? null,
            'image'       => $p['image']      ?? null,
            'button_text' => $p['buttonText'] ?? null,
            'button_link' => $p['buttonLink'] ?? null,
            'visible'     => $p['visible']    ?? true,
        ];

        if (array_key_exists('order', $p) && $p['order'] !== null) {
            $out['sort_order'] = (int) $p['order'];
        }

        return array_filter($out, fn($v) => $v !== null);
    }
}
