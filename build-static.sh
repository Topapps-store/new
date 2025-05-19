#!/bin/bash

echo "Starting static build for Cloudflare Pages..."

# Create necessary directories if they don't exist
mkdir -p dist

# Create redirects file for client-side routing
echo "/* /index.html 200" > public/_redirects

# Prepare static index file
echo "Preparing files for build..."
cp -f client/index.html client/static-index.html
sed -i 's/index.tsx/index-static.tsx/g' client/static-index.html

# Fix path resolution in toast components before building
echo "Fixing component path issues..."
# Use node's path.resolve instead of URL for consistent path resolution

# Run build with Cloudflare-specific configuration
echo "Running Vite build..."
NODE_ENV=production npx vite build --config vite.cloudflare.config.ts --outDir ../dist

# Copy additional files needed in Cloudflare
echo "Copying additional files..."
cp -f public/_redirects dist/ || echo "No _redirects file to copy"

# Clean up temporary files
rm -f client/static-index.html

echo "Build completed. Files can be found in the dist/ folder"
echo "For Cloudflare Pages deployment, set the build command to: bash build-static.sh"
echo "And set NODE_VERSION=20 in your environment variables"