import { db } from "../server/db";
import { apps, categories } from "../shared/schema";
import { syncAppInfo } from "../server/app-sync-service";
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
 * Asegurarse de que todas las categorías necesarias existen
 */
async function ensureCategories() {
  console.log("Verificando que todas las categorías necesarias existan...");
  
  for (const category of requiredCategories) {
    const [existingCategory] = await db.select().from(categories).where(eq(categories.id, category.id));
    
    if (!existingCategory) {
      console.log(`Creando categoría: ${category.id}`);
      await db.insert(categories).values({
        id: category.id,
        name: category.name,
        icon: "📱", // Icono predeterminado
        color: "#3B82F6" // Color predeterminado (azul)
      });
      console.log(`✓ Categoría creada: ${category.name}`);
    } else {
      console.log(`✓ Categoría ya existe: ${category.name}`);
    }
  }
  
  console.log("Verificación de categorías completada.");
}

/**
 * Procesar una aplicación: crear o actualizar y sincronizar con Google Play
 */
async function processApp(appInfo: any) {
  try {
    console.log(`Procesando aplicación: ${appInfo.id}`);
    
    // Verificar si la app ya existe
    const existingApp = await db.select().from(apps).where(eq(apps.id, appInfo.id));
    
    if (existingApp.length > 0) {
      console.log(`Actualizando aplicación existente: ${appInfo.id}`);
      
      // Actualizar la app existente
      const [updatedApp] = await db.update(apps)
        .set({
          googlePlayUrl: appInfo.googlePlayUrl,
          originalAppId: appInfo.originalAppId,
          categoryId: appInfo.categoryId,
          isAffiliate: true
        })
        .where(eq(apps.id, appInfo.id))
        .returning();
      
      if (updatedApp) {
        console.log(`✓ Aplicación actualizada: ${appInfo.id}`);
      }
    } else {
      console.log(`Creando nueva aplicación: ${appInfo.id}`);
      
      // Formatear nombre de app desde camelCase
      const formattedName = appInfo.id.charAt(0).toUpperCase() + 
        appInfo.id.slice(1).replace(/([A-Z])/g, ' $1');
      
      // Insertar la nueva app
      const [createdApp] = await db.insert(apps)
        .values({
          id: appInfo.id,
          name: formattedName,
          categoryId: appInfo.categoryId,
          description: `Descripción de ${formattedName} que se actualizará desde Google Play.`,
          iconUrl: 'https://via.placeholder.com/512',
          screenshots: [],
          rating: 0,
          downloads: '0+',
          version: '1.0.0',
          size: 'Varies',
          updated: new Date().toISOString(),
          requires: 'Android 5.0+',
          developer: 'App Developer',
          installs: '0+',
          downloadUrl: `https://topapps.store/download/${appInfo.id}`,
          googlePlayUrl: appInfo.googlePlayUrl,
          originalAppId: appInfo.originalAppId,
          isAffiliate: true
        })
        .returning();
      
      if (createdApp) {
        console.log(`✓ Aplicación creada: ${appInfo.id}`);
      }
    }
    
    // Sincronizar con Google Play Store
    console.log(`Sincronizando ${appInfo.id} con Google Play Store...`);
    const syncResult = await syncAppInfo(appInfo.id, "android");
    
    if (syncResult) {
      console.log(`✓ Sincronización exitosa para ${appInfo.id}`);
    } else {
      console.log(`✗ Error al sincronizar ${appInfo.id}`);
    }
    
    return true;
  } catch (error) {
    console.error(`Error procesando la aplicación ${appInfo.id}:`, error);
    return false;
  }
}

/**
 * Función principal
 */
async function main() {
  try {
    console.log("Iniciando importación de todas las aplicaciones...");
    
    // Asegurar que todas las categorías existan
    await ensureCategories();
    
    // Procesar todas las aplicaciones
    console.log(`Procesando ${appsToImport.length} aplicaciones...`);
    
    let successCount = 0;
    let failureCount = 0;
    
    for (const app of appsToImport) {
      try {
        const success = await processApp(app);
        if (success) {
          successCount++;
        } else {
          failureCount++;
        }
        
        // Pequeña pausa para no sobrecargar las APIs
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Error al procesar ${app.id}:`, error);
        failureCount++;
      }
    }
    
    console.log("\n=== RESUMEN DE IMPORTACIÓN ===");
    console.log(`Total de aplicaciones procesadas: ${appsToImport.length}`);
    console.log(`Aplicaciones exitosas: ${successCount}`);
    console.log(`Aplicaciones fallidas: ${failureCount}`);
    console.log("=============================\n");
    
    console.log("Proceso de importación completado.");
  } catch (error) {
    console.error("Error en el proceso principal:", error);
  }
  
  // Salir del proceso
  process.exit(0);
}

// Ejecutar la función principal
main().catch(error => {
  console.error("Error inesperado:", error);
  process.exit(1);
});