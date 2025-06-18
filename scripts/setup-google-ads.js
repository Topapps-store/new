#!/usr/bin/env node

/**
 * Google Ads API Setup Script
 * 
 * This script helps you configure Google Ads API credentials
 * and tests the connection to ensure everything works.
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setupGoogleAds() {
  console.log('🚀 Google Ads API Setup for TopApps\n');
  console.log('This script will help you configure Google Ads API credentials.\n');
  
  console.log('📋 You will need these 5 credentials:');
  console.log('1. Client ID (from Google Cloud Console)');
  console.log('2. Client Secret (from Google Cloud Console)');
  console.log('3. Refresh Token (from OAuth Playground)');
  console.log('4. Customer ID (from Google Ads account - 10 digits)');
  console.log('5. Developer Token (from Google Ads API Center)\n');

  const proceed = await question('Do you have all 5 credentials ready? (y/n): ');
  
  if (proceed.toLowerCase() !== 'y') {
    console.log('\n📚 Please follow the step-by-step guide in GOOGLE_ADS_SETUP.md first.');
    console.log('Run this script again when you have all credentials.');
    rl.close();
    return;
  }

  console.log('\n🔧 Please enter your Google Ads API credentials:\n');

  const clientId = await question('Client ID: ');
  const clientSecret = await question('Client Secret: ');
  const refreshToken = await question('Refresh Token: ');
  const customerId = await question('Customer ID (10 digits, no dashes): ');
  const developerToken = await question('Developer Token: ');

  // Validate inputs
  if (!clientId || !clientSecret || !refreshToken || !customerId || !developerToken) {
    console.log('\n❌ All fields are required. Please run the script again.');
    rl.close();
    return;
  }

  if (!/^\d{10}$/.test(customerId)) {
    console.log('\n❌ Customer ID must be exactly 10 digits (no dashes).');
    rl.close();
    return;
  }

  // Create environment variables content
  const envContent = `
# Google Ads API Configuration
GOOGLE_ADS_CLIENT_ID=${clientId}
GOOGLE_ADS_CLIENT_SECRET=${clientSecret}
GOOGLE_ADS_REFRESH_TOKEN=${refreshToken}
GOOGLE_ADS_CUSTOMER_ID=${customerId}
GOOGLE_ADS_DEVELOPER_TOKEN=${developerToken}

# Optional: Base URL for landing pages
BASE_URL=https://topapps.store

# Optional: Conversion tracking
VITE_GOOGLE_ADS_CONVERSION_ID=AW-${customerId}
VITE_GOOGLE_ADS_APP_DOWNLOAD_CONVERSION_ID=app_download
`;

  // Save to .env file
  const envPath = path.join(process.cwd(), '.env');
  let existingEnv = '';
  
  if (fs.existsSync(envPath)) {
    existingEnv = fs.readFileSync(envPath, 'utf8');
    // Remove existing Google Ads config if present
    existingEnv = existingEnv.replace(/# Google Ads API Configuration[\s\S]*?(?=\n#|\n[A-Z]|$)/g, '');
  }

  fs.writeFileSync(envPath, existingEnv + envContent);

  console.log('\n✅ Credentials saved to .env file');
  console.log('\n🧪 Testing Google Ads API connection...');

  // Test the connection
  try {
    const { GoogleAdsService } = require('../server/services/googleAdsService');
    const service = new GoogleAdsService();
    const status = await service.checkStatus();
    
    if (status.configured) {
      console.log('✅ Google Ads API connection successful!');
      console.log('🎯 You can now create campaigns from the admin dashboard.');
      console.log('\n📊 Next steps:');
      console.log('1. Go to /admin/google-ads in your browser');
      console.log('2. Select an app to create a campaign');
      console.log('3. Configure budget and target language');
      console.log('4. Click "Create Campaign" to launch');
    } else {
      console.log('❌ Connection failed:', status.message);
      console.log('\n🔍 Please verify your credentials and try again.');
    }
  } catch (error) {
    console.log('❌ Connection test failed:', error.message);
    console.log('\n🔍 Please check your credentials and ensure Google Ads API is enabled.');
  }

  rl.close();
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n👋 Setup cancelled by user');
  rl.close();
  process.exit(0);
});

// Run the setup
setupGoogleAds().catch(console.error);