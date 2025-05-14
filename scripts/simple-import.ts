import { db, sqlite } from "../server/db-sqlite";
import * as schema from "../shared/schema-sqlite";
import { eq } from "drizzle-orm";

// Lista completa de aplicaciones a importar
const appsToImport = [
  { id: "nordvpn", googlePlayUrl: "https://play.google.com/store/apps/details?id=com.nordvpn.android", originalAppId: "com.nordvpn.android", categoryId: "utilities" },
  { id: "spothero", googlePlayUrl: "https://play.google.com/store/apps/details?id=com.spothero.spothero", originalAppId: "com.spothero.spothero", categoryId: "travel" },
  { id: "revolut", googlePlayUrl: "https://play.google.com/store/apps/details?id=com.revolut.revolut", originalAppId: "com.revolut.revolut", categoryId: "finance" },
  { id: "whatsappbusiness", googlePlayUrl: "https://play.google.com/store/apps/details?id=com.whatsapp.w4b", originalAppId: "com.whatsapp.w4b", categoryId: "business" },
  { id: "aliexpress", googlePlayUrl: "https://play.google.com/store/apps/details?id=com.alibaba.aliexpresshd", originalAppId: "com.alibaba.aliexpresshd", categoryId: "shopping" },
  { id: "canva", googlePlayUrl: "https://play.google.com/store/apps/details?id=com.canva.editor", originalAppId: "com.canva.editor", categoryId: "productivity" },
  { id: "chatgpt", googlePlayUrl: "https://play.google.com/store/apps/details?id=com.openai.chatgpt", originalAppId: "com.openai.chatgpt", categoryId: "productivity" },
  { id: "tinder", googlePlayUrl: "https://play.google.com/store/apps/details?id=com.tinder", originalAppId: "com.tinder", categoryId: "dating" },
  { id: "ashleymadison", googlePlayUrl: "https://play.google.com/store/apps/details?id=com.ashleymadison.mobile", originalAppId: "com.ashleymadison.mobile", categoryId: "dating" },
  { id: "taskrabbit", googlePlayUrl: "https://play.google.com/store/apps/details?id=com.taskrabbit.droid.consumer", originalAppId: "com.taskrabbit.droid.consumer", categoryId: "productivity" },
  { id: "zocdoc", googlePlayUrl: "https://play.google.com/store/apps/details?id=com.zocdoc.android", originalAppId: "com.zocdoc.android", categoryId: "health" },
  { id: "parkmobile", googlePlayUrl: "https://play.google.com/store/apps/details?id=net.sharewire.parkmobilev2", originalAppId: "net.sharewire.parkmobilev2", categoryId: "travel" },
  { id: "ringgo", googlePlayUrl: "https://play.google.com/store/apps/details?id=co.uk.ringgo.android", originalAppId: "co.uk.ringgo.android", categoryId: "travel" },
  { id: "justpark", googlePlayUrl: "https://play.google.com/store/apps/details?id=com.justpark.jp", originalAppId: "com.justpark.jp", categoryId: "travel" },
  { id: "grab", googlePlayUrl: "https://play.google.com/store/apps/details?id=com.grabtaxi.passenger", originalAppId: "com.grabtaxi.passenger", categoryId: "travel" },
  { id: "indrive", googlePlayUrl: "https://play.google.com/store/apps/details?id=sinet.startup.inDriver", originalAppId: "sinet.startup.inDriver", categoryId: "travel" },
  { id: "rappi", googlePlayUrl: "https://play.google.com/store/apps/details?id=com.grability.rappi", originalAppId: "com.grability.rappi", categoryId: "food" },
  { id: "bird", googlePlayUrl: "https://play.google.com/store/apps/details?id=co.bird.android", originalAppId: "co.bird.android", categoryId: "travel" },
  { id: "cashapp", googlePlayUrl: "https://play.google.com/store/apps/details?id=com.squareup.cash", originalAppId: "com.squareup.cash", categoryId: "finance" },
  { id: "doordash", googlePlayUrl: "https://play.google.com/store/apps/details?id=com.dd.doordash", originalAppId: "com.dd.doordash", categoryId: "food" },
  { id: "easypark", googlePlayUrl: "https://play.google.com/store/apps/details?id=net.easypark.android", originalAppId: "net.easypark.android", categoryId: "travel" },
  { id: "handy", googlePlayUrl: "https://play.google.com/store/apps/details?id=com.handy.handy.prod", originalAppId: "com.handy.handy.prod", categoryId: "productivity" },
  { id: "instacart", googlePlayUrl: "https://play.google.com/store/apps/details?id=com.instacart.shopper", originalAppId: "com.instacart.shopper", categoryId: "food" },
  { id: "lawnlove", googlePlayUrl: "https://play.google.com/store/apps/details?id=com.lawnlove.customers", originalAppId: "com.lawnlove.customers", categoryId: "productivity" },
  { id: "lime", googlePlayUrl: "https://play.google.com/store/apps/details?id=com.limebike", originalAppId: "com.limebike", categoryId: "travel" },
  { id: "lyft", googlePlayUrl: "https://play.google.com/store/apps/details?id=me.lyft.android", originalAppId: "me.lyft.android", categoryId: "travel" },
  { id: "rinse", googlePlayUrl: "https://play.google.com/store/apps/details?id=com.rinse", originalAppId: "com.rinse", categoryId: "productivity" },
  { id: "shein", googlePlayUrl: "https://play.google.com/store/apps/details?id=com.zzkko", originalAppId: "com.zzkko", categoryId: "shopping" },
  { id: "splitwise", googlePlayUrl: "https://play.google.com/store/apps/details?id=com.Splitwise.SplitwiseMobile", originalAppId: "com.Splitwise.SplitwiseMobile", categoryId: "finance" },
  { id: "teladoc", googlePlayUrl: "https://play.google.com/store/apps/details?id=com.teladoc.members", originalAppId: "com.teladoc.members", categoryId: "health" },
  { id: "temu", googlePlayUrl: "https://play.google.com/store/apps/details?id=com.einnovation.temu", originalAppId: "com.einnovation.temu", categoryId: "shopping" },
  { id: "thumbtack", googlePlayUrl: "https://play.google.com/store/apps/details?id=com.thumbtack.consumer", originalAppId: "com.thumbtack.consumer", categoryId: "productivity" },
  { id: "turo", googlePlayUrl: "https://play.google.com/store/apps/details?id=com.relayrides.android.relayrides", originalAppId: "com.relayrides.android.relayrides", categoryId: "travel" },
  { id: "venmo", googlePlayUrl: "https://play.google.com/store/apps/details?id=com.venmo", originalAppId: "com.venmo", categoryId: "finance" },
  { id: "zelle", googlePlayUrl: "https://play.google.com/store/apps/details?id=com.zellepay.zelle", originalAppId: "com.zellepay.zelle", categoryId: "finance" },
  { id: "grubhub", googlePlayUrl: "https://play.google.com/store/apps/details?id=com.grubhub.android", originalAppId: "com.grubhub.android", categoryId: "food" },
  { id: "uber", googlePlayUrl: "https://play.google.com/store/apps/details?id=com.ubercab", originalAppId: "com.ubercab", categoryId: "travel" },
  { id: "facebook", googlePlayUrl: "https://play.google.com/store/apps/details?id=com.facebook.katana", originalAppId: "com.facebook.katana", categoryId: "social" }
];

