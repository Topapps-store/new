#!/bin/bash

# Build frontend app with Vite
echo "Building frontend app..."
npm run build

# Create a _headers file for security
echo "Creating security headers file..."
mkdir -p dist/public/_headers
cat > dist/public/_headers << EOL
/*
  Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()
EOL

echo "Cloudflare build completed successfully!"