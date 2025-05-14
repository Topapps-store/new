# Setting Up Cloudflare D1 for TopApps

This guide helps you set up your TopApps application with Cloudflare D1, which is a serverless SQLite database.

## Prerequisites

- A Cloudflare account
- Cloudflare Workers CLI (Wrangler) installed: `npm install -g wrangler`
- Logged in to Wrangler: `wrangler login`

## Step 1: Create a D1 Database

1. Create a new D1 database using Wrangler:

```bash
wrangler d1 create topapps
```

This will output something like:

```
✅ Successfully created DB 'topapps' (d1xxxxxxxxxxxxxxxxxx)
```

2. Make note of the database ID (d1xxxxxxxxxxxxxxxxxx)

## Step 2: Update Configuration

1. Open `.cloudflare/d1.toml` and add your database ID:

```toml
[[d1_databases]]
binding = "DB"
database_name = "topapps"
database_id = "d1xxxxxxxxxxxxxxxxxx" # Add your ID here
```

2. Update your `wrangler.toml` to include the D1 binding:

```toml
[[d1_databases]]
binding = "DB"
database_name = "topapps"
database_id = "d1xxxxxxxxxxxxxxxxxx"
```

## Step 3: Create the Database Schema

1. Create a migration SQL file in a new `migrations` folder:

```bash
mkdir -p migrations
```

2. Create `migrations/0000_initial.sql` with the schema:

```sql
-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  is_admin INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER DEFAULT (unixepoch())
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT,
  color TEXT,
  created_at INTEGER DEFAULT (unixepoch())
);

-- Create apps table
CREATE TABLE IF NOT EXISTS apps (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category_id TEXT NOT NULL,
  description TEXT,
  icon_url TEXT,
  rating REAL DEFAULT 0,
  downloads TEXT DEFAULT '0',
  version TEXT,
  size TEXT,
  updated TEXT,
  requires TEXT,
  developer TEXT,
  installs TEXT,
  download_url TEXT,
  google_play_url TEXT,
  ios_app_store_url TEXT,
  original_app_id TEXT,
  screenshots TEXT,
  last_synced_at INTEGER,
  created_at INTEGER DEFAULT (unixepoch()),
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Create affiliate_links table
CREATE TABLE IF NOT EXISTS affiliate_links (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  app_id TEXT NOT NULL,
  url TEXT NOT NULL,
  button_text TEXT NOT NULL DEFAULT 'Download Now',
  button_color TEXT DEFAULT '#22c55e',
  label TEXT,
  clicks INTEGER DEFAULT 0,
  last_clicked_at INTEGER,
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch()),
  FOREIGN KEY (app_id) REFERENCES apps(id)
);

-- Create app_version_history table
CREATE TABLE IF NOT EXISTS app_version_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  app_id TEXT NOT NULL,
  version TEXT NOT NULL,
  release_date INTEGER DEFAULT (unixepoch()),
  change_log TEXT,
  is_notified INTEGER DEFAULT 0,
  created_at INTEGER DEFAULT (unixepoch()),
  FOREIGN KEY (app_id) REFERENCES apps(id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_apps_category_id ON apps(category_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_links_app_id ON affiliate_links(app_id);
CREATE INDEX IF NOT EXISTS idx_app_version_history_app_id ON app_version_history(app_id);
```

## Step 4: Apply Migration to D1

1. Apply the migration:

```bash
wrangler d1 migrations apply topapps --local
```

2. Once it looks good, apply to production:

```bash
wrangler d1 migrations apply topapps
```

## Step 5: Seed Initial Data (Optional)

1. Create a `seed.sql` file with initial data:

```sql
-- Add admin user (password: admin123)
INSERT INTO users (username, password, is_admin) 
VALUES ('admin', '$2b$10$X5o4mY5/o5vK5B5g5K5X5O5X5o4mY5/o5vK5B5g5K5X5O', 1);

-- Add initial categories
INSERT INTO categories (id, name, icon, color) VALUES
('social', 'Social Media', 'users', '#4A90E2'),
('entertainment', 'Entertainment', 'tv', '#F5A623'),
('productivity', 'Productivity', 'briefcase', '#7ED321'),
('finance', 'Finance', 'dollar-sign', '#50E3C2'),
('health', 'Health & Fitness', 'heart', '#D0021B'),
('travel', 'Travel', 'map', '#9013FE'),
('shopping', 'Shopping', 'shopping-cart', '#F5A623'),
('food', 'Food & Drink', 'coffee', '#8B572A'),
('sports', 'Sports', 'award', '#4A90E2'),
('communication', 'Communication', 'message-circle', '#7ED321');
```

2. Apply the seed data:

```bash
wrangler d1 execute topapps --file=seed.sql
```

## Step 6: Deploy to Cloudflare

Deploy your Workers application:

```bash
npm run deploy
```

Or use the Cloudflare Pages deployment if you've set that up.

## Managing D1 Data

- **View data**: `wrangler d1 execute topapps --command='SELECT * FROM categories'`
- **Backup database**: `wrangler d1 backup topapps ./backup.sqlite`
- **Restore database**: `wrangler d1 restore topapps ./backup.sqlite`

## Local Development

For local development, the app will use SQLite in your local file system. Make sure the `data` directory exists:

```bash
mkdir -p data
```

When you run the app locally, it will automatically use the SQLite database in `data/topapps.db`.