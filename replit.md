# TopApps.store - Replit Configuration

## Overview

TopApps.store is a multilingual app discovery platform that combines a React frontend with an Express.js backend. The application offers a curated catalog of mobile applications with features like automatic translations, affiliate link management, and admin dashboard functionality.

The system is designed with a "static-first" architecture that can operate both with a PostgreSQL database (for full functionality) and as a static site (for deployment to platforms like Cloudflare Pages).

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite with custom configurations for different deployment targets
- **UI Library**: Radix UI components with Tailwind CSS styling
- **State Management**: TanStack Query for server state, React Context for app state
- **Routing**: Client-side routing with React Router
- **Translation**: Google Translate integration with automatic language detection

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL (Neon Database) with Drizzle ORM
- **Authentication**: Session-based auth with bcrypt password hashing
- **File Uploads**: Multer for handling image uploads
- **External APIs**: Google Play Scraper, App Store Scraper, DeepL API

### Data Storage Solutions
- **Primary Database**: Neon PostgreSQL for production data
- **Static Data**: JSON files for apps and categories when running in static mode
- **Session Storage**: Express sessions with configurable security settings
- **File Storage**: Local filesystem for uploaded assets

## Key Components

### Core Services
1. **Data Service**: Unified abstraction layer that works with both database and static data
2. **Translation Service**: Handles text translations using DeepL API
3. **App Sync Service**: Synchronizes app data from Google Play and App Store
4. **Storage Service**: Database operations abstraction layer

### Authentication & Authorization
- Session-based authentication with secure cookie configuration
- Role-based access control (admin/user roles)
- Protected routes for administrative functions
- CSRF protection and security headers

### Admin Dashboard
- App management (create, update, delete)
- Category management
- Affiliate link management with click tracking
- Bulk operations and data synchronization tools

## Data Flow

### App Discovery Flow
1. User visits the platform
2. Language is auto-detected from browser preferences
3. Apps are loaded from database or static JSON
4. Content is translated via Google Translate if needed
5. Apps are displayed with category filtering and search

### Admin Management Flow
1. Admin logs in through secure authentication
2. Dashboard loads with management interfaces
3. Admin can perform CRUD operations on apps/categories
4. Changes are synchronized with external app stores
5. Analytics and click tracking data is available

### Data Synchronization Flow
1. Scheduled jobs sync app data from Google Play/App Store
2. New app information updates existing records
3. Version histories are tracked for change management
4. Static JSON files are regenerated for static deployments

## External Dependencies

### APIs & Services
- **Neon Database**: PostgreSQL hosting service
- **DeepL API**: Professional translation service
- **Google Play Scraper**: App store data extraction
- **App Store Scraper**: iOS app data extraction

### Build & Deployment Tools
- **Vite**: Frontend build tool with multiple configurations
- **Drizzle**: Type-safe database ORM and migration tool
- **ESBuild**: Backend bundling for production builds

### UI & Styling
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn/ui**: Pre-built component library

## Deployment Strategy

### Multi-Target Deployment
The application supports three deployment scenarios:

1. **Full Stack (Replit)**: Complete application with database
2. **Static Frontend + API Backend**: Frontend on Cloudflare Pages, API on Replit
3. **Fully Static**: Static site deployment without backend dependencies

### Environment Configurations
- **Development**: Uses Vite dev server with hot reload
- **Production**: Optimized builds with different configurations per target
- **Static**: Special build process that generates standalone static files

### Build Scripts
- `build.sh`: Full production build with database migrations
- `build-static.sh`: Static site generation for Cloudflare Pages
- `build-cloudflare.sh`: Cloudflare-specific optimizations

## Changelog
- June 16, 2025: Initial setup
- June 16, 2025: Implemented automatic language detection for app URLs - system now extracts content in original language from App Store (/fr/, /es/, etc.) and Google Play (&hl=fr) URLs. Fixed 18 French apps that were incorrectly processed in English, now displaying authentic French content for French market targeting.

## User Preferences

Preferred communication style: Simple, everyday language.