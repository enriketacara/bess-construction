<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ConstructionProject extends Model
{
    protected $fillable = [
        'title',
        'description',
        'images',
        'category',
        'location',
        'start_date',
        'end_date',
        'status',
        'public_link',
        'services',
    ];

    protected $casts = [
        'images'     => 'array',
        'services'   => 'array',
        'start_date' => 'date',
        'end_date'   => 'date',
    ];
}
