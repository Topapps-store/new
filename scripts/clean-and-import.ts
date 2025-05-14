import { db, sqlite } from "../server/db-sqlite";

// Lista de URLs de Google Play para las aplicaciones
const googlePlayUrls = [
  "https://play.google.com/store/apps/details?id=com.nordvpn.android",
  "https://play.google.com/store/apps/details?id=com.spothero.spothero",
  "https://play.google.com/store/apps/details?id=com.revolut.revolut",
  "https://play.google.com/store/apps/details?id=com.whatsapp.w4b",
  "https://play.google.com/store/apps/details?id=com.alibaba.aliexpresshd",
  "https://play.google.com/store/apps/details?id=com.canva.editor",
  "https://play.google.com/store/apps/details?id=com.openai.chatgpt",
  "https://play.google.com/store/apps/details?id=com.tinder",
  "https://play.google.com/store/apps/details?id=com.ashleymadison.mobile",
  "https://play.google.com/store/apps/details?id=com.taskrabbit.droid.consumer",
  "https://play.google.com/store/apps/details?id=com.zocdoc.android",
  "https://play.google.com/store/apps/details?id=net.sharewire.parkmobilev2",
  "https://play.google.com/store/apps/details?id=co.uk.ringgo.android",
  "https://play.google.com/store/apps/details?id=com.justpark.jp",
  "https://play.google.com/store/apps/details?id=com.grabtaxi.passenger",
  "https://play.google.com/store/apps/details?id=sinet.startup.inDriver",
  "https://play.google.com/store/apps/details?id=com.grability.rappi",
  "https://play.google.com/store/apps/details?id=co.bird.android",
  "https://play.google.com/store/apps/details?id=com.squareup.cash",
  "https://play.google.com/store/apps/details?id=com.dd.doordash",
  "https://play.google.com/store/apps/details?id=net.easypark.android",
  "https://play.google.com/store/apps/details?id=com.handy.handy.prod",
  "https://play.google.com/store/apps/details?id=com.instacart.shopper",
  "https://play.google.com/store/apps/details?id=com.lawnlove.customers",
  "https://play.google.com/store/apps/details?id=com.limebike",
  "https://play.google.com/store/apps/details?id=me.lyft.android",
  "https://play.google.com/store/apps/details?id=com.rinse",
  "https://play.google.com/store/apps/details?id=com.zzkko",
  "https://play.google.com/store/apps/details?id=com.Splitwise.SplitwiseMobile",
  "https://play.google.com/store/apps/details?id=com.teladoc.members",
  "https://play.google.com/store/apps/details?id=com.einnovation.temu",
  "https://play.google.com/store/apps/details?id=com.thumbtack.consumer",
  "https://play.google.com/store/apps/details?id=com.relayrides.android.relayrides",
  "https://play.google.com/store/apps/details?id=com.venmo",
  "https://play.google.com/store/apps/details?id=com.zellepay.zelle",
  "https://play.google.com/store/apps/details?id=com.grubhub.android",
  "https://play.google.com/store/apps/details?id=com.ubercab",
  "https://play.google.com/store/apps/details?id=com.facebook.katana"
];

// Categorías predefinidas
const categories = [
  { id: "social", name: "Social Media", icon: "👥", color: "#1DA1F2" },
  { id: "productivity", name: "Productivity", icon: "✅", color: "#007BFF" },
  { id: "finance", name: "Finance", icon: "💰", color: "#28A745" },
  { id: "shopping", name: "Shopping", icon: "🛍️", color: "#FD7E14" },
  { id: "travel", name: "Travel & Transport", icon: "✈️", color: "#17A2B8" },
  { id: "food", name: "Food & Delivery", icon: "🍔", color: "#DC3545" },
  { id: "entertainment", name: "Entertainment", icon: "🎬", color: "#6F42C1" },
  { id: "health", name: "Health & Fitness", icon: "💪", color: "#20C997" },
  { id: "utilities", name: "Utilities", icon: "🔧", color: "#6C757D" },
  { id: "dating", name: "Dating", icon: "❤️", color: "#E83E8C" }
];

// Mapeo de IDs de aplicaciones a categorías
const appCategories = {
  "com.nordvpn.android": "utilities",
  "com.spothero.spothero": "travel",
  "com.revolut.revolut": "finance",
  "com.whatsapp.w4b": "social",
  "com.alibaba.aliexpresshd": "shopping",
  "com.canva.editor": "productivity",
  "com.openai.chatgpt": "productivity",
  "com.tinder": "dating",
  "com.ashleymadison.mobile": "dating",
  "com.taskrabbit.droid.consumer": "productivity",
  "com.zocdoc.android": "health",
  "net.sharewire.parkmobilev2": "travel",
  "co.uk.ringgo.android": "travel",
  "com.justpark.jp": "travel",
  "com.grabtaxi.passenger": "travel",
  "sinet.startup.inDriver": "travel",
  "com.grability.rappi": "food",
  "co.bird.android": "travel",
  "com.squareup.cash": "finance",
  "com.dd.doordash": "food",
  "net.easypark.android": "travel",
  "com.handy.handy.prod": "productivity",
  "com.instacart.shopper": "food",
  "com.lawnlove.customers": "productivity",
  "com.limebike": "travel",
  "me.lyft.android": "travel",
  "com.rinse": "productivity",
  "com.zzkko": "shopping",
  "com.Splitwise.SplitwiseMobile": "finance",
  "com.teladoc.members": "health",
  "com.einnovation.temu": "shopping",
  "com.thumbtack.consumer": "productivity",
  "com.relayrides.android.relayrides": "travel",
  "com.venmo": "finance",
  "com.zellepay.zelle": "finance",
  "com.grubhub.android": "food",
  "com.ubercab": "travel",
  "com.facebook.katana": "social"
};

