#!/bin/bash

# Script to clear Strapi cache, rebuild admin panel, and reset database
# This is useful when schema changes (especially enum values) aren't reflected in the admin UI

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

# Ask user if they want to reset the database (DEVELOPMENT ONLY)
echo "⚠️  For enum changes (like status field), you may also need to reset the database."
echo "   This will DELETE ALL DATA in your development database!"
read -p "Reset development database? (y/N): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
  if [ -f ".tmp/data.db" ]; then
    echo "Removing SQLite database..."
    rm -f .tmp/data.db
    echo "Database removed!"
  else
    echo "No database file found at .tmp/data.db"
  fi
fi

echo ""
echo "Now rebuilding Strapi admin panel..."
npm run build

echo ""
echo "✅ Complete! You can now start Strapi with: npm run develop"
echo "   The admin panel should now reflect all schema changes."
echo "   If you reset the database, you'll need to create a new admin user."
