import { db } from '../server/db';
import { sql } from 'drizzle-orm';
import { log } from '../server/vite';

async function migrateDatabase() {
  try {
    log('Starting database migration...', 'migration');
    
    // Add new columns to the apps table
    await db.execute(sql`
      ALTER TABLE apps 
      ADD COLUMN IF NOT EXISTS ios_app_store_url VARCHAR(255),
      ADD COLUMN IF NOT EXISTS original_app_id VARCHAR(100),
      ADD COLUMN IF NOT EXISTS last_synced_at TIMESTAMP
    `);
    
    // Set original_app_id to match the id field for existing records
    await db.execute(sql`
      UPDATE apps
      SET original_app_id = id
      WHERE original_app_id IS NULL
    `);
    
    log('Database migration completed successfully!', 'migration');
    return true;
  } catch (error) {
    log(`Database migration failed: ${error}`, 'error');
    console.error('Migration error:', error);
    return false;
  }
}

// Run the migration immediately
migrateDatabase()
  .then((success) => {
    if (success) {
      console.log('✅ Database migration completed successfully!');
    } else {
      console.error('❌ Database migration failed');
    }
  });

export default migrateDatabase;