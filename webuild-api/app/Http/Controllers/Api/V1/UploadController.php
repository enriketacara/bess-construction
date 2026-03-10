<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UploadController extends Controller
{
    public function image(Request $request)
    {
        $request->validate([
            'image' => ['required', 'file', 'image', 'max:5120'],
        ]);

        $path = $request->file('image')->store('uploads', 'public');

        return response()->json([
            'url'  => Storage::disk('public')->url($path),
            'path' => $path,
        ], 201);
    }

    public function images(Request $request)
    {
        $request->validate([
            'images'   => ['required', 'array', 'min:1', 'max:10'],
            'images.*' => ['required', 'file', 'image', 'max:5120'],
        ]);

        $out = [];
        foreach ($request->file('images') as $file) {
            $path  = $file->store('uploads', 'public');
            $out[] = [
                'url'  => Storage::disk('public')->url($path),
                'path' => $path,
            ];
        }

        return response()->json(['files' => $out], 201);
    }
}
