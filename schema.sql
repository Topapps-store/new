-- Creación de tablas para TopApps

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  is_admin BOOLEAN NOT NULL DEFAULT false,
  created_at TEXT
);

-- Tabla de categorías
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT,
  color TEXT,
  created_at TEXT
);

-- Tabla de aplicaciones
CREATE TABLE IF NOT EXISTS apps (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category_id TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_url TEXT NOT NULL,
  rating REAL NOT NULL,
  downloads TEXT NOT NULL,
  version TEXT NOT NULL,
  size TEXT NOT NULL,
  updated TEXT NOT NULL,
  requires TEXT NOT NULL,
  developer TEXT NOT NULL,
  installs TEXT NOT NULL,
  download_url TEXT NOT NULL,
  google_play_url TEXT,
  ios_app_store_url TEXT,
  original_app_id TEXT,
  screenshots TEXT NOT NULL,
  is_affiliate BOOLEAN DEFAULT FALSE,
  last_synced_at TEXT,
  created_at TEXT,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Tabla de enlaces de afiliados
CREATE TABLE IF NOT EXISTS affiliate_links (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  app_id TEXT,
  label TEXT NOT NULL,
  url TEXT NOT NULL,
  button_text TEXT NOT NULL,
  button_color TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 1,
  click_count INTEGER NOT NULL DEFAULT 0,
  created_at TEXT,
  updated_at TEXT,
  FOREIGN KEY (app_id) REFERENCES apps(id)
);

-- Tabla de historial de versiones de aplicaciones
CREATE TABLE IF NOT EXISTS app_version_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  app_id TEXT NOT NULL,
  version TEXT NOT NULL,
  release_notes TEXT,
  update_date TEXT NOT NULL,
  is_notified BOOLEAN NOT NULL DEFAULT false,
  is_important BOOLEAN NOT NULL DEFAULT false,
  changes_detected BOOLEAN NOT NULL DEFAULT true,
  FOREIGN KEY (app_id) REFERENCES apps(id)
);

-- Insertar datos de ejemplo

-- Usuario administrador (contraseña: admin123)
INSERT INTO users (username, password, is_admin, created_at)
VALUES ('admin', '$2b$10$GYVLR0VLgUJIzw/LkECv7OB1.RDUU5eIYJDwpXEXK.mEQ9xR.wfoW', true, datetime('now'));

-- Categorías
INSERT OR IGNORE INTO categories (id, name, icon, color, created_at)
VALUES 
  ('social', 'Social Media', '🌐', '#4267B2', datetime('now')),
  ('utilities', 'Utilities', '🛠️', '#34C759', datetime('now')),
  ('games', 'Games', '🎮', '#E4405F', datetime('now')),
  ('productivity', 'Productivity', '📝', '#FF9500', datetime('now')),
  ('finance', 'Finance', '💰', '#30D158', datetime('now')),
  ('transportation', 'Transportation', '🚗', '#FF3B30', datetime('now')),
  ('food', 'Food & Drink', '🍔', '#FF9500', datetime('now')),
  ('travel', 'Travel', '✈️', '#5856D6', datetime('now'));

