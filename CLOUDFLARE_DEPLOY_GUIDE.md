# TopApps Cloudflare Deployment Guide

This guide explains how to deploy the TopApps application to Cloudflare Pages.

## Architecture

The TopApps application uses a "static-first" architecture:

* **Frontend**: Static site deployed on Cloudflare Pages
* **API**: Running on Replit
* **Database**: Neon PostgreSQL

This architecture leverages Cloudflare's global CDN for the frontend while maintaining stable database connections on Replit.

## Preparation Steps

Before deploying to Cloudflare Pages, ensure the following:

1. All `@/` alias imports have been converted to relative imports
   - Run `node fix-imports.cjs` to automatically fix imports

2. Environment variables are set up
   - Create `.env.production` with:
     ```
     IS_STATIC=true
     CF_PAGES=true
     NODE_VERSION=20
     ```

3. The `wrangler.toml` file is correctly configured:
   ```toml
   [site]
   bucket = "dist"

   [build]
   command = "./build-static.sh"
   output_dir = "dist"
   ```

4. The static app components are properly set up:
   - `client/src/staticApp.tsx` 
   - `client/src/context/StaticLanguageContext.tsx`
   - `client/src/data/apps.json`

## Build Process

To build the application for Cloudflare Pages:

```bash
bash build-static.sh
```

This script:
1. Creates the necessary `static-index.html` entry point
2. Runs the Vite build process with the Cloudflare-specific configuration
3. Outputs the build to the `dist` directory

## Deployment

### Option 1: Direct Upload to Cloudflare Pages

1. Log in to the Cloudflare Dashboard
2. Navigate to Pages
3. Select your project or create a new one
4. Upload the contents of the `dist` directory

### Option 2: GitHub Integration

1. Push your code to GitHub
2. In Cloudflare Dashboard, connect to your GitHub repository
3. Configure build settings:
   - Build command: `bash build-static.sh`
   - Build output directory: `dist`
   - Root directory: `/` (or where your project is located)
   - Environment variables: Set `NODE_VERSION=20`

## Troubleshooting

If you encounter issues with the deployment:

1. **Build failures**: Check the build logs for specific errors
2. **Import errors**: Run `node fix-imports.cjs` again to ensure all imports are using relative paths
3. **Static data issues**: Verify that `client/src/data/apps.json` contains valid data
4. **Environment variables**: Make sure `IS_STATIC=true` and `CF_PAGES=true` are set

## Post-Deployment

After successful deployment:

1. Set up a custom domain if needed
2. Configure Cloudflare SSL/TLS settings
3. Test the application thoroughly to ensure static data is loading correctly
4. Verify that API endpoints point to your Replit instance