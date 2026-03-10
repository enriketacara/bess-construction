<?php

namespace Database\Seeders;

use App\Models\ConstructionProject;
use App\Models\ConstructionService;
use App\Models\Slider;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ── Admin user ──────────────────────────────────────────────────────────
        User::firstOrCreate(
            ['email' => 'admin@webuild.com'],
            [
                'name'     => 'Admin',
                'password' => Hash::make('password'),
            ]
        );

        // ── Sliders ─────────────────────────────────────────────────────────────
        $sliderData = [
            [
                'title'       => 'We Provide Best Service',
                'subtitle'    => 'Your digital blueprint for success in the building industry.',
                'image'       => 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1400',
                'button_text' => 'Get Started',
                'button_link' => '#about',
                'sort_order'  => 1,
                'visible'     => true,
            ],
            [
                'title'       => 'Making Dreams Come To Life',
                'subtitle'    => 'The objective is to effectively communicate the company\'s capability to turn clients\' dreams into reality.',
                'image'       => 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1400',
                'button_text' => 'Our Projects',
                'button_link' => '#projects',
                'sort_order'  => 2,
                'visible'     => true,
            ],
            [
                'title'       => 'From Concept To Creation',
                'subtitle'    => 'We build trust with potential clients and illustrate the seamless transformation of ideas into reality.',
                'image'       => 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1400',
                'button_text' => 'Learn More',
                'button_link' => '#services',
                'sort_order'  => 3,
                'visible'     => true,
            ],
        ];

        foreach ($sliderData as $s) {
            Slider::firstOrCreate(['title' => $s['title']], $s);
        }

        // ── Services ────────────────────────────────────────────────────────────
        $services = [
            [
                'title'       => 'Building Construction',
                'description' => 'Building construction is a multifaceted process that transforms an idea into a tangible structure.',
                'image'       => 'https://cdn-icons-png.flaticon.com/512/3522/3522093.png',
                'price'       => 'From $5,000',
                'features'    => ['Foundation Design', 'Structural Work', 'Finishing', 'Quality Inspection'],
                'status'      => 'active',
            ],
            [
                'title'       => 'House Renovation',
                'description' => 'House renovation involves updating, improving, or restoring residential structures to enhance their appearance and value.',
                'image'       => 'https://cdn-icons-png.flaticon.com/512/3659/3659898.png',
                'price'       => 'From $2,500',
                'features'    => ['Interior Remodeling', 'Exterior Upgrades', 'Plumbing & Electrical', 'Paint & Décor'],
                'status'      => 'active',
            ],
            [
                'title'       => 'Architecture Design',
                'description' => 'Architecture design involves the process of planning, designing, and constructing buildings and physical structures.',
                'image'       => 'https://cdn-icons-png.flaticon.com/512/2821/2821640.png',
                'price'       => 'From $1,500',
                'features'    => ['3D Modeling', 'Blueprint Drafting', 'Site Analysis', 'Permits Assistance'],
                'status'      => 'active',
            ],
            [
                'title'       => 'Interior Design',
                'description' => 'Interior design is the art of enhancing the interior of a building to achieve a healthier and aesthetically pleasing environment.',
                'image'       => 'https://cdn-icons-png.flaticon.com/512/4288/4288469.png',
                'price'       => 'From $1,000',
                'features'    => ['Space Planning', 'Furniture Selection', 'Color Consulting', 'Lighting Design'],
                'status'      => 'active',
            ],
            [
                'title'       => 'Material Supply',
                'description' => 'We provide high-quality construction materials ensuring durability and sustainability for all your building needs.',
                'image'       => 'https://cdn-icons-png.flaticon.com/512/3079/3079388.png',
                'price'       => 'Custom Quote',
                'features'    => ['Premium Materials', 'On-Time Delivery', 'Bulk Discounts', 'Quality Certified'],
                'status'      => 'active',
            ],
            [
                'title'       => 'Construction Consultant',
                'description' => 'Expert consultation services to guide your construction projects from planning to completion.',
                'image'       => 'https://cdn-icons-png.flaticon.com/512/2920/2920277.png',
                'price'       => '$150/hr',
                'features'    => ['Project Assessment', 'Cost Estimation', 'Risk Analysis', 'Progress Monitoring'],
                'status'      => 'active',
            ],
        ];

        foreach ($services as $s) {
            ConstructionService::firstOrCreate(['title' => $s['title']], $s);
        }

        // ── Projects ────────────────────────────────────────────────────────────
        $projects = [
            [
                'title'       => 'Modern Villa',
                'description' => 'A stunning modern villa featuring open-plan living spaces, floor-to-ceiling windows, and premium finishes throughout.',
                'category'    => 'Residential',
                'images'      => ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'],
                'status'      => 'completed',
                'services'    => ['Building Construction', 'Interior Design'],
            ],
            [
                'title'       => 'Office Complex',
                'description' => 'A state-of-the-art commercial office complex designed for productivity and modern work culture.',
                'category'    => 'Commercial',
                'images'      => ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800'],
                'status'      => 'completed',
                'services'    => ['Building Construction', 'Architecture Design'],
            ],
            [
                'title'       => 'Shopping Mall',
                'description' => 'A large-scale retail complex with over 200 stores, food courts, and entertainment facilities.',
                'category'    => 'Commercial',
                'images'      => ['https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800'],
                'status'      => 'completed',
                'services'    => ['Building Construction'],
            ],
            [
                'title'       => 'Luxury Apartment',
                'description' => 'A 24-storey luxury residential tower with world-class amenities and panoramic city views.',
                'category'    => 'Residential',
                'images'      => ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800'],
                'status'      => 'ongoing',
                'services'    => ['Building Construction', 'Interior Design', 'Architecture Design'],
            ],
            [
                'title'       => 'Hotel Building',
                'description' => 'A five-star hotel with 300 rooms, spa, rooftop pool, and multiple dining options.',
                'category'    => 'Hospitality',
                'images'      => ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'],
                'status'      => 'completed',
                'services'    => ['Building Construction', 'Interior Design'],
            ],
            [
                'title'       => 'Restaurant Interior',
                'description' => 'A bespoke restaurant interior transformation featuring custom joinery and signature lighting design.',
                'category'    => 'Interior',
                'images'      => ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800'],
                'status'      => 'completed',
                'services'    => ['Interior Design'],
            ],
        ];

        foreach ($projects as $p) {
            ConstructionProject::firstOrCreate(['title' => $p['title']], $p);
        }
    }
}