// Lista de categorías necesarias
const requiredCategories = [
  { id: "utilities", name: "Utilities" },
  { id: "travel", name: "Travel & Transportation" },
  { id: "finance", name: "Finance" },
  { id: "business", name: "Business" },
  { id: "shopping", name: "Shopping" },
  { id: "productivity", name: "Productivity" },
  { id: "dating", name: "Dating" },
  { id: "health", name: "Health & Fitness" },
  { id: "food", name: "Food & Delivery" },
  { id: "social", name: "Social Media" }
];

/**
 * Inicializa la base de datos creando las tablas necesarias
 */
function initializeDatabase() {
  console.log("Inicializando base de datos SQLite...");
  
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
 * Función principal para la importación
 */
async function main() {
  try {
    console.log("Iniciando importación simple de categorías y aplicaciones...");
    
    // Inicializar la base de datos
    const dbInitialized = initializeDatabase();
    if (!dbInitialized) {
      console.error("No se pudo inicializar la base de datos. Terminando el proceso.");
      return;
    }
    
    // Paso 1: Importar categorías
    console.log("Importando categorías...");
    for (const category of requiredCategories) {
      try {
        // Verificar si la categoría ya existe usando SQL puro
        const existingCategory = sqlite.prepare(`SELECT id FROM categories WHERE id = ?`).get(category.id);
        
        if (!existingCategory) {
          // Crear nueva categoría
          console.log(`Creando categoría: ${category.name}`);
          sqlite.prepare(`
            INSERT INTO categories (id, name, icon, color) 
            VALUES (?, ?, ?, ?)
          `).run(category.id, category.name, "📱", "#3B82F6");
          console.log(`✓ Categoría creada: ${category.name}`);
        } else {
          console.log(`✓ Categoría ya existe: ${category.name}`);
        }
      } catch (error) {
        console.error(`Error al procesar categoría ${category.id}:`, error);
      }
    }
    
    // Paso 2: Importar aplicaciones
    console.log("\nImportando aplicaciones...");
    let appCount = 0;
    
    for (const app of appsToImport) {
      try {
        // Verificar si la app ya existe
        const existingApp = sqlite.prepare(`SELECT id FROM apps WHERE id = ?`).get(app.id);
        
        // Formatear el nombre de la app si es necesario
        const formattedName = app.id.charAt(0).toUpperCase() + 
          app.id.slice(1).replace(/([A-Z])/g, ' $1');
        
        if (!existingApp) {
          // Crear nueva app
          console.log(`Creando app: ${formattedName}`);
          sqlite.prepare(`
            INSERT INTO apps (
              id, name, category_id, description, icon_url, screenshots, 
              rating, downloads, version, size, updated, requires, 
              developer, installs, download_url, google_play_url, original_app_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).run(
            app.id,
            formattedName,
            app.categoryId,
            `Official app for ${formattedName}. Download now from the Google Play Store.`,
            `https://play-lh.googleusercontent.com/icon?id=${app.originalAppId}&hl=en`,
            JSON.stringify([]),
            4.5, // Valor predeterminado
            "1,000,000+",
            "Latest",
            "Varies with device",
            new Date().toISOString(),
            "Android 5.0+",
            formattedName,
            "1,000,000+",
            app.googlePlayUrl,
            app.googlePlayUrl,
            app.originalAppId
          );
          appCount++;
          console.log(`✓ App creada: ${formattedName}`);
        } else {
          // Actualizar la app existente
          console.log(`Actualizando app: ${formattedName}`);
          sqlite.prepare(`
            UPDATE apps 
            SET category_id = ?, google_play_url = ?, original_app_id = ? 
            WHERE id = ?
          `).run(
            app.categoryId,
            app.googlePlayUrl,
            app.originalAppId,
            app.id
          );
          appCount++;
          console.log(`✓ App actualizada: ${formattedName}`);
        }
      } catch (error) {
        console.error(`Error al procesar app ${app.id}:`, error);
      }
    }
    
    console.log(`\nImportación completada. ${appCount} apps procesadas.`);
  } catch (error) {
    console.error("Error en el proceso de importación:", error);
  }
}

// Ejecutar la importación
main()
  .then(() => {
    console.log("Proceso finalizado");
    process.exit(0);
  })
  .catch(error => {
    console.error("Error fatal:", error);
    process.exit(1);
  });