-- Aplicaciones de ejemplo
INSERT OR IGNORE INTO apps (
  id, name, category_id, description, icon_url, rating, downloads,
  version, size, updated, requires, developer, installs, download_url,
  google_play_url, ios_app_store_url, screenshots, created_at
)
VALUES 
  (
    'facebook', 
    'Facebook', 
    'social', 
    'Connect with friends, family and other people you know. Share photos and videos, send messages and get updates.',
    'https://play-lh.googleusercontent.com/ccWDU4A7fX1R24v-vvT480ySh26AYp97g1VrIB_FIdjRcuQB2JP2WdY7h_wVVAeSpg=s180-rw',
    4.2,
    '5,000,000,000+',
    '430.0.0.23.113',
    'Varies with device',
    'May 7, 2023',
    'Varies with device',
    'Meta Platforms, Inc.',
    '5,000,000,000+',
    'https://play.google.com/store/apps/details?id=com.facebook.katana',
    'https://play.google.com/store/apps/details?id=com.facebook.katana',
    'https://apps.apple.com/us/app/facebook/id284882215',
    'https://play-lh.googleusercontent.com/5pZMqQYClc5McEjaISPkvhF8pDmlbLpJJqnfkZQ7MPHnHfcrlixeBA7bMct0z9Tcx7Y=w2560-h1440 https://play-lh.googleusercontent.com/kEksOQJIb-qFLCgH0DPrwW4z2kX3Lfo5p95aVQBZw5edGU4IGyOUnYQGYXjsb2XQu_4=w2560-h1440 https://play-lh.googleusercontent.com/JbyEF8Wu-7qVDlTY-ovEVZdLHZ9h94rLJC3I2_W6zwVeFoNIbsrWCRus6PJHSSgYTA=w2560-h1440',
    datetime('now')
  ),
  (
    'whatsapp', 
    'WhatsApp Messenger', 
    'social', 
    'Simple. Reliable. Secure messaging and calling for free, available all over the world.',
    'https://play-lh.googleusercontent.com/bYtqbOcTYOlgc6gqZ2rwb8lptHuwlNE75zYJu6Bn076-hTmvd96HH-6v7S0YUAAJXoJN=s180-rw',
    4.4,
    '5,000,000,000+',
    '2.23.9.76',
    'Varies with device',
    'May 5, 2023',
    'Varies with device',
    'WhatsApp LLC',
    '5,000,000,000+',
    'https://play.google.com/store/apps/details?id=com.whatsapp',
    'https://play.google.com/store/apps/details?id=com.whatsapp',
    'https://apps.apple.com/us/app/whatsapp-messenger/id310633997',
    'https://play-lh.googleusercontent.com/wbpU1OJqPYTGDOXKjADtDJYvnDO2nZ5RHWhgTMXzgbLGrDjMcJlLb_QYJFPhEz4rLQ=w2560-h1440 https://play-lh.googleusercontent.com/Z3YsujVVMj-HM9Qid9icGGzOHCKAn3kKT1K-bOG_80pZggKA0cM-NpyQkpkIpfwgMA=w2560-h1440',
    datetime('now')
  ),
  (
    'instagram', 
    'Instagram', 
    'social', 
    'Instagram: Bring you closer to the people and things you love.',
    'https://play-lh.googleusercontent.com/VRMWkE5p3CkWhJs6nv-9ZsLAs1QOg5ob1_3qg-rckwYW7yp1fMrYZqnEFpk0IoVP4LM=w240-h480-rw',
    4.1,
    '1,000,000,000+',
    '312.0.0.38.111',
    'Varies with device',
    'May 8, 2023',
    'Varies with device',
    'Instagram, Inc.',
    '1,000,000,000+',
    'https://play.google.com/store/apps/details?id=com.instagram.android',
    'https://play.google.com/store/apps/details?id=com.instagram.android',
    'https://apps.apple.com/us/app/instagram/id389801252',
    'https://play-lh.googleusercontent.com/A_KrKr8Vdc61WGUxmPwJDeX8vSaSZ8vZaA9gJuGiQr9kQ3CG8oSz5hgcp5q5cMzgM7I=w2560-h1440 https://play-lh.googleusercontent.com/rGREXOc8Kx5KgpRWNXZtGrJT9QTz6jYlpnYQGS78Moeyg3s9kGSTrfdhYMRKzX5j4v0=w2560-h1440',
    datetime('now')
  ),
  (
    'uber', 
    'Uber', 
    'transportation', 
    'Open the Uber app and get a ride in minutes. Or sign up to drive and earn money on your schedule.',
    'https://play-lh.googleusercontent.com/AQtSF5Sl18K98wrG_I9Xbo6IDDFTJvmZz_U_TBRpTwUf7GBsXrGBWUkl5EuvbZgnym8=w240-h480-rw',
    4.3,
    '500,000,000+',
    '4.494.10001',
    'Varies with device',
    'May 1, 2023',
    'Varies with device',
    'Uber Technologies, Inc.',
    '500,000,000+',
    'https://play.google.com/store/apps/details?id=com.ubercab',
    'https://play.google.com/store/apps/details?id=com.ubercab',
    'https://apps.apple.com/us/app/uber/id368677368',
    'https://play-lh.googleusercontent.com/7wJvJGWNdT3x0jbXUGgQTQyiOUkiWO2H_b5PMf9jrW3E38iF2UmZ_KjAgp-QWPRaYbc=w2560-h1440 https://play-lh.googleusercontent.com/LvJH7i0FgCT5DOX-80kKLCvj5E8wPJzSGIFkYvvL8nwjYKjIrxWW0xPHZvwUbCQZMw=w2560-h1440',
    datetime('now')
  ),
  (
    'gmail', 
    'Gmail', 
    'productivity', 
    'The official Gmail app brings the best of Gmail to your Android phone with robust security, real-time notifications, multiple account support, and search that works across all your mail.',
    'https://play-lh.googleusercontent.com/KSuaRLiI_FlDP8cM4MzJ23ml3og5Hxb9AapaGTMZ2GgR103mvJ3AAnoOFz1yheeQBBI=w240-h480-rw',
    4.4,
    '10,000,000,000+',
    '2023.04.30.561750975',
    'Varies with device',
    'Apr 30, 2023',
    'Varies with device',
    'Google LLC',
    '10,000,000,000+',
    'https://play.google.com/store/apps/details?id=com.google.android.gm',
    'https://play.google.com/store/apps/details?id=com.google.android.gm',
    'https://apps.apple.com/us/app/gmail-email-by-google/id422689480',
    'https://play-lh.googleusercontent.com/Hq9trs6Ze-8nvliGsxJYJ6JkYdFdvQgwXQWU7HjcDFCixfdzhJ_nCk5Wuea_bt5tyw=w2560-h1440 https://play-lh.googleusercontent.com/uaAZhU0-tlnRNZtpnOTWdvz0oBCQm8wnfWBbfYQCdH9mnlf5-DhLLPQUDlI7mN9rHJk=w2560-h1440',
    datetime('now')
  ),
  (
    'doordash', 
    'DoorDash', 
    'food', 
    'Order food and grocery delivery from local restaurants and shops.',
    'https://play-lh.googleusercontent.com/xc9Hm5rlMeMQ58eHvZ6sHTCxiz2UGkTLPLlJpBC0X98h-OJ1zALnigX-4Aly5EYHyhw=w240-h480-rw',
    4.7,
    '50,000,000+',
    '15.106.8',
    'Varies with device',
    'May 4, 2023',
    'Varies with device',
    'DoorDash, Inc.',
    '50,000,000+',
    'https://play.google.com/store/apps/details?id=com.dd.doordash',
    'https://play.google.com/store/apps/details?id=com.dd.doordash',
    'https://apps.apple.com/us/app/doordash-food-delivery/id719972451',
    'https://play-lh.googleusercontent.com/Jm2D3dZjcJbHCRhUDTLSMnw5TmzkyP0B1xZPGXkmF8eNuECR6OkWgNLKFIRhXYl33w=w2560-h1440 https://play-lh.googleusercontent.com/f4w-IaNxJBUKVz_vFiB7UBOLdEzQziTVGQEXRYQeoWzT3ZIlZCMuYH_dtCGF5i-EjA=w2560-h1440',
    datetime('now')
  ),
  (
    'google_maps', 
    'Google Maps', 
    'travel', 
    'Navigate your world faster and easier with Google Maps. Over 220 countries and territories mapped and hundreds of millions of businesses and places on the map.',
    'https://play-lh.googleusercontent.com/Kf8WTct65hFJxBUDm5E-EpYsiDoLQiGGbnuyP6HBNax43YShXti9THPon1YKB6zPYpA=w240-h480-rw',
    4.2,
    '10,000,000,000+',
    'Varies with device',
    'Varies with device',
    'May 8, 2023',
    'Varies with device',
    'Google LLC',
    '10,000,000,000+',
    'https://play.google.com/store/apps/details?id=com.google.android.apps.maps',
    'https://play.google.com/store/apps/details?id=com.google.android.apps.maps',
    'https://apps.apple.com/us/app/google-maps/id585027354',
    'https://play-lh.googleusercontent.com/qDO0cZcIGPQpczYy4lCZjVYFEFrxti8SiEBSGbQOtQ-lL2JGQEKg-pUYgcxUz4Xoc7Q=w2560-h1440 https://play-lh.googleusercontent.com/zz4vEVwg6A88L9lZL0nHtP-U9RiUh7u3SaCQjmn3EGgIcI6ZKhxXvWOBgYfEIyOujA=w2560-h1440',
    datetime('now')
  ),
  (
    'amazon', 
    'Amazon Shopping', 
    'utilities', 
    'Shop millions of products and manage your account with the Amazon app.',
    'https://play-lh.googleusercontent.com/QPKtPRTJyhrYoPqYmjpYHGXjOixGPirhAXJEw7EDaJ2Bu1wYpvYXZGfocdwdO98tFNU=w240-h480-rw',
    4.2,
    '500,000,000+',
    '26.9.0.100',
    'Varies with device',
    'May 4, 2023',
    'Varies with device',
    'Amazon Mobile LLC',
    '500,000,000+',
    'https://play.google.com/store/apps/details?id=com.amazon.mShop.android.shopping',
    'https://play.google.com/store/apps/details?id=com.amazon.mShop.android.shopping',
    'https://apps.apple.com/us/app/amazon-shopping/id297606951',
    'https://play-lh.googleusercontent.com/IDbOx9uBaJt0YkLvyg1FTYf3h9gZIwyPwx7hg3d5YgNGSDgzHs9FBcOcM0BpeC4xovI=w2560-h1440 https://play-lh.googleusercontent.com/-Bp9Vvz9EcD3SzPmfKl_VvJM5nPL9vYvDtG9mVYCsUJl28iYbUPUMlZ8R06V8XfkIX8=w2560-h1440',
    datetime('now')
  );

