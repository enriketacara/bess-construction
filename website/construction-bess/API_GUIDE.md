# API Integration Guide for Construction Website

## Overview
This document explains how to integrate your Laravel REST API with the React construction website.

## API Configuration
Update the `API_BASE_URL` in `src/App.jsx`:
```javascript
const API_BASE_URL = 'https://your-laravel-api.com/api';
```

## Required API Endpoints

### 1. Home Slides
**Endpoint:** `GET /api/home-slides`

**Response Example:**
```json
[
  {
    "id": 1,
    "title": "we provide best service",
    "description": "Your Digital blueprint for success in the building industry.",
    "image": "https://your-api.com/images/home-slide-1.jpg"
  },
  {
    "id": 2,
    "title": "making dream come to life",
    "description": "The objective of the construction website is to effectively communicate...",
    "image": "https://your-api.com/images/home-slide-2.jpg"
  }
]
```

### 2. About Section
**Endpoint:** `GET /api/about`

**Response Example:**
```json
{
  "title": "We will provide you the best work which you dreamt for!",
  "description": "Hard workers persevere in large and small ways...",
  "video": "https://your-api.com/videos/about-vid.mp4",
  "stats": [
    {
      "value": "10+",
      "label": "years of experience"
    },
    {
      "value": "1500+",
      "label": "project completed"
    },
    {
      "value": "790+",
      "label": "satisfied clients"
    },
    {
      "value": "450+",
      "label": "active workers"
    }
  ]
}
```

### 3. Services
**Endpoint:** `GET /api/services`

**Response Example:**
```json
[
  {
    "id": 1,
    "title": "building construction",
    "description": "Building construction is a multifaceted process...",
    "image": "https://your-api.com/images/service-1.png"
  },
  {
    "id": 2,
    "title": "house renovation",
    "description": "House renovation involves updating, improving...",
    "image": "https://your-api.com/images/service-2.png"
  }
]
```

### 4. Projects
**Endpoint:** `GET /api/projects`

**Response Example:**
```json
[
  {
    "id": 1,
    "title": "Modern Villa Construction",
    "category": "Residential",
    "image": "https://your-api.com/images/project-1.jpg"
  },
  {
    "id": 2,
    "title": "Commercial Complex",
    "category": "Commercial",
    "image": "https://your-api.com/images/project-2.jpg"
  }
]
```

### 5. Reviews
**Endpoint:** `GET /api/reviews`

**Response Example:**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "text": "Working with this construction company was an absolute pleasure...",
    "rating": 5,
    "avatar": "https://your-api.com/images/pic1.jpg"
  },
  {
    "id": 2,
    "name": "Priya Roy",
    "text": "We recently completed a renovation project...",
    "rating": 5,
    "avatar": "https://your-api.com/images/pic2.jpg"
  }
]
```

### 6. Blogs
**Endpoint:** `GET /api/blogs`

**Response Example:**
```json
[
  {
    "id": 1,
    "title": "Construction Techniques",
    "description": "Articles on best practices, innovative methods...",
    "image": "https://your-api.com/images/blog-1.jpg"
  },
  {
    "id": 2,
    "title": "Project Management",
    "description": "Tips and guides for effective project planning...",
    "image": "https://your-api.com/images/blog-2.jpg"
  }
]
```

### 7. Client Logos
**Endpoint:** `GET /api/client-logos`

**Response Example:**
```json
[
  {
    "id": 1,
    "image": "https://your-api.com/images/client-logo-1.png"
  },
  {
    "id": 2,
    "image": "https://your-api.com/images/client-logo-2.png"
  }
]
```

## Laravel Backend Example

### Routes (routes/api.php)
```php
Route::get('/home-slides', [HomeSlideController::class, 'index']);
Route::get('/about', [AboutController::class, 'show']);
Route::get('/services', [ServiceController::class, 'index']);
Route::get('/projects', [ProjectController::class, 'index']);
Route::get('/reviews', [ReviewController::class, 'index']);
Route::get('/blogs', [BlogController::class, 'index']);
Route::get('/client-logos', [ClientLogoController::class, 'index']);
```

### Example Controller (HomeSlideController.php)
```php
<?php

namespace App\Http\Controllers;

use App\Models\HomeSlide;
use Illuminate\Http\Request;

class HomeSlideController extends Controller
{
    public function index()
    {
        $slides = HomeSlide::all();
        return response()->json($slides);
    }
}
```

### Example Model (HomeSlide.php)
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HomeSlide extends Model
{
    protected $fillable = ['title', 'description', 'image'];
    
    protected $hidden = ['created_at', 'updated_at'];
}
```

### Database Migration Example
```php
Schema::create('home_slides', function (Blueprint $table) {
    $table->id();
    $table->string('title');
    $table->text('description');
    $table->string('image');
    $table->timestamps();
});
```

## CORS Configuration (Laravel)
In `config/cors.php`:
```php
'paths' => ['api/*'],
'allowed_methods' => ['*'],
'allowed_origins' => ['http://localhost:3000', 'your-production-url.com'],
'allowed_headers' => ['*'],
```

## Environment Variables
Create a `.env` file in your React project:
```
VITE_API_BASE_URL=https://your-laravel-api.com/api
```

Then update App.jsx:
```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
```

## Authentication (Optional)
If you need authentication, add token handling:

```javascript
// In App.jsx
const fetchWithAuth = async (url) => {
  const token = localStorage.getItem('authToken');
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.json();
};
```

## Error Handling
The app includes basic error handling. You can enhance it:

```javascript
const fetchAllData = async () => {
  try {
    setLoading(true);
    const response = await fetch(`${API_BASE_URL}/home-slides`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    setHomeSlides(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    // Show error message to user
    setError('Failed to load data. Please try again later.');
  } finally {
    setLoading(false);
  }
};
```

## Running the Application

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Notes
- All images should be served with proper URLs from your Laravel backend
- Ensure CORS is properly configured in Laravel
- Use absolute URLs for all assets
- Consider implementing caching for better performance
- Add loading states and error boundaries for better UX
