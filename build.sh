#!/bin/bash

# Make script exit on first error
set -e

# Set Node.js version (ensure this matches with your project needs)
export NODE_VERSION=20

# Print status
echo "Starting build process for TopApps.store..."
echo "NODE_ENV: $NODE_ENV"

# Install dependencies
echo "Installing dependencies..."
npm install

# Build frontend app
echo "Building frontend app..."
npm run build

# Create API function for Cloudflare - we're now using the pre-built functions/api.js
echo "Preparing API function for Cloudflare..."
mkdir -p functions
# Just make sure the functions directory exists, but don't rebuild the API file
# as we now manually maintain the Cloudflare Workers code in the functions/ directory

# Create a _headers file for security
echo "Creating security headers file..."
cat > dist/public/_headers << EOL
/*
  Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  X-XSS-Protection: 1; mode=block
  Content-Security-Policy: upgrade-insecure-requests
EOL

echo "Build completed successfully!"