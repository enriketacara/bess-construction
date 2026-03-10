<?php

namespace App\Domain\Construction\Repositories;

use App\Models\Slider;
use Illuminate\Support\Collection;

class SliderRepository
{
    public function list(): Collection
    {
        return Slider::query()->orderBy('sort_order')->get();
    }

    public function listVisible(): Collection
    {
        return Slider::query()->where('visible', true)->orderBy('sort_order')->get();
    }

    public function findOrFail(string $id): Slider
    {
        return Slider::query()->findOrFail($id);
    }

    public function create(array $data): Slider
    {
        $max = (int) Slider::query()->max('sort_order');
        $data['sort_order'] = $max + 1;
        return Slider::query()->create($data);
    }

    public function update(Slider $slider, array $data): Slider
    {
        $slider->fill($data);
        $slider->save();
        return $slider->refresh();
    }

    public function delete(Slider $slider): void
    {
        $slider->delete();
    }
}
