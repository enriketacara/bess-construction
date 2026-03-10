<?php

namespace App\Http\Controllers\Api\V1;

use App\Domain\Construction\Services\ConstructionProjectService;
use App\Http\Controllers\Controller;
use App\Http\Requests\V1\StoreConstructionProjectRequest;
use App\Http\Requests\V1\UpdateConstructionProjectRequest;
use App\Http\Resources\V1\ConstructionProjectResource;
use Illuminate\Http\Request;

class ConstructionProjectController extends Controller
{
    public function __construct(private readonly ConstructionProjectService $service) {}

    public function index(Request $request)
    {
        $search   = $request->string('search')->toString() ?: null;
        $category = $request->string('category')->toString() ?: null;
        $service  = $request->string('service')->toString() ?: null;
        $perPage  = (int) ($request->integer('perPage') ?: 15);

        return ConstructionProjectResource::collection(
            $this->service->list($search, $category, $service, $perPage)
        );
    }

    public function store(StoreConstructionProjectRequest $request)
    {
        $created = $this->service->create($request->validated());
        return (new ConstructionProjectResource($created))->response()->setStatusCode(201);
    }

    public function show(string $id)
    {
        return new ConstructionProjectResource($this->service->get($id));
    }

    public function update(UpdateConstructionProjectRequest $request, string $id)
    {
        return new ConstructionProjectResource($this->service->update($id, $request->validated()));
    }

    public function destroy(string $id)
    {
        $this->service->delete($id);
        return response()->json(['ok' => true]);
    }

    /**
     * POST /api/v1/construction-projects/reorder
     * Body: { "ids": ["3", "1", "5", "2"] }  — ordered from first to last
     */
    public function reorder(Request $request)
    {
        $request->validate([
            'ids'   => ['required', 'array'],
            'ids.*' => ['required'],
        ]);

        $this->service->reorder($request->input('ids'));
        return response()->json(['ok' => true]);
    }
}
