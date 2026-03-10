<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AboutSetting extends Model
{
    protected $fillable = [
        'company_name',
        'tagline',
        'description',
        'mission',
        'vision',
        'founded',
        'employees',
        'clients',
        'awards',
        'hero_image',
        'team_image',
        'phone',
        'email',
        'address',
        'facebook',
        'twitter',
        'instagram',
        'linkedin',
    ];
}
