#!/bin/bash

# Make script exit on first error
set -e

# Set Node.js version (ensure this matches with your project needs)
export NODE_VERSION=20

# Print status
echo "Starting build process for TopApps.store..."
echo "NODE_ENV: $NODE_ENV"

# Check for database environment variables
if [ -z "$DATABASE_URL" ]; then
  echo "Warning: DATABASE_URL is not set. This might cause issues with database connections."
else
  echo "Database configuration detected."
fi

# Install dependencies
echo "Installing dependencies..."
npm install

# Run database migrations if needed (only in production)
if [ "$NODE_ENV" = "production" ] && [ ! -z "$DATABASE_URL" ]; then
  echo "Running database migrations..."
  # Now we're actually running migrations in production
  npx drizzle-kit push:pg
fi

# Build frontend app
echo "Building frontend app..."
npm run build

# Create API function for Cloudflare
echo "Creating API function for Cloudflare..."
mkdir -p functions
npx esbuild server/cloudflare.ts --platform=node --packages=external --bundle --format=esm --outfile=functions/api.js

# Create a _headers file for security
echo "Creating security headers file..."
mkdir -p dist/public
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