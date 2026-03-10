# Image Upload Implementation - Laravel Integration Guide

## Overview
This dashboard now supports file uploads from your computer instead of URL inputs. Images are temporarily previewed using blob URLs. When you connect to your Laravel backend, you'll need to handle the actual file uploads.

## Features Implemented

### 1. ImageUpload Component (`/src/app/components/ImageUpload.tsx`)
A reusable component that handles:
- Drag and drop file upload
- Click to browse files
- Multiple file uploads (configurable)
- Image previews
- Remove uploaded images
- Maximum image limit

### 2. Pages Updated with Image Upload

#### **Projects Page**
- **Multiple images per project** (gallery)
- Upload up to 10 images at once
- Gallery viewer with navigation
- Services used in each project
- Full CRUD operations

#### **Services Page**
- Single image upload per service
- Image replaces the emoji icon
- Image preview in cards

#### **Sliders Page** (Need to complete)
- Single image upload per slider

#### **About Us Page** (Need to complete)
- Single image upload for company

## Laravel Backend Integration

### Step 1: Laravel API Routes

Create these routes in your Laravel `routes/api.php`:

```php
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\SliderController;
use App\Http\Controllers\AboutController;

Route::prefix('admin')->group(function () {
    // Projects
    Route::apiResource('projects', ProjectController::class);
    Route::post('projects/{project}/images', [ProjectController::class, 'uploadImages']);
    Route::delete('projects/{project}/images/{image}', [ProjectController::class, 'deleteImage']);
    
    // Services
    Route::apiResource('services', ServiceController::class);
    Route::post('services/{service}/image', [ServiceController::class, 'uploadImage']);
    
    // Sliders
    Route::apiResource('sliders', SliderController::class);
    Route::post('sliders/{slider}/image', [SliderController::class, 'uploadImage']);
    Route::put('sliders/{slider}/reorder', [SliderController::class, 'reorder']);
    
    // About
    Route::get('about', [AboutController::class, 'show']);
    Route::put('about', [AboutController::class, 'update']);
    Route::post('about/image', [AboutController::class, 'uploadImage']);
});
```

### Step 2: Laravel Controller Example (ProjectController.php)

```php
<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProjectController extends Controller
{
    public function index() {
        return Project::with('images', 'services')->get();
    }

    public function store(Request $request){
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'category' => 'required|string',
            'link' => 'required|url',
            'services' => 'array',
            'services.*' => 'string',
        ]);

        $project = Project::create($validated);

        if ($request->has('services')) {
            $project->services()->sync($request->services);
        }

        return response()->json($project->load('services'), 201);
    }

    public function uploadImages(Request $request, Project $project) {
        $request->validate([
            'images' => 'required|array|max:10',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:2048'
        ]);

        $uploadedImages = [];

        foreach ($request->file('images') as $image) {
            $path = $image->store('projects', 'public');
            $projectImage = $project->images()->create([
                'path' => $path,
                'url' => Storage::url($path)
            ]);
             $uploadedImages[] = $projectImage;
        }

        return response()->json([
            'message' => 'Images uploaded successfully',
            'images' => $uploadedImages
        ]);
    }

    public function deleteImage(Project $project, $imageId) {
        $image = $project->images()->findOrFail($imageId);
        
        Storage::disk('public')->delete($image->path);
        $image->delete();

        return response()->json(['message' => 'Image deleted successfully']);
    }

    public function update(Request $request, Project $project) {
        $validated = $request->validate([
            'title' => 'string|max:255',
            'description' => 'string',
            'category' => 'string',
            'link' => 'url',
            'services' => 'array',
        ]);

        $project->update($validated);

        if ($request->has('services')) {
            $project->services()->sync($request->services);
        }

        return response()->json($project->load('services', 'images'));
    }

    public function destroy(Project $project) {
        // Delete all associated images
        foreach ($project->images as $image) {
            Storage::disk('public')->delete($image->path);
        }

        $project->delete();

        return response()->json(['message' => 'Project deleted successfully']);
    }
}
```

### Step 3: Laravel Models

**Project Model:**
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $fillable = [
        'title',
        'description',
        'category',
        'link',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function images()
    {
        return $this->hasMany(ProjectImage::class);
    }

    public function services()
    {
        return $this->belongsToMany(Service::class);
    }
}
```

**ProjectImage Model:**
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProjectImage extends Model
{
    protected $fillable = ['project_id', 'path', 'url', 'order'];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}
```

### Step 4: Database Migrations

**Projects Table:**
```php
Schema::create('projects', function (Blueprint $table) {
    $table->id();
    $table->string('title');
    $table->text('description');
    $table->string('category');
    $table->string('link');
    $table->timestamps();
});
```