/**
 * Obtener el ID único para la app a partir de la URL de Google Play
 */
function getAppIdFromUrl(url: string): string {
  const regex = /id=([^&]+)/;
  const match = url.match(regex);
  if (match && match[1]) {
    return match[1];
  }
  throw new Error(`No se pudo extraer el ID de la aplicación de la URL: ${url}`);
}

/**
 * Genera un nombre para mostrar a partir del ID de la aplicación
 */
function generateDisplayName(appId: string): string {
  // Quitar prefijos comunes como "com." o "net."
  let name = appId.split('.').pop() || appId;
  
  // Convertir a formato legible
  name = name.replace(/([A-Z])/g, ' $1').trim(); // Insertar espacios antes de mayúsculas
  name = name.charAt(0).toUpperCase() + name.slice(1); // Primera letra en mayúscula
  
  return name;
}

/**
 * Inicializa la base de datos SQLite
 */
function initializeDatabase() {
  console.log("Inicializando la base de datos SQLite...");
  
  try {
    // Crear tabla de categorías
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        icon TEXT,
        color TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Crear tabla de aplicaciones
    sqlite.exec(`
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
        last_synced_at TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id)
      )
    `);
    
    console.log("✓ Base de datos inicializada correctamente");
    return true;
  } catch (error) {
    console.error("Error al inicializar la base de datos:", error);
    return false;
  }
}

/**
 * Limpia las tablas de la base de datos
 */
function cleanDatabase() {
  console.log("Limpiando la base de datos...");
  
  try {
    // Eliminar todas las apps
    sqlite.exec("DELETE FROM apps");
    console.log("✓ Tabla 'apps' limpiada correctamente");
    
    // Eliminar todas las categorías
    sqlite.exec("DELETE FROM categories");
    console.log("✓ Tabla 'categories' limpiada correctamente");
    
    return true;
  } catch (error) {
    console.error("Error al limpiar la base de datos:", error);
    return false;
  }
}

/**
 * Inserta las categorías en la base de datos
 */
function insertCategories() {
  console.log("Insertando categorías...");
  
  try {
    const stmt = sqlite.prepare(`
      INSERT INTO categories (id, name, icon, color)
      VALUES (?, ?, ?, ?)
    `);
    
    for (const category of categories) {
      stmt.run(category.id, category.name, category.icon, category.color);
      console.log(`✓ Categoría insertada: ${category.name}`);
    }
    
    return true;
  } catch (error) {
    console.error("Error al insertar categorías:", error);
    return false;
  }
}

/**
 * Inserta las aplicaciones en la base de datos
 */
function insertApps() {
  console.log("Insertando aplicaciones...");
  let appsInserted = 0;
  
  try {
    const stmt = sqlite.prepare(`
      INSERT INTO apps (
        id, name, category_id, description, icon_url, screenshots,
        rating, downloads, version, size, updated, requires,
        developer, installs, download_url, google_play_url, original_app_id
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    for (const url of googlePlayUrls) {
      try {
        const appId = getAppIdFromUrl(url);
        const uniqueId = appId.split('.').pop() || appId; // Usar la última parte como ID único
        const displayName = generateDisplayName(appId);
        const categoryId = appCategories[appId] || "utilities"; // Categoría por defecto
        
        stmt.run(
          uniqueId,
          displayName,
          categoryId,
          `${displayName} es una aplicación popular disponible en Google Play Store.`,
          `https://play-lh.googleusercontent.com/icon?id=${appId}&hl=en`,
          JSON.stringify([]),
          4.5,
          "1,000,000+",
          "Latest",
          "Varies with device",
          new Date().toISOString(),
          "Android 5.0+",
          displayName,
          "1,000,000+",
          url,
          url,
          appId
        );
        
        appsInserted++;
        console.log(`✓ App insertada: ${displayName} (${uniqueId})`);
      } catch (error) {
        console.error(`Error al procesar URL: ${url}`, error);
      }
    }
    
    console.log(`Total de aplicaciones insertadas: ${appsInserted}`);
    return appsInserted > 0;
  } catch (error) {
    console.error("Error al insertar aplicaciones:", error);
    return false;
  }
}

/**
 * Función principal
 */
function main() {
  console.log("=== INICIO DEL PROCESO DE LIMPIEZA E IMPORTACIÓN ===");
  
  // Inicializar la base de datos
  if (!initializeDatabase()) {
    console.error("No se pudo inicializar la base de datos. Abortando.");
    return;
  }
  
  // Limpiar la base de datos
  if (!cleanDatabase()) {
    console.error("No se pudo limpiar la base de datos. Abortando.");
    return;
  }
  
  // Insertar categorías
  if (!insertCategories()) {
    console.error("No se pudieron insertar las categorías. Abortando.");
    return;
  }
  
  // Insertar aplicaciones
  if (!insertApps()) {
    console.error("No se pudieron insertar las aplicaciones. Abortando.");
    return;
  }
  
  console.log("\n=== PROCESO COMPLETADO ===");
  console.log("✓ Base de datos limpiada e inicializada");
  console.log("✓ Categorías insertadas");
  console.log("✓ Aplicaciones insertadas");
  console.log("La importación se ha completado con éxito.\n");
}

// Ejecutar el script
main();