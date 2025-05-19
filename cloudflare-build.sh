#!/bin/bash

# This script fixes path resolution issues for Cloudflare Pages deployment

echo "Starting Cloudflare-specific build process..."

# Step 1: Ensure dist directory exists
echo "Preparing build directory..."
mkdir -p dist

# Step 2: Create a copy of the index.html with modified paths
echo "Creating static index file..."
cp -f client/index.html client/static-cloudflare.html
sed -i 's/index.tsx/index-static.tsx/g' client/static-cloudflare.html

# Step 3: Run the build with direct relative paths
echo "Starting build process with explicit paths..."
npx vite build --config vite.cloudflare.config.ts --outDir ../dist

# Step 4: Add necessary Cloudflare files
echo "Adding Cloudflare configuration files..."
echo "/* /index.html 200" > dist/_redirects

# Step 5: Clean up temporary files
echo "Cleaning up..."
rm -f client/static-cloudflare.html

echo "Build completed. Files are in the 'dist' directory."
echo "Deploy these files to Cloudflare Pages for a successful deployment."