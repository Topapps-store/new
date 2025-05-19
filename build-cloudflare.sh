#!/bin/bash

# Script to build the static version for Cloudflare Pages deployment
echo "Starting Cloudflare Pages build process..."

# Create environment variable file for Cloudflare
echo "Creating .env file for Cloudflare..."
echo "VITE_API_BASE_URL=https://topapps-store.replit.app/api" > .env.production

# Update wrangler.toml with proper configuration
echo "Configuring wrangler.toml for Pages deployment..."
cat > wrangler.toml << EOF
# Cloudflare Pages configuration
name = "topapps-store"
compatibility_date = "2023-12-01"

[build]
command = "bash build-static.sh"
output_dir = "dist"

[site]
bucket = "./dist"
EOF

# Fix path issues in _redirects file
echo "Creating _redirects file..."
mkdir -p public
echo "/* /index.html 200" > public/_redirects

# Run the static build with our fixed configuration
echo "Building static version..."
npm run build:static

echo "Build completed successfully. Files are in the 'dist' directory."
echo "Upload these files to Cloudflare Pages for deployment."