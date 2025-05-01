import { db } from '../server/db';
import { sql } from 'drizzle-orm';
import { log } from '../server/vite';

async function migrateAffiliateLinks() {
  try {
    log('Starting affiliate links migration...', 'migration');
    
    // Create the affiliate_links table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS affiliate_links (
        id SERIAL PRIMARY KEY,
        app_id VARCHAR(100) REFERENCES apps(id),
        label VARCHAR(100) NOT NULL,
        url VARCHAR(255) NOT NULL,
        button_text VARCHAR(100) NOT NULL DEFAULT 'Download Now',
        button_color VARCHAR(50) NOT NULL DEFAULT '#4CAF50',
        is_active BOOLEAN NOT NULL DEFAULT true,
        display_order INTEGER NOT NULL DEFAULT 1,
        click_count INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Add popular apps to the database if they don't exist already
    const popularApps = [
      { id: 'uber', name: 'Uber', categoryId: 'travel' },
      { id: 'lyft', name: 'Lyft', categoryId: 'travel' },
      { id: 'turo', name: 'Turo', categoryId: 'travel' },
      { id: 'bird', name: 'Bird', categoryId: 'travel' },
      { id: 'lime', name: 'Lime', categoryId: 'travel' },
      { id: 'easypark', name: 'EasyPark', categoryId: 'travel' },
      { id: 'parkmobile', name: 'ParkMobile', categoryId: 'travel' },
      { id: 'spothero', name: 'SpotHero', categoryId: 'travel' },
      { id: 'paybyphone', name: 'PayByPhone', categoryId: 'finance' },
      { id: 'parkwhiz', name: 'ParkWhiz', categoryId: 'travel' },
      { id: 'doordash', name: 'DoorDash', categoryId: 'food' },
      { id: 'grubhub', name: 'Grubhub', categoryId: 'food' },
      { id: 'ubereats', name: 'Uber Eats', categoryId: 'food' },
      { id: 'instacart', name: 'Instacart', categoryId: 'shopping' },
      { id: 'cashapp', name: 'Cash App', categoryId: 'finance' },
      { id: 'venmo', name: 'Venmo', categoryId: 'finance' },
      { id: 'zelle', name: 'Zelle', categoryId: 'finance' },
      { id: 'taskrabbit', name: 'TaskRabbit', categoryId: 'productivity' },
      { id: 'thumbtack', name: 'Thumbtack', categoryId: 'productivity' },
      { id: 'handy', name: 'Handy', categoryId: 'productivity' },
      { id: 'teladoc', name: 'Teladoc Health', categoryId: 'health' },
      { id: 'zocdoc', name: 'Zocdoc', categoryId: 'health' },
      { id: 'temu', name: 'Temu', categoryId: 'shopping' },
      { id: 'shein', name: 'Shein', categoryId: 'shopping' },
      { id: 'amazon', name: 'Amazon', categoryId: 'shopping' },
      { id: 'rinse', name: 'Rinse', categoryId: 'lifestyle' },
      { id: 'lawnlove', name: 'Lawn Love', categoryId: 'lifestyle' }
    ];
    
    // Ensure categories exist
    const categories = [
      { id: 'travel', name: 'Travel & Transportation' },
      { id: 'food', name: 'Food & Delivery' },
      { id: 'finance', name: 'Finance & Banking' },
      { id: 'shopping', name: 'Shopping' },
      { id: 'productivity', name: 'Productivity & Services' },
      { id: 'health', name: 'Health & Medical' },
      { id: 'lifestyle', name: 'Lifestyle' }
    ];
    
    for (const category of categories) {
      await db.execute(sql`
        INSERT INTO categories (id, name)
        VALUES (${category.id}, ${category.name})
        ON CONFLICT (id) DO NOTHING
      `);
    }
    
    // Insert apps if they don't exist
    for (const app of popularApps) {
      const appExists = await db.execute(sql`
        SELECT id FROM apps WHERE id = ${app.id}
      `);
      
      if (appExists.rows.length === 0) {
        // Set default values for new apps
        await db.execute(sql`
          INSERT INTO apps (
            id, name, category_id, description, icon_url, rating, 
            downloads, version, size, updated, requires, developer, 
            installs, download_url, google_play_url, screenshots, is_affiliate
          )
          VALUES (
            ${app.id}, ${app.name}, ${app.categoryId}, 
            'Download the app to see full description', 
            'https://placehold.co/512x512?text=${app.name}',
            4.5, '1M+', '1.0.0', 'Varies', 'Recently', 
            'Android 5.0+ / iOS 12.0+', 'App Developer',
            '1,000,000+', 'https://topapps.store/download/' || ${app.id},
            'https://play.google.com/store/apps/details?id=com.' || ${app.id},
            '[]'::jsonb, true
          )
        `);
      }
    }
    
    // Add example affiliate links for the apps
    const sampleAffiliateLinks = [
      { appId: 'uber', label: 'Get $5 off your first ride', url: 'https://uber.com/?ref=YOURCODE', buttonText: 'Get Uber' },
      { appId: 'doordash', label: 'Free delivery on first order', url: 'https://doordash.com/?ref=YOURCODE', buttonText: 'Order Now' },
      { appId: 'amazon', label: 'Shop with Amazon', url: 'https://amazon.com/?tag=YOURTAG', buttonText: 'Shop Now' },
      { appId: 'cashapp', label: 'Send $5, get $5', url: 'https://cash.app/?ref=YOURCODE', buttonText: 'Get Cash App' }
    ];
    
    for (const link of sampleAffiliateLinks) {
      await db.execute(sql`
        INSERT INTO affiliate_links (app_id, label, url, button_text)
        VALUES (${link.appId}, ${link.label}, ${link.url}, ${link.buttonText})
        ON CONFLICT DO NOTHING
      `);
    }
    
    log('Affiliate links migration completed successfully!', 'migration');
    return true;
  } catch (error) {
    log(`Affiliate links migration failed: ${error}`, 'error');
    console.error('Migration error:', error);
    return false;
  }
}

// Run the migration immediately
migrateAffiliateLinks()
  .then((success) => {
    if (success) {
      console.log('✅ Affiliate links migration completed successfully!');
    } else {
      console.error('❌ Affiliate links migration failed');
    }
  });

export default migrateAffiliateLinks;