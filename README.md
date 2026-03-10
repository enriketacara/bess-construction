# WeBuild Construction — Full Stack Setup Guide

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND                                │
│                                                             │
│  website-frontend (React + Vite, port 5173)                 │
│  → Public pages: sliders, about, services, projects         │
│                                                             │
│  admin-dashboard (React + Vite + TypeScript, port 5174)     │
│  → CRUD for all content, protected by Sanctum token auth    │
└─────────────────┬───────────────────────────────────────────┘
                  │ REST API (JSON)
┌─────────────────▼───────────────────────────────────────────┐
│                   LARAVEL 11 BACKEND                        │
│                                                             │
│  Public routes  → /api/v1/public/*  (no auth)               │
│  Admin routes   → /api/v1/*         (auth:sanctum)          │
└─────────────────────────────────────────────────────────────┘
```

---

## 1. Laravel Backend Setup

### Requirements
- PHP 8.2+
- Composer
- MySQL 8+ (or SQLite for local dev)

### Steps

```bash
# 1. Create a fresh Laravel 11 project
composer create-project laravel/laravel webuild-api
cd webuild-api

# 2. Install Sanctum (API token auth)
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"

# 3. Copy files from this package into the project
#    Copy these folders INTO your Laravel project root:
#    ✅ app/Domain/          → app/Domain/
#    ✅ app/Http/Controllers/Api/  → app/Http/Controllers/Api/
#    ✅ app/Http/Requests/V1/      → app/Http/Requests/V1/
#    ✅ app/Http/Resources/V1/     → app/Http/Resources/V1/
#    ✅ app/Models/                → app/Models/  (merge with existing)
#    ✅ database/migrations/       → database/migrations/
#    ✅ database/seeders/          → database/seeders/  (replace DatabaseSeeder.php)
#    ✅ routes/api.php             → routes/api.php  (replace)
#    ✅ config/cors.php            → config/cors.php  (replace)

# 4. Configure your .env
cp .env.example .env
php artisan key:generate
# Edit .env: set DB_DATABASE, DB_USERNAME, DB_PASSWORD
# Set FRONTEND_URL and ADMIN_URL for CORS

# 5. Run migrations and seed demo data
php artisan migrate
php artisan db:seed

# 6. Create storage symlink (for image uploads)
php artisan storage:link

# 7. Register API routes in bootstrap/app.php
# Make sure this section exists:
# ->withRouting(
#     web: __DIR__.'/../routes/web.php',
#     api: __DIR__.'/../routes/api.php',
#     ...
# )

# 8. Reload autoloader
composer dump-autoload
php artisan optimize:clear

# 9. Start the server
php artisan serve
# → Running on http://localhost:8000
```

### Default Admin Credentials (after seeding)
```
Email:    admin@webuild.com
Password: password
```
> ⚠️ Change these in production!

---

## 2. Website Frontend Setup

```bash
# From the original construction-bess folder:
# 1. Replace src/App.jsx with the one from website-frontend/App.jsx
# 2. Create .env file:
echo "VITE_API_BASE=http://localhost:8000/api/v1" > .env

# 3. Install and run
npm install
npm run dev
# → Running on http://localhost:5173
```

---

## 3. Admin Dashboard Setup

```bash
# From the Admin Dashboard Design folder:
# 1. Create .env file:
echo "VITE_API_BASE=http://localhost:8000/api/v1" > .env

# 2. Install and run
npm install
npm run dev
# → Running on http://localhost:5174
```

---

## API Endpoints Reference

### Public (no auth) — used by website frontend
| Method | Endpoint                  | Description                       |
|--------|---------------------------|-----------------------------------|
| GET    | /api/v1/public/sliders    | All visible sliders (ordered)     |
| GET    | /api/v1/public/about      | Company info                      |
| GET    | /api/v1/public/services   | Active services only              |
| GET    | /api/v1/public/projects   | All projects (?category=filter)   |

### Auth
| Method | Endpoint               | Description          |
|--------|------------------------|----------------------|
| POST   | /api/v1/auth/login     | Get token            |
| POST   | /api/v1/auth/logout    | Revoke token         |
| GET    | /api/v1/auth/me        | Current user         |

### Protected (Bearer token) — used by admin dashboard
| Method | Endpoint                                       | Description              |
|--------|------------------------------------------------|--------------------------|
| GET    | /api/v1/sliders                                | List all sliders         |
| POST   | /api/v1/sliders                                | Create slider            |
| PUT    | /api/v1/sliders/{id}                           | Update slider            |
| DELETE | /api/v1/sliders/{id}                           | Delete slider            |
| PATCH  | /api/v1/sliders/{id}/toggle-visibility         | Show/hide slider         |
| PATCH  | /api/v1/sliders/{id}/move?direction=up|down    | Reorder slider           |
| GET    | /api/v1/construction-services                  | List services (paginated)|
| POST   | /api/v1/construction-services                  | Create service           |
| PUT    | /api/v1/construction-services/{id}             | Update service           |
| DELETE | /api/v1/construction-services/{id}             | Delete service           |
| GET    | /api/v1/construction-projects                  | List projects (paginated)|
| POST   | /api/v1/construction-projects                  | Create project           |
| PUT    | /api/v1/construction-projects/{id}             | Update project           |
| DELETE | /api/v1/construction-projects/{id}             | Delete project           |
| GET    | /api/v1/about                                  | Get about info           |
| PUT    | /api/v1/about                                  | Update about info        |
| POST   | /api/v1/uploads/image                          | Upload single image      |
| POST   | /api/v1/uploads/images                         | Upload multiple images   |
| GET    | /api/v1/dashboard/overview                     | Dashboard stats          |

---

## Data Flow

```
Admin Dashboard
   │
   ├── Login → POST /auth/login → receives Bearer token
   │
   ├── Manage Sliders → /api/v1/sliders/*
   ├── Manage Services → /api/v1/construction-services/*
   ├── Manage Projects → /api/v1/construction-projects/*
   └── Manage About → /api/v1/about
                        │
                        ▼ (stored in MySQL)
                  Laravel Backend
                        │
                        ▼ (public read-only)
              Website Frontend reads from:
              /api/v1/public/sliders
              /api/v1/public/about
              /api/v1/public/services
              /api/v1/public/projects
```

---

## File Structure (Laravel — files added by this package)

```
app/
├── Domain/
│   └── Construction/
│       ├── Repositories/
│       │   ├── AboutSettingRepository.php
│       │   ├── ConstructionProjectRepository.php
│       │   ├── ConstructionServiceRepository.php
│       │   └── SliderRepository.php
│       └── Services/
│           ├── AboutSettingService.php
│           ├── ActivityLogger.php
│           ├── ConstructionProjectService.php
│           ├── ConstructionServiceService.php
│           ├── DashboardService.php
│           └── SliderService.php
├── Http/
│   ├── Controllers/Api/V1/
│   │   ├── AboutSettingController.php
│   │   ├── AuthController.php
│   │   ├── ConstructionProjectController.php
│   │   ├── ConstructionServiceController.php
│   │   ├── DashboardController.php
│   │   ├── PublicController.php        ← new: website public API
│   │   ├── SliderController.php
│   │   └── UploadController.php
│   ├── Requests/V1/
│   │   ├── StoreSliderRequest.php
│   │   ├── UpdateSliderRequest.php
│   │   ├── StoreConstructionServiceRequest.php
│   │   ├── UpdateConstructionServiceRequest.php
│   │   ├── StoreConstructionProjectRequest.php
│   │   ├── UpdateConstructionProjectRequest.php
│   │   └── UpdateAboutSettingRequest.php
│   └── Resources/V1/
│       ├── AboutSettingResource.php
│       ├── ConstructionProjectResource.php
│       ├── ConstructionServiceResource.php
│       └── SliderResource.php
└── Models/
    ├── AboutSetting.php
    ├── ActivityLog.php
    ├── ConstructionProject.php
    ├── ConstructionService.php
    └── Slider.php

database/
├── migrations/
│   ├── ..._create_sliders_table.php
│   ├── ..._create_construction_services_table.php
│   ├── ..._create_construction_projects_table.php
│   ├── ..._create_about_settings_table.php
│   └── ..._create_activity_logs_table.php
└── seeders/
    └── DatabaseSeeder.php

routes/
└── api.php

config/
└── cors.php
```