**Project Images Table:**
```php
Schema::create('project_images', function (Blueprint $table) {
    $table->id();
    $table->foreignId('project_id')->constrained()->onDelete('cascade');
    $table->string('path');
    $table->string('url');
    $table->integer('order')->default(0);
    $table->timestamps();
});
```

**Services Table:**
```php
Schema::create('services', function (Blueprint $table) {
    $table->id();
    $table->string('title');
    $table->text('description');
    $table->string('image_path')->nullable();
    $table->string('image_url')->nullable();
    $table->string('price');
    $table->json('features');
    $table->enum('status', ['active', 'inactive'])->default('active');
    $table->timestamps();
});
```

**Project_Service Pivot Table:**
```php
Schema::create('project_service', function (Blueprint $table) {
    $table->foreignId('project_id')->constrained()->onDelete('cascade');
    $table->foreignId('service_id')->constrained()->onDelete('cascade');
    $table->primary(['project_id', 'service_id']);
});
```

### Step 5: React Frontend Integration

Update your `/src/app/pages/Projects.tsx` `handleSubmit` function:

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (uploadedFiles.length === 0 && !editingProject) {
    toast.error("Please upload at least one image");
    return;
  }

  try {
    // Create or update project first
    const projectData = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      link: formData.link,
      services: formData.services,
    };

    let project;
    if (editingProject) {
      // Update project
      const response = await fetch(`http://yourapi.com/api/admin/projects/${editingProject.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${yourAuthToken}`
        },
        body: JSON.stringify(projectData)
      });
      project = await response.json();
    } else {
      // Create new project
      const response = await fetch('http://yourapi.com/api/admin/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${yourAuthToken}`
        },
        body: JSON.stringify(projectData)
      });
      project = await response.json();
    }

    // Upload images if any
    if (uploadedFiles.length > 0) {
      const formData = new FormData();
      uploadedFiles.forEach((file) => {
        formData.append('images[]', file);
      });

      await fetch(`http://yourapi.com/api/admin/projects/${project.id}/images`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${yourAuthToken}`
        },
        body: formData
      });
    }

    toast.success(editingProject ? "Project updated!" : "Project created!");
    // Refresh projects list
    fetchProjects();
    handleCloseModal();
  } catch (error) {
    console.error('Error:', error);
    toast.error("Something went wrong!");
  }
};
```

### Step 6: Environment Configuration

Create `.env` file in your React project:

```env
VITE_API_URL=http://localhost:8000/api
VITE_STORAGE_URL=http://localhost:8000/storage
```

Usage in code:
```typescript
const API_URL = import.meta.env.VITE_API_URL;
const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;
```

## File Storage Structure in Laravel

```
storage/
└── app/
    └── public/
        ├── projects/
        │   ├── image1.jpg
        │   └── image2.jpg
        ├── services/
        │   └── service1.jpg
        ├── sliders/
        │   └── slider1.jpg
        └── about/
            └── company.jpg
```

Don't forget to run:
```bash
php artisan storage:link
```

## Security Considerations

1. **Validate file types** on both frontend and backend
2. **Limit file sizes** (recommended: 2MB max)
3. **Sanitize filenames** to prevent directory traversal
4. **Use authentication** for all upload endpoints
5. **Implement rate limiting** to prevent abuse
6. **Scan uploaded files** for malware if possible
7. **Use HTTPS** in production

## Frontend API Service (Recommended)

Create `/src/app/services/api.ts`:

```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const api = {
  // Projects
  async getProjects() {
    const response = await fetch(`${API_URL}/admin/projects`);
    return response.json();
  },

  async createProject(data: any, images: File[]) {
    // First create project
    const response = await fetch(`${API_URL}/admin/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const project = await response.json();

    // Then upload images
    if (images.length > 0) {
      const formData = new FormData();
      images.forEach(file => formData.append('images[]', file));
      
      await fetch(`${API_URL}/admin/projects/${project.id}/images`, {
        method: 'POST',
        body: formData
      });
    }

    return project;
  },

  // Similar methods for Services, Sliders, About
};
```

## Testing

Test file uploads with:
- Different image formats (JPEG, PNG, GIF, WebP)
- Large files (should be rejected)
- Multiple files at once
- Drag and drop
- Error scenarios (network failure, validation errors)

## Next Steps

1. Complete Sliders page image upload
2. Complete About Us page image upload  
3. Implement API service layer
4. Add authentication
5. Add loading states during uploads
6. Add progress bars for uploads
7. Implement image optimization (resize, compress)
8. Add image cropping functionality

## Notes

- Currently using blob URLs for preview (temporary)
- Replace with Laravel storage URLs after upload
- Images persist only after successful backend upload
- Consider using a library like `react-dropzone` for advanced features
