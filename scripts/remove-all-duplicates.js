import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Script para identificar y eliminar TODAS las apps duplicadas
 */

async function removeAllDuplicates() {
  try {
    console.log('🔍 Identificando apps duplicadas...');
    
    // Leer el archivo apps.json
    const appsJsonPath = path.join(__dirname, '../client/src/data/apps.json');
    const appsJsonContent = fs.readFileSync(appsJsonPath, 'utf8');
    const appsData = JSON.parse(appsJsonContent);
    
    console.log(`📊 Apps totales: ${appsData.apps.length}`);
    
    // Identificar duplicados
    const idCount = {};
    const duplicates = [];
    
    appsData.apps.forEach((app, index) => {
      if (idCount[app.id]) {
        idCount[app.id].push({ index, app });
      } else {
        idCount[app.id] = [{ index, app }];
      }
    });
    
    // Encontrar IDs duplicados
    Object.keys(idCount).forEach(id => {
      if (idCount[id].length > 1) {
        duplicates.push({
          id,
          instances: idCount[id]
        });
      }
    });
    
    if (duplicates.length === 0) {
      console.log('✅ No se encontraron apps duplicadas');
      return;
    }
    
    console.log(`\n🚨 Encontradas ${duplicates.length} apps duplicadas:`);
    
    const indicesToRemove = [];
    
    duplicates.forEach(duplicate => {
      console.log(`\n📱 ID duplicado: ${duplicate.id}`);
      duplicate.instances.forEach((instance, idx) => {
        const hasOriginalLanguage = instance.app.originalLanguage;
        const hasCorrectUrl = instance.app.downloadUrl && 
          (instance.app.downloadUrl.includes('hl=de') || 
           instance.app.downloadUrl.includes('hl=no') || 
           instance.app.downloadUrl.includes('hl=sv') || 
           instance.app.downloadUrl.includes('hl=fi') || 
           !instance.app.downloadUrl.includes('hl=en'));
        
        console.log(`  ${idx + 1}. Índice ${instance.index}: ${instance.app.name}`);
        console.log(`     - originalLanguage: ${instance.app.originalLanguage || 'NO'}`);
        console.log(`     - URL: ${instance.app.downloadUrl?.substring(0, 80)}...`);
        
        // Mantener la versión con idioma original O la primera si todas son iguales
        if (idx > 0 && (!hasOriginalLanguage || instance.app.downloadUrl?.includes('hl=en'))) {
          console.log(`     ❌ MARCAR PARA ELIMINAR (duplicado inferior)`);
          indicesToRemove.push(instance.index);
        } else {
          console.log(`     ✅ MANTENER`);
        }
      });
    });
    
    if (indicesToRemove.length === 0) {
      console.log('\n✅ No hay duplicados para eliminar');
      return;
    }
    
    // Crear backup
    const backupPath = path.join(__dirname, '../client/src/data/apps.json.backup-duplicates');
    fs.writeFileSync(backupPath, appsJsonContent, 'utf8');
    console.log(`\n💾 Backup creado en: ${backupPath}`);
    
    // Eliminar duplicados (ordenar índices de mayor a menor para no afectar posiciones)
    indicesToRemove.sort((a, b) => b - a);
    
    console.log(`\n🗑️ Eliminando ${indicesToRemove.length} apps duplicadas...`);
    indicesToRemove.forEach(index => {
      const removedApp = appsData.apps[index];
      console.log(`  - Eliminando: ${removedApp.name} (${removedApp.id})`);
      appsData.apps.splice(index, 1);
    });
    
    // Actualizar metadatos
    appsData.lastUpdated = new Date().toISOString();
    
    // Escribir archivo limpio
    fs.writeFileSync(
      appsJsonPath,
      JSON.stringify(appsData, null, 2),
      'utf8'
    );
    
    console.log(`\n✅ Proceso completado`);
    console.log(`📊 Apps restantes: ${appsData.apps.length}`);
    console.log(`🗑️ Apps eliminadas: ${indicesToRemove.length}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Ejecutar
removeAllDuplicates();