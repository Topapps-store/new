# Deployment Guide for topapps.store

This guide will help you set up continuous deployment for your TopApps.store website using GitHub and Cloudflare Pages.

## Prerequisites

- A Neon PostgreSQL database (or another PostgreSQL database accessible from the internet)
- A GitHub account with access to the repository: https://github.com/Topapps-store/new
- A Cloudflare account with Pages enabled

## Step 1: Configure GitHub Repository Secrets

1. Go to your GitHub repository: https://github.com/Topapps-store/new
2. Navigate to Settings → Secrets and Variables → Actions
3. Add the following repository secrets:

| Secret Name | Description |
|-------------|-------------|
| `CLOUDFLARE_API_TOKEN` | Your Cloudflare API token with Pages:Write permissions |
| `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare account ID (found in the URL of your Cloudflare dashboard) |
| `DATABASE_URL` | The full PostgreSQL connection string for your database |
| `PGHOST` | Database host address |
| `PGUSER` | Database username |
| `PGPASSWORD` | Database password |
| `PGDATABASE` | Database name |
| `PGPORT` | Database port (usually 5432) |
| `SESSION_SECRET` | A random string to secure your session cookies |

## Step 2: Create a Cloudflare Pages Project

1. Log in to your Cloudflare dashboard
2. Navigate to Pages → Create a project → Connect to Git
3. Select your GitHub repository (Topapps-store/new)
4. Configure the project with these settings:
   - Project name: `topapps-store`
   - Production branch: `main`
   - Build command: `./build.sh`
   - Build output directory: `client/dist`
   - Environment variables: Add the same environment variables as listed in Step 1

## Step 3: Set Up Custom Domain

1. In your Cloudflare Pages project, go to the "Custom domains" tab
2. Click "Set up a custom domain"
3. Enter your domain: `topapps.store`
4. Follow the verification process
5. Make sure DNS settings are correctly pointing to Cloudflare's nameservers

## Step 4: Force HTTPS (Recommended)

1. In your Cloudflare Pages project settings, enable "Always use HTTPS"
2. For additional security, enable "Automatic HTTPS Rewrites"

## Step 5: Test Deployment

1. Push a small change to your GitHub repository's main branch
2. Go to the "Actions" tab in your GitHub repository to watch the deployment process
3. Once completed, check your Cloudflare Pages dashboard to ensure the deployment was successful
4. Visit your website at https://topapps.store to verify everything is working

## Troubleshooting

### Database Connection Issues

If your application can't connect to the database, check:

1. Your database is properly configured to accept connections from Cloudflare IPs
2. Your connection string and environment variables are correct
3. Your database is not behind a firewall that blocks Cloudflare's requests

### Deployment Failures

If your deployment fails, check:

1. GitHub Actions logs for detailed error messages
2. Ensure all required repository secrets are properly set
3. Verify your build script is working correctly

### Custom Domain Issues

If your custom domain isn't working:

1. Verify DNS settings are correctly pointing to Cloudflare
2. Check SSL/TLS certificates are issued and valid
3. Make sure your Cloudflare Pages project is properly configured with the custom domain

## Maintenance

- Regularly backup your database
- Monitor your Cloudflare and GitHub usage limits
- Keep your dependencies updated