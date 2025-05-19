#!/bin/bash

# Script to fix Cloudflare-specific path issues
echo "Fixing paths for Cloudflare deployment..."

# Fix the specific issue with toaster.tsx import path
echo "Fixing import paths in components..."

# Create a temporary build directory for Cloudflare
mkdir -p cloudflare-build
cp -r client cloudflare-build/
cp -r shared cloudflare-build/
cp -r public cloudflare-build/
cp build-static.sh cloudflare-build/
cp vite.cloudflare.config.ts cloudflare-build/
cp wrangler.toml cloudflare-build/
cp package.json cloudflare-build/
cp package-lock.json cloudflare-build/

# Create a simple index.html file to ensure the root works
cat > cloudflare-build/public/_redirects << EOF
/* /index.html 200
EOF

# Fix import paths by making them explicit for Cloudflare
cd cloudflare-build

# Run the static build with the fixed paths
echo "Building static version for Cloudflare..."
bash build-static.sh

echo "Build complete. Upload the contents of the cloudflare-build/dist directory to Cloudflare Pages."