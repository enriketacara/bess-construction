<?php

namespace App\Domain\Construction\Repositories;

use App\Models\AboutSetting;

class AboutSettingRepository
{
    public function getSingleton(): AboutSetting
    {
        $row = AboutSetting::query()->first();

        if (!$row) {
            $row = AboutSetting::query()->create([
                'company_name' => 'WeBuild Construction',
                'tagline'      => 'Building Strong Foundations',
                'description'  => 'We deliver residential & commercial construction with quality, safety, and deadlines in mind. Our team of experts transforms your vision into reality.',
                'mission'      => 'Build reliable structures and long-term trust with our clients.',
                'vision'       => 'Be the most trusted construction partner in the region.',
                'founded'      => '2015',
                'employees'    => '250+',
                'clients'      => '500+',
                'awards'       => '25+',
                'phone'        => '+123-456-7890',
                'email'        => 'info@webuild.com',
                'address'      => 'Mumbai, India - 400104',
            ]);
        }

        return $row;
    }

    public function updateSingleton(array $data): AboutSetting
    {
        $row = $this->getSingleton();
        $row->fill($data);
        $row->save();
        return $row->refresh();
    }
}
