<?php

namespace App\Http\Controllers\Api\V1;

use App\Domain\Construction\Services\SliderService;
use App\Http\Controllers\Controller;
use App\Http\Requests\V1\StoreSliderRequest;
use App\Http\Requests\V1\UpdateSliderRequest;
use App\Http\Resources\V1\SliderResource;
use Illuminate\Http\Request;

class SliderController extends Controller
{
    public function __construct(private readonly SliderService $service) {}

    public function index()
    {
        return SliderResource::collection($this->service->list());
    }

    public function store(StoreSliderRequest $request)
    {
        $created = $this->service->create($request->validated());
        return (new SliderResource($created))->response()->setStatusCode(201);
    }

    public function update(UpdateSliderRequest $request, string $id)
    {
        return new SliderResource($this->service->update($id, $request->validated()));
    }

    public function destroy(string $id)
    {
        $this->service->delete($id);
        return response()->json(['ok' => true]);
    }

    public function toggleVisibility(string $id)
    {
        return new SliderResource($this->service->toggleVisibility($id));
    }

    public function move(Request $request, string $id)
    {
        $direction = $request->string('direction')->toString();
        abort_unless(in_array($direction, ['up', 'down'], true), 422, 'Invalid direction');

        return SliderResource::collection($this->service->move($id, $direction));
    }
}
