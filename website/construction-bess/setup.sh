#!/bin/bash

# Construction Website React - Setup Script
# This script will set up your React application

echo "🏗️  Construction Website React - Setup"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo "✅ npm version: $(npm -v)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Setup complete!"
    echo ""
    echo "🚀 To start the development server, run:"
    echo "   npm run dev"
    echo ""
    echo "📖 Quick tips:"
    echo "   - Mock data is enabled by default (no API needed)"
    echo "   - Check QUICKSTART.md for a 3-minute guide"
    echo "   - Check API_GUIDE.md for Laravel integration"
    echo ""
    echo "🎨 Customize your site:"
    echo "   - Edit src/App.jsx for content"
    echo "   - Edit src/App.css for colors and styles"
    echo ""
else
    echo ""
    echo "❌ Setup failed!"
    echo "Please check the error messages above."
    exit 1
fi
