# Cloudflare Pages Setup for TopApps.store

This document provides detailed instructions for setting up your TopApps.store site on Cloudflare Pages.

## Required Cloudflare Secrets

When connecting your GitHub repository to Cloudflare Pages, you'll need to set up the following environment variables:

### Production Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgres://username:password@hostname:port/database` |
| `SESSION_SECRET` | Secret key for session encryption | A random string like `a1b2c3d4e5f6g7h8i9j0` |
| `NODE_VERSION` | Node.js version to use | `20` |

## GitHub Secrets

For the GitHub Actions workflow deployment, you'll need to set up the following repository secrets:

| Secret | Description | Where to Find |
|--------|-------------|--------------|
| `CLOUDFLARE_API_TOKEN` | API token for Cloudflare | [Cloudflare Dashboard → API Tokens](https://dash.cloudflare.com/profile/api-tokens) |
| `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare account ID | Found in the URL when logged into Cloudflare: `https://dash.cloudflare.com/ACCOUNT_ID` |

## Creating a Cloudflare API Token

1. Log in to your Cloudflare dashboard
2. Click on your profile icon in the top-right corner
3. Select "My Profile"
4. Click the "API Tokens" tab
5. Click "Create Token"
6. Select "Edit Cloudflare Workers" as template
7. Under "Account Resources", select your account and "Cloudflare Pages" with "Edit" permission
8. Add a token name like "GitHub Actions Deployment"
9. Click "Continue to summary" then "Create Token"
10. **Copy the token immediately** - you won't be able to see it again!

## Setting Up GitHub Secrets

1. Go to your GitHub repository
2. Click on "Settings" → "Secrets and variables" → "Actions"
3. Click "New repository secret"
4. Add the following secrets:
   - Name: `CLOUDFLARE_API_TOKEN` - Value: Your API token
   - Name: `CLOUDFLARE_ACCOUNT_ID` - Value: Your account ID

## Connecting to a Database

For the `DATABASE_URL` environment variable, we recommend using a PostgreSQL database service like:

- Neon (https://neon.tech)
- Supabase (https://supabase.com)
- Railway (https://railway.app)

Make sure your database allows connections from Cloudflare Pages (check their IP ranges).

## Setting Up Custom Domain

1. After your initial deployment, go to your Pages project
2. Click on "Custom domains"
3. Click "Set up a custom domain"
4. Enter your domain name (e.g., `topapps.store`)
5. Follow the verification process
6. Once verified, Cloudflare will automatically provision an SSL certificate

## Testing Your Deployment

After deploying, check that:

1. The site loads properly
2. API calls work correctly
3. Database connections function as expected
4. Authentication is working

## Troubleshooting

- Check Functions logs in the Cloudflare dashboard
- Verify that all environment variables are set correctly
- Ensure your database is accessible from Cloudflare's network