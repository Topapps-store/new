import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Script para limpiar apps duplicadas y con idiomas incorrectos
 */

// IDs de apps que debemos eliminar (versiones en inglés de apps que ahora están en idiomas correctos)
const appsToRemove = [
  'lidl-plus',  // Versión inglesa, mantener lidl-plus-de
  'fortum-charge-drive-norway',  // Versión inglesa, mantener fortum-charge-drive-norge-no
  'fortum-charge-drive-sweden',  // Versión inglesa, mantener fortum-charge-drive-sverige-sv
  'fortum-charge-drive-finland', // Versión inglesa, mantener fortum-charge-drive-suomi-fi
];

async function cleanDuplicateApps() {
  try {
    console.log('🧹 Iniciando limpieza de apps duplicadas...');
    
    // Leer el archivo apps.json
    const appsJsonPath = path.join(__dirname, '../client/src/data/apps.json');
    const appsJsonContent = fs.readFileSync(appsJsonPath, 'utf8');
    const appsData = JSON.parse(appsJsonContent);
    
    console.log(`📊 Apps totales antes de la limpieza: ${appsData.apps.length}`);
    
    // Mostrar apps que se van a eliminar
    console.log('\n🗑️ Apps que se eliminarán:');
    appsData.apps.forEach((app, index) => {
      if (appsToRemove.includes(app.id)) {
        console.log(`  - ${app.name} (ID: ${app.id}) - Línea ~${index + 1}`);
      }
    });
    
    // Filtrar apps, eliminando las que están en la lista
    const cleanedApps = appsData.apps.filter(app => !appsToRemove.includes(app.id));
    
    console.log(`\n✅ Apps restantes después de la limpieza: ${cleanedApps.length}`);
    console.log(`🗑️ Apps eliminadas: ${appsData.apps.length - cleanedApps.length}`);
    
    // Actualizar la estructura de datos
    appsData.apps = cleanedApps;
    appsData.lastUpdated = new Date().toISOString();
    
    // Crear backup del archivo original
    const backupPath = path.join(__dirname, '../client/src/data/apps.json.backup');
    fs.writeFileSync(backupPath, appsJsonContent, 'utf8');
    console.log(`💾 Backup creado en: ${backupPath}`);
    
    // Escribir el archivo limpio
    fs.writeFileSync(
      appsJsonPath,
      JSON.stringify(appsData, null, 2),
      'utf8'
    );
    
    console.log('✅ Limpieza completada exitosamente');
    
    // Mostrar apps correctas que se mantuvieron
    console.log('\n📱 Apps correctas mantenidas:');
    const keptRelevantApps = cleanedApps.filter(app => 
      app.id.includes('lidl-plus-de') || 
      app.id.includes('fortum-charge-drive-norge-no') ||
      app.id.includes('fortum-charge-drive-sverige-sv') ||
      app.id.includes('fortum-charge-drive-suomi-fi')
    );
    
    keptRelevantApps.forEach(app => {
      console.log(`  ✓ ${app.name} (${app.originalLanguage || 'idioma detectado'}) - ID: ${app.id}`);
    });
    
  } catch (error) {
    console.error('❌ Error durante la limpieza:', error);
  }
}

// Ejecutar la limpieza
cleanDuplicateApps();