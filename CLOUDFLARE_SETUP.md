# Cloudflare Pages Deployment Setup Guide

This guide walks you through setting up your TopApps project for Cloudflare Pages deployment.

## Prerequisites

1. A Cloudflare account
2. Your repository connected to Cloudflare Pages

## Setup Steps

### 1. Fix Environment Variables

In your Cloudflare Pages project settings, add these environment variables:

- `NODE_VERSION`: `20`
- `VITE_API_BASE_URL`: `https://topapps-store.replit.app/api` (replace with your actual Replit API URL)

### 2. Deployment Settings

Set the following in your Cloudflare Pages project settings:

- **Build command**: `bash build-static.sh`
- **Build output directory**: `dist`
- **Root directory**: `/` (leave as default)

### 3. Fix for 404 Errors

The 404 error you're seeing is because Cloudflare Pages needs to be configured to properly handle client-side routing.

Create a file named `_redirects` in your `public` folder with this content:

```
/* /index.html 200
```

This tells Cloudflare to serve the index.html file for all routes, allowing your React router to handle the routes client-side.

### 4. Verify Deployment

After setting up these configurations and pushing your changes:

1. Wait for the Cloudflare Pages build to complete
2. Check the build logs for any errors
3. Visit your Cloudflare Pages URL to verify the deployment works

## Troubleshooting

If you continue to see 404 errors:

1. Make sure the `_redirects` file is in the `public` folder and is being copied to the build output
2. Verify your environment variables are set correctly
3. Check the build logs for any path resolution errors

If the build fails due to path resolution errors:

1. Use the updated `vite.cloudflare.config.ts` and `build-static.sh` files
2. Make sure all imports in your components use relative paths instead of alias paths