-- Enlaces de afiliados de ejemplo
INSERT OR IGNORE INTO affiliate_links (app_id, label, url, button_text, button_color, is_active, display_order, click_count, created_at, updated_at)
VALUES 
  (
    'facebook',
    'Descarga vía Enlace de Afiliado',
    'https://example.com/affiliate/facebook',
    'Descargar Ahora',
    '#4CAF50',
    true,
    1,
    0,
    datetime('now'),
    datetime('now')
  ),
  (
    'amazon',
    'Amazon Prime - Prueba Gratuita',
    'https://example.com/affiliate/amazon-prime',
    'Prueba Prime',
    '#FF9900',
    true,
    1,
    0,
    datetime('now'),
    datetime('now')
  );

-- Historial de versiones de ejemplo
INSERT OR IGNORE INTO app_version_history (app_id, version, release_notes, update_date, is_notified, is_important, changes_detected)
VALUES 
  (
    'facebook',
    '430.0.0.23.113',
    'Mejoras de rendimiento y corrección de errores',
    datetime('now', '-1 day'),
    false,
    false,
    true
  ),
  (
    'whatsapp',
    '2.23.9.76',
    'Nuevas funciones de chat y mejoras de seguridad',
    datetime('now', '-2 day'),
    true,
    true,
    true
  );