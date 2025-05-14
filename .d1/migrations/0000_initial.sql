-- Initial schema for Cloudflare D1 Database

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