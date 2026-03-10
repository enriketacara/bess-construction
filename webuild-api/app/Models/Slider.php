<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Slider extends Model
{
    protected $fillable = [
        'title',
        'subtitle',
        'image',
        'button_text',
        'button_link',
        'sort_order',
        'visible',
    ];

    protected $casts = [
        'visible' => 'boolean',
        'sort_order' => 'integer',
    ];
}
