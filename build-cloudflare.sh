#!/bin/bash

echo "Starting Cloudflare Pages build process..."

# Use Node.js LTS version (18.x)
export NODE_VERSION=18

# Asegurarnos de que existe el directorio dist/public
mkdir -p dist/public

# Build frontend app with Vite
echo "Building frontend app..."
npm run build

# Create a _headers file for security
echo "Creating security headers file..."
cat > dist/public/_headers << EOL
/*
  Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()
EOL

# Asegurarnos de que existe el archivo _routes.json para Pages Functions
echo "Creating _routes.json file for Pages Functions..."
cat > dist/public/_routes.json << EOL
{
  "version": 1,
  "include": ["/*"],
  "exclude": ["/api/*"]
}
EOL

echo "Cloudflare build completed successfully!"