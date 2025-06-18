/**
 * Simple Google Ads Credentials Setup
 * Run this after collecting your 5 API credentials
 */

const fs = require('fs');

console.log('Google Ads API Credentials Setup\n');

// Check if .env exists
const envExists = fs.existsSync('.env');
let envContent = envExists ? fs.readFileSync('.env', 'utf8') : '';

// Add your credentials here:
const credentials = {
  CLIENT_ID: 'your_client_id_here',
  CLIENT_SECRET: 'your_client_secret_here', 
  REFRESH_TOKEN: 'your_refresh_token_here',
  CUSTOMER_ID: 'your_10_digit_customer_id_here',
  DEVELOPER_TOKEN: 'your_developer_token_here'
};

// Validation
const isConfigured = Object.values(credentials).every(val => !val.includes('your_'));

if (!isConfigured) {
  console.log('Please edit setup-credentials.js and add your actual credentials:');
  console.log('1. CLIENT_ID from Google Cloud Console');
  console.log('2. CLIENT_SECRET from Google Cloud Console');
  console.log('3. REFRESH_TOKEN from OAuth Playground');
  console.log('4. CUSTOMER_ID from Google Ads (10 digits)');
  console.log('5. DEVELOPER_TOKEN from Google Ads API Center');
  return;
}

// Remove existing Google Ads config
envContent = envContent.replace(/# Google Ads.*?\n(?=[A-Z]|$)/gs, '');

// Add new configuration
const newConfig = `
# Google Ads API Configuration
GOOGLE_ADS_CLIENT_ID=${credentials.CLIENT_ID}
GOOGLE_ADS_CLIENT_SECRET=${credentials.CLIENT_SECRET}
GOOGLE_ADS_REFRESH_TOKEN=${credentials.REFRESH_TOKEN}
GOOGLE_ADS_CUSTOMER_ID=${credentials.CUSTOMER_ID}
GOOGLE_ADS_DEVELOPER_TOKEN=${credentials.DEVELOPER_TOKEN}
BASE_URL=https://topapps.store
`;

fs.writeFileSync('.env', envContent + newConfig);

console.log('✓ Credentials saved to .env file');
console.log('✓ Restart the application to load new credentials');
console.log('✓ Test at /admin/google-ads');