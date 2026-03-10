<?php

namespace App\Http\Controllers\Api\V1;

use App\Domain\Construction\Services\ConstructionServiceService;
use App\Http\Controllers\Controller;
use App\Http\Requests\V1\StoreConstructionServiceRequest;
use App\Http\Requests\V1\UpdateConstructionServiceRequest;
use App\Http\Resources\V1\ConstructionServiceResource;
use Illuminate\Http\Request;

class ConstructionServiceController extends Controller
{
    public function __construct(private readonly ConstructionServiceService $service) {}

    public function index(Request $request)
    {
        $search  = $request->string('search')->toString() ?: null;
        $status  = $request->string('status')->toString() ?: null;
        $perPage = (int) ($request->integer('perPage') ?: 15);

        return ConstructionServiceResource::collection(
            $this->service->list($search, $status, $perPage)
        );
    }

    public function store(StoreConstructionServiceRequest $request)
    {
        $created = $this->service->create($request->validated());
        return (new ConstructionServiceResource($created))->response()->setStatusCode(201);
    }

    public function show(string $id)
    {
        return new ConstructionServiceResource($this->service->get($id));
    }

    public function update(UpdateConstructionServiceRequest $request, string $id)
    {
        return new ConstructionServiceResource($this->service->update($id, $request->validated()));
    }

    public function destroy(string $id)
    {
        $this->service->delete($id);
        return response()->json(['ok' => true]);
    }
}
