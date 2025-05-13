# TopApps.store

A dynamic app discovery platform leveraging advanced synchronization and intelligent recommendation technologies to provide personalized mobile application experiences.

## Deployment to Cloudflare Pages

This project is configured for deployment to Cloudflare Pages via GitHub integration.

### Prerequisites

1. A Cloudflare account
2. A GitHub account with a repository containing this code
3. Postgres database (e.g., Neon Database)

### Setting Up GitHub Repository

1. Create a new repository on GitHub
2. Push this code to your repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/topapps.git
   git push -u origin main
   ```

### Setting Up Cloudflare Pages

1. Log in to your Cloudflare dashboard
2. Navigate to Pages
3. Click "Create a project"
4. Select "Connect to Git"
5. Connect to your GitHub account and select your repository
6. Configure your build settings:
   - Framework preset: None
   - Build command: `./build.sh` 
   - Build output directory: `client/dist`
   - Root directory: `/` (default)

7. Add the following environment variables:
   - `DATABASE_URL`: Your Postgres connection string
   - `SESSION_SECRET`: A random string for session encryption
   - `NODE_VERSION`: 20

8. Click "Save and Deploy"

### Custom Domain Setup

1. After your site is deployed, go to your Pages project
2. Click on "Custom domains"
3. Add your domain (e.g., topapps.store)
4. Follow Cloudflare's instructions to verify domain ownership

### Database Migration

After deploying your app for the first time, you'll need to run database migrations:

1. Install Wrangler CLI: `npm install -g wrangler`
2. Log in to Cloudflare: `wrangler login`
3. Run the migration: `wrangler pages deployment tail --project-name topapps-store`

## Local Development

1. Clone the repository
2. Install dependencies with `npm install`
3. Create a `.env` file with the required environment variables
4. Run the development server with `npm run dev`

## Environment Variables

The following environment variables are required:

- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Secret for session encryption
- `PORT`: The port to run the server on (default: 5000)

## Project Structure

- `client/`: Frontend React application
- `server/`: Backend Express API
- `shared/`: Shared types and utilities
- `functions/`: Cloudflare Functions (serverless)
- `.cloudflare/`: Cloudflare-specific configuration
- `build.sh`: Build script for Cloudflare deployment