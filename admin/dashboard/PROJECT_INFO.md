# Admin Dashboard - Project Structure

## Overview
A modern, fully-featured admin dashboard with CRUD operations, dark/light mode, and beautiful gradient design.

## Features
- ✅ Full CRUD operations for Projects, Services, Sliders, and About Us
- ✅ **Projects with Multiple Images** - Gallery view with image carousel
- ✅ **Services Integration** - Track which services were used in each project
- ✅ Dark/Light mode toggle with smooth transitions
- ✅ Beautiful gradient color palette (Blue, Purple, Pink)
- ✅ Responsive design for mobile and desktop
- ✅ Animated backgrounds and transitions
- ✅ Modal dialogs for create/edit operations
- ✅ **Image Gallery Modal** - Full-screen gallery with navigation
- ✅ Toast notifications for user feedback
- ✅ Search functionality (including services)
- ✅ Drag and reorder for sliders
- ✅ Status toggles for services and sliders
- ✅ Custom scrollbar with gradient
- ✅ Loading states and empty states
- ✅ Icons from Lucide React
- ✅ Animations with Motion

## Tech Stack
- React 18.3.1
- React Router 7.13.0
- Tailwind CSS 4.1.12
- Motion (Framer Motion) 12.23.24
- Lucide React (Icons)
- Radix UI Components
- Next Themes (Dark mode)
- Sonner (Toast notifications)

## Pages
1. **Dashboard** (`/`) - Overview with stats and recent activity
2. **Projects** (`/projects`) - Manage project portfolio with:
   - Multiple images per project (gallery)
   - Services used in the project
   - Full-screen image gallery viewer
   - Search by services
3. **Services** (`/services`) - Manage service offerings with status toggles
4. **Sliders** (`/sliders`) - Manage homepage sliders with ordering
5. **About Us** (`/about`) - Edit company information

## Key Features Explained

### Projects with Multiple Images
Each project can have multiple images that form a gallery:
- Add unlimited images when creating/editing a project
- Click "X photos" badge to open full-screen gallery
- Navigate through images with arrow buttons
- Thumbnail strip at the bottom for quick navigation

### Services Integration
Track which services were used in each project:
- Select multiple services from checkboxes when creating/editing
- Services display as colorful badges on project cards
- Search projects by services used
- Visual connection between Projects and Services sections

## Key Components
- `Layout.tsx` - Main layout with sidebar navigation
- `AnimatedBackground.tsx` - Animated gradient orbs
- `StatsCard.tsx` - Reusable stats card with animations
- `EmptyState.tsx` - Empty state component
- `ConfirmDialog.tsx` - Confirmation dialog for destructive actions
- `LoadingSpinner.tsx` - Loading indicator
- `ServiceBadge.tsx` - Reusable service badge component

## Data Structure

### Project Data Structure
```typescript
interface Project {
  id: string;
  title: string;
  description: string;
  images: string[];        // Array of image URLs
  category: string;
  link: string;
  services: string[];      // Array of service names
}
```

## Data Management
Mock data is stored in `/src/app/data/mockData.ts`. Replace this with your actual data or connect to a backend API.

### Adding Your Own Data
To add your own projects:
1. Open `/src/app/data/mockData.ts`
2. Update the `mockProjects` array with your data
3. Add multiple image URLs to the `images` array
4. Add service names to the `services` array
5. Make sure services match those in your Services section

## Customization
### Colors
The gradient colors can be customized in the Tailwind classes:
- Primary: `from-blue-500 via-purple-500 to-pink-500`
- Secondary gradients are variations of these colors

### Theme
Dark/light mode is handled by `next-themes`. The theme toggle is in the sidebar.

### Icons
Icons can be changed by importing different icons from `lucide-react`.

### Available Services
Update the `availableServices` array in `/src/app/pages/Projects.tsx` to match your service offerings.

## Getting Started
1. The app is already set up and ready to use
2. Navigate between pages using the sidebar
3. Use the "Add" buttons to create new items
4. Click edit icons to modify existing items
5. Click trash icons to delete items
6. Toggle dark/light mode with the button in the sidebar

### Working with Project Images
1. Click "Add Project" button
2. Add multiple image URLs using the "Add Image" button
3. Each project should have at least one image
4. Click the "X photos" badge on any project to view gallery
5. Navigate through images using arrow buttons or thumbnails

### Working with Services
1. Create services in the Services section
2. When creating a project, select which services were used
3. Service badges will appear on the project card
4. Search projects by service name

## Next Steps
- Replace mock data with real data sources
- Add authentication if needed
- Connect to a backend API
- Add image upload functionality (currently uses URLs)
- Add more custom features based on your needs
- Deploy to production

Enjoy your beautiful admin dashboard! 🎉