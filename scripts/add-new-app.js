import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import gplay from 'google-play-scraper';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// The Google Play app ID to add
const appIdToAdd = "com.facebook.orca"; // Facebook Messenger

/**
 * Create a friendly app ID from app name
 */
function createAppId(appName) {
  return appName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Convert category name to ID
 */
function convertCategoryToId(category) {
  return category
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Format download count nicely
 */
function formatDownloads(installs) {
  const match = installs.match(/(\d+)[,.]?(\d*)[,.]?(\d*)\+?/);
  if (!match) return installs;
  
  let num = parseInt(match[1]);
  if (match[2]) num = num * (match[2].length === 3 ? 1000 : 100) + parseInt(match[2]);
  
  if (installs.includes('billion')) return num + 'B+';
  if (installs.includes('million')) return num + 'M+';
  if (installs.includes('thousand')) return num + 'K+';
  
  return installs;
}

/**
 * Format date nicely
 */
function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Add new app to the catalog
 */
async function addNewApp() {
  try {
    console.log(`Getting info for app: ${appIdToAdd}`);
    
    // Get app info from Google Play
    const appInfo = await gplay.app({ appId: appIdToAdd });
    
    // Format the data
    const appData = {
      id: createAppId(appInfo.title),
      name: appInfo.title,
      category: appInfo.genre,
      categoryId: convertCategoryToId(appInfo.genre),
      description: appInfo.description,
      iconUrl: appInfo.icon,
      rating: appInfo.score,
      downloads: formatDownloads(appInfo.installs),
      lastUpdated: formatDate(appInfo.updated),
      developer: appInfo.developer,
      googlePlayUrl: `https://play.google.com/store/apps/details?id=${appIdToAdd}`,
      googlePlayId: appIdToAdd,
      screenshots: appInfo.screenshots.slice(0, 5),
      price: appInfo.free ? 'Free' : appInfo.price,
      free: appInfo.free,
      androidVersion: appInfo.androidVersion,
      contentRating: appInfo.contentRating
    };
    
    // Read existing apps data
    const appsDataPath = path.join(__dirname, '..', 'apps_data.json');
    let appsData = [];
    
    if (fs.existsSync(appsDataPath)) {
      const appsDataContent = fs.readFileSync(appsDataPath, 'utf8');
      appsData = JSON.parse(appsDataContent);
    }
    
    // Check if app already exists
    const existingAppIndex = appsData.findIndex(app => app.googlePlayId === appIdToAdd);
    
    if (existingAppIndex !== -1) {
      // Update existing app
      appsData[existingAppIndex] = appData;
      console.log(`Updated existing app: ${appData.name}`);
    } else {
      // Add new app
      appsData.push(appData);
      console.log(`Added new app: ${appData.name}`);
    }
    
    // Save updated data
    fs.writeFileSync(appsDataPath, JSON.stringify(appsData, null, 2), 'utf8');
    console.log('App catalog updated successfully!');
    
  } catch (error) {
    console.error('Error adding app:', error);
  }
}

// Run the script
addNewApp();