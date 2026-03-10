<?php

namespace App\Domain\Construction\Services;

use App\Domain\Construction\Repositories\AboutSettingRepository;
use App\Models\AboutSetting;

class AboutSettingService
{
    public function __construct(
        private readonly AboutSettingRepository $repo,
        private readonly ActivityLogger $activity
    ) {}

    public function get(): AboutSetting
    {
        return $this->repo->getSingleton();
    }

    public function update(array $payload): AboutSetting
    {
        $fields = [
            'company_name' => $payload['companyName'] ?? null,
            'tagline'      => $payload['tagline']     ?? null,
            'description'  => $payload['description'] ?? null,
            'mission'      => $payload['mission']     ?? null,
            'vision'       => $payload['vision']      ?? null,
            'founded'      => $payload['founded']     ?? null,
            'employees'    => $payload['employees']   ?? null,
            'clients'      => $payload['clients']     ?? null,
            'awards'       => $payload['awards']      ?? null,
            'hero_image'   => $payload['heroImage']   ?? null,
            'team_image'   => $payload['teamImage']   ?? null,
            'phone'        => $payload['phone']       ?? null,
            'email'        => $payload['email']       ?? null,
            'address'      => $payload['address']     ?? null,
            'facebook'     => $payload['facebook']    ?? null,
            'twitter'      => $payload['twitter']     ?? null,
            'instagram'    => $payload['instagram']   ?? null,
            'linkedin'     => $payload['linkedin']    ?? null,
        ];

        $filtered = array_filter($fields, fn($v) => $v !== null);
        $updated  = $this->repo->updateSingleton($filtered);
        $this->activity->log('About updated', 'about', (string) $updated->id, $updated->company_name);
        return $updated;
    }
}
