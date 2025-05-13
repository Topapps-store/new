#!/bin/bash

# Make script exit on first error
set -e

# Set Node.js version (ensure this matches with your project needs)
export NODE_VERSION=20

# Install dependencies
echo "Installing dependencies..."
npm install

# Build frontend app
echo "Building frontend app..."
npm run build

# Create API function for Cloudflare
echo "Creating API function for Cloudflare..."
mkdir -p functions
npx esbuild server/cloudflare.ts --platform=node --packages=external --bundle --format=esm --outfile=functions/api.js

echo "Build completed successfully!"