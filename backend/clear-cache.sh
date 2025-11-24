#!/bin/bash

# Script to clear Strapi cache and rebuild admin panel
# This is useful when schema changes aren't reflected in the admin UI

echo "Clearing Strapi cache and build folders..."

# Remove .cache folder if it exists
if [ -d ".cache" ]; then
  echo "Removing .cache folder..."
  rm -rf .cache
fi

# Remove build folder if it exists
if [ -d "build" ]; then
  echo "Removing build folder..."
  rm -rf build
fi

# Remove dist folder if it exists
if [ -d "dist" ]; then
  echo "Removing dist folder..."
  rm -rf dist
fi

echo "Cache cleared successfully!"
echo ""
echo "Now rebuilding Strapi admin panel..."
npm run build

echo ""
echo "✅ Complete! You can now start Strapi with: npm run develop"
echo "   The admin panel should now reflect all schema changes."
