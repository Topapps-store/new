/**
 * Script to fix Deliveroo app with authentic French content
 */

import fs from 'fs';
import path from 'path';
import gplay from 'google-play-scraper';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function fixDeliverooFrench() {
  try {
    console.log('Fixing Deliveroo with authentic French content...');
    
    // Get French content from Google Play Store
    const appInfo = await gplay.app({ 
      appId: 'com.deliveroo.orderapp',
      lang: 'fr',
      country: 'fr'
    });
    
    console.log(`French title: ${appInfo.title}`);
    console.log(`French description length: ${appInfo.description.length} characters`);
    
    // Read apps.json
    const appsJsonPath = path.join(__dirname, '../client/src/data/apps.json');
    const appsJsonContent = fs.readFileSync(appsJsonPath, 'utf8');
    const appsData = JSON.parse(appsJsonContent);
    
    // Find the Deliveroo app
    const deliverooApp = appsData.apps.find(app => 
      app.id === 'deliveroo-food-shopping' || 
      app.downloadUrl?.includes('com.deliveroo.orderapp') ||
      app.googlePlayUrl?.includes('com.deliveroo.orderapp')
    );
    
    if (!deliverooApp) {
      console.error('Deliveroo app not found in catalog');
      return;
    }
    
    console.log(`Found app: ${deliverooApp.name}`);
    
    // Update with French content
    deliverooApp.name = appInfo.title;
    deliverooApp.description = appInfo.description;
    deliverooApp.originalLanguage = 'fr';
    
    // Update other fields with latest data
    deliverooApp.rating = appInfo.score;
    deliverooApp.version = appInfo.version;
    deliverooApp.updated = formatDate(appInfo.updated);
    deliverooApp.iconUrl = appInfo.icon;
    deliverooApp.screenshots = appInfo.screenshots;
    
    // Save the updated file
    fs.writeFileSync(appsJsonPath, JSON.stringify(appsData, null, 2), 'utf8');
    
    console.log('✓ Deliveroo updated with French content:');
    console.log(`  Title: ${deliverooApp.name}`);
    console.log(`  Language: ${deliverooApp.originalLanguage}`);
    console.log(`  Description starts with: ${deliverooApp.description.substring(0, 100)}...`);
    
  } catch (error) {
    console.error('Error fixing Deliveroo:', error);
  }
}

function formatDate(date) {
  if (!date) {
    const now = new Date();
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return now.toLocaleDateString('en-US', options);
  }
  
  const dateObj = new Date(date);
  const options = { month: 'short', day: 'numeric', year: 'numeric' };
  return dateObj.toLocaleDateString('en-US', options);
}

// Run the fix
fixDeliverooFrench().catch(console.error);