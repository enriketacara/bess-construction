<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ConstructionService extends Model
{
    protected $fillable = [
        'title',
        'description',
        'image',
        'price',
        'features',
        'status',
    ];

    protected $casts = [
        'features' => 'array',
    ];
}
