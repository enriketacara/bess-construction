# Quick Start Guide

## 🚀 Getting Started in 3 Minutes

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Run the Application
```bash
npm run dev
```

The app will open at http://localhost:3000 with **mock data** already working!

---

## 📝 Using Mock Data (Default)

The application comes with mock data pre-configured. No backend needed for testing!

**File:** `src/App.jsx`
```javascript
const USE_MOCK_DATA = true; // Already set to true
```

Just run `npm run dev` and everything works!

---

## 🔌 Connecting to Your Laravel API

### Step 1: Update API URL
In `src/App.jsx`, change:
```javascript
const API_BASE_URL = 'https://your-laravel-api.com/api';
const USE_MOCK_DATA = false; // Change to false
```

### Step 2: Ensure CORS is Configured
In your Laravel `config/cors.php`:
```php
'paths' => ['api/*'],
'allowed_origins' => ['http://localhost:3000'],
```

### Step 3: Create Required Endpoints
Your Laravel API needs these endpoints:
- `GET /api/home-slides`
- `GET /api/about`
- `GET /api/services`
- `GET /api/projects`
- `GET /api/reviews`
- `GET /api/blogs`
- `GET /api/client-logos`

See `API_GUIDE.md` for complete API documentation.

---

## 🎨 Customization

### Change Colors
Edit `src/App.css`:
```css
:root {
  --yellow: #f5bf23;  /* Your primary color */
  --black: #111;      /* Text color */
}
```

### Change Logo
In `src/App.jsx`, find:
```jsx
<a href="#home" className="logo">We<span>Build</span></a>
```

### Update Contact Info
In the contact info sidebar section of `src/App.jsx`:
```jsx
<p>+123-456-7890</p>  {/* Your phone */}
<p>info@webuild.com</p>  {/* Your email */}
```

---

## 📦 Build for Production

```bash
npm run build
```

Your production files will be in the `dist` folder.

Upload this folder to your hosting provider!

---

## 🐛 Common Issues

### Port Already in Use
If port 3000 is busy, Vite will automatically use the next available port.

### Images Not Loading
- Mock data uses free images from Unsplash and placeholder services
- For production, replace with your actual image URLs

### CORS Errors
Make sure your Laravel backend allows requests from your React app's domain.

---

## 📁 Project Structure

```
construction-react/
├── src/
│   ├── App.jsx         # Main component (edit this!)
│   ├── App.css         # All styles
│   ├── mockData.js     # Test data
│   └── main.jsx        # Entry point
├── index.html
├── package.json
└── vite.config.js
```

---

## 💡 Pro Tips

1. **Development**: Keep `USE_MOCK_DATA = true` while building
2. **Styling**: All CSS is in one file (`App.css`) for easy editing
3. **API Format**: Check `mockData.js` to see expected data structure
4. **Images**: Use absolute URLs for all images in your API

---

## 🎯 Next Steps

1. ✅ Run the app with mock data
2. ✅ Customize colors and content
3. ✅ Build your Laravel API endpoints
4. ✅ Switch to real API
5. ✅ Deploy!

---

## 📞 Need Help?

- Check `API_GUIDE.md` for API documentation
- Check `README.md` for detailed information
- Review `mockData.js` for data structure examples

---

Happy building! 🏗️
