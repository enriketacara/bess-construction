# Construction Website - React Version

A modern, fully responsive React construction website that fetches data from a Laravel REST API. This is a complete conversion of the original HTML/CSS website to React with API integration.

## Features

- ✨ Fully responsive design
- 🎨 Exact replica of original design
- 🚀 Built with React + Vite
- 📱 Mobile-first approach
- 🎯 Swiper.js for smooth sliders
- 💫 Framer Motion animations (cute + modern)
- 🫧 Glass / blur popovers & overlay drawer
- 🔌 REST API integration ready
- ⚡ Fast performance with Vite
- 🎨 Modern ES6+ JavaScript
- 📦 Easy to deploy

## Design Elements

- **Header**: Sticky navigation with search, login forms, and contact info sidebar
- **Home**: Full-width slider with beautiful transitions
- **About**: Video section with company statistics
- **Services**: Grid layout showcasing all services
- **Projects**: Portfolio gallery with hover effects
- **Reviews**: Client testimonials slider
- **Contact**: Google Maps integration with contact form
- **Blogs**: Latest updates and articles
- **Partners**: Client logo carousel

## Tech Stack

- React 18
- Vite
- Swiper.js
- Framer Motion
- Font Awesome Icons
- CSS3 with modern features

## Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd construction-react
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure API**
Update the API_BASE_URL in `src/App.jsx`:
```javascript
const API_BASE_URL = 'https://your-laravel-api.com/api';
```

4. **Run development server**
```bash
npm run dev
```

The application will open at `http://localhost:3000`

## Building for Production

```bash
npm run build
```

The optimized files will be in the `dist` folder.

## API Integration

This application expects a Laravel backend with the following endpoints:

- `GET /api/home-slides` - Home slider data
- `GET /api/about` - About section data
- `GET /api/services` - Services list
- `GET /api/projects` - Projects portfolio
- `GET /api/reviews` - Client reviews
- `GET /api/blogs` - Blog posts
- `GET /api/client-logos` - Partner logos

See `API_GUIDE.md` for detailed API documentation and Laravel backend examples.

## Project Structure

```
construction-react/
├── src/
│   ├── App.jsx          # Main application component
│   ├── App.css          # All styles (exact replica of original)
│   ├── components/
│   │   ├── Reveal.jsx    # On-scroll reveal utility
│   │   └── BackToTop.jsx # Floating back-to-top button
│   └── main.jsx         # Entry point
├── index.html           # HTML template
├── package.json         # Dependencies
├── vite.config.js       # Vite configuration
├── API_GUIDE.md         # API integration guide
└── README.md            # This file
```

## Features Breakdown

### Header
- Sticky navigation
- Mobile hamburger menu
- Search form (toggleable)
- Login form (toggleable)
- Contact info sidebar

### Sections
1. **Home Slider**: Auto-playing slides with navigation
2. **About**: Video showcase with stats grid
3. **Services**: Responsive service cards
4. **Projects**: Image gallery with categories
5. **Reviews**: Customer testimonials slider
6. **Contact**: Map integration + contact form
7. **Blogs**: Article cards with images
8. **Logos**: Partner carousel

## Customization

### Colors
Edit the CSS variables in `src/App.css`:
```css
:root {
  --yellow: #f5bf23;
  --black: #111;
  --white: #fff;
  --light-color: #666;
  --light-bg: #eee;
}
```

### API Endpoint
Change the base URL in `src/App.jsx`:
```javascript
const API_BASE_URL = 'https://your-api.com/api';
```

### Font
The project uses Poppins from Google Fonts. To change:
```css
@import url("https://fonts.googleapis.com/css2?family=YourFont:wght@100;200;300;400;500;600&display=swap");
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- Optimized images
- Lazy loading
- Code splitting
- CSS minification
- Tree shaking

## Deployment

### Netlify
```bash
npm run build
# Upload dist folder to Netlify
```

### Vercel
```bash
npm run build
vercel --prod
```

### Traditional Hosting
```bash
npm run build
# Upload contents of dist/ folder to your web server
```

## Environment Variables

Create a `.env` file for environment-specific settings:
```
VITE_API_BASE_URL=https://your-api.com/api
```

## Troubleshooting

### CORS Issues
Ensure your Laravel backend has CORS properly configured:
```php
// config/cors.php
'paths' => ['api/*'],
'allowed_origins' => ['http://localhost:3000'],
```

### Images Not Loading
- Check API URLs are absolute
- Verify image paths in API responses
- Check CORS headers for images

## Contributing

Feel free to submit issues and pull requests!

## License

MIT License

## Credits

- Original Design: [Construction Website]
- Converted to React: Your Name
- Icons: Font Awesome
- Slider: Swiper.js

## Support

For support, email: your-email@example.com

---

Made with ❤️ using React + Vite
