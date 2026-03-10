<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ActivityLog extends Model
{
    protected $fillable = [
        'action',
        'entity',
        'entity_id',
        'label',
        'happened_at',
    ];

    protected $casts = [
        'happened_at' => 'datetime',
    ];
}
