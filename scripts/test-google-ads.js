#!/usr/bin/env node

/**
 * Google Ads API Test Script
 * Tests the Google Ads integration with your credentials
 */

const path = require('path');
require('dotenv').config({ path: path.join(process.cwd(), '.env') });

async function testGoogleAdsIntegration() {
  console.log('Testing Google Ads API Integration...\n');

  // Check environment variables
  const requiredVars = [
    'GOOGLE_ADS_CLIENT_ID',
    'GOOGLE_ADS_CLIENT_SECRET', 
    'GOOGLE_ADS_REFRESH_TOKEN',
    'GOOGLE_ADS_CUSTOMER_ID',
    'GOOGLE_ADS_DEVELOPER_TOKEN'
  ];

  console.log('Checking environment variables:');
  const missingVars = [];
  
  requiredVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
      console.log(`✓ ${varName}: ${value.substring(0, 10)}...`);
    } else {
      console.log(`✗ ${varName}: Missing`);
      missingVars.push(varName);
    }
  });

  if (missingVars.length > 0) {
    console.log('\nMissing required environment variables:');
    missingVars.forEach(varName => console.log(`  - ${varName}`));
    console.log('\nPlease run: node scripts/setup-google-ads.js');
    return;
  }

  // Test API connection
  try {
    console.log('\nTesting Google Ads API connection...');
    
    // Import the service
    const { GoogleAdsService } = require('../server/services/googleAdsService');
    const service = new GoogleAdsService();
    
    const status = await service.checkStatus();
    
    if (status.configured) {
      console.log('✓ API connection successful');
      console.log('✓ Ready to create campaigns');
      
      // Test keyword generation
      console.log('\nTesting keyword generation:');
      const testKeywords = {
        spanish: service.generateKeywords('WhatsApp', 'es'),
        french: service.generateKeywords('Bolt', 'fr'),
        english: service.generateKeywords('Instagram', 'en')
      };
      
      console.log('Spanish keywords:', testKeywords.spanish.slice(0, 3).join(', '));
      console.log('French keywords:', testKeywords.french.slice(0, 3).join(', '));
      console.log('English keywords:', testKeywords.english.slice(0, 3).join(', '));
      
      console.log('\n🎯 Google Ads integration is ready!');
      console.log('Access the dashboard at: /admin/google-ads');
      
    } else {
      console.log('✗ API connection failed');
      console.log('Error:', status.message);
      console.log('\nPlease verify your credentials are correct');
    }
    
  } catch (error) {
    console.log('✗ Test failed:', error.message);
    console.log('\nPlease check your Google Ads API setup');
  }
}

testGoogleAdsIntegration();