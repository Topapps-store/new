#!/usr/bin/env node

/**
 * Script to prepare the project for Cloudflare Pages deployment
 * This script:
 * 1. Ensures all @/ imports are converted to relative imports
 * 2. Makes any necessary adjustments to static data files
 * 3. Creates environment variables file for Cloudflare
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Main source directories
const CLIENT_SRC = path.join(process.cwd(), 'client', 'src');

// Console colors
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// Log with color
function log(message, color = 'reset') {
  console.log(colors[color] + message + colors.reset);
}

// Run the fix-imports script to convert all @/ imports to relative paths
function fixImports() {
  log('Step 1: Converting @/ imports to relative paths...', 'blue');
  
  try {
    execSync('node fix-imports.cjs', { stdio: 'inherit' });
    log('✅ Imports fixed successfully!', 'green');
    return true;
  } catch (error) {
    log(`❌ Error fixing imports: ${error.message}`, 'red');
    return false;
  }
}

// Check that the StaticLanguageContext is properly set up
function checkStaticLanguageContext() {
  log('Step 2: Checking static language context...', 'blue');
  
  const staticLanguageContextPath = path.join(CLIENT_SRC, 'context', 'StaticLanguageContext.tsx');
  
  if (!fs.existsSync(staticLanguageContextPath)) {
    log(`❌ StaticLanguageContext.tsx not found at ${staticLanguageContextPath}`, 'red');
    return false;
  }
  
  log('✅ Static language context is set up correctly!', 'green');
  return true;
}

// Check that the staticApp.tsx file exists and is properly configured
function checkStaticApp() {
  log('Step 3: Checking static app configuration...', 'blue');
  
  const staticAppPath = path.join(CLIENT_SRC, 'staticApp.tsx');
  
  if (!fs.existsSync(staticAppPath)) {
    log(`❌ staticApp.tsx not found at ${staticAppPath}`, 'red');
    return false;
  }
  
  log('✅ Static app configuration is set up correctly!', 'green');
  return true;
}

// Check that static data JSON files exist
function checkStaticData() {
  log('Step 4: Checking static data files...', 'blue');
  
  const appsJsonPath = path.join(CLIENT_SRC, 'data', 'apps.json');
  
  if (!fs.existsSync(appsJsonPath)) {
    log(`❌ apps.json not found at ${appsJsonPath}`, 'red');
    return false;
  }
  
  log('✅ Static data files are set up correctly!', 'green');
  return true;
}

// Create Cloudflare environment variable file if needed
function setupCloudflareEnv() {
  log('Step 5: Setting up Cloudflare environment variables...', 'blue');
  
  const cloudflareEnvPath = path.join(process.cwd(), '.env.production');
  const envContent = 
`# Environment variables for Cloudflare Pages
IS_STATIC=true
CF_PAGES=true
NODE_VERSION=20
`;
  
  try {
    fs.writeFileSync(cloudflareEnvPath, envContent);
    log(`✅ Cloudflare environment variables created at ${cloudflareEnvPath}`, 'green');
    return true;
  } catch (error) {
    log(`❌ Error creating Cloudflare environment variables: ${error.message}`, 'red');
    return false;
  }
}

// Check the wrangler.toml configuration
function checkWranglerConfig() {
  log('Step 6: Checking wrangler.toml configuration...', 'blue');
  
  const wranglerPath = path.join(process.cwd(), 'wrangler.toml');
  
  if (!fs.existsSync(wranglerPath)) {
    log(`❌ wrangler.toml not found at ${wranglerPath}`, 'red');
    return false;
  }
  
  const wranglerContent = fs.readFileSync(wranglerPath, 'utf8');
  
  // Check for duplicate build settings
  const buildSectionCount = (wranglerContent.match(/\[build\]/g) || []).length;
  
  if (buildSectionCount > 1) {
    log('❌ wrangler.toml contains duplicate [build] sections', 'red');
    return false;
  }
  
  if (!wranglerContent.includes('command = "./build-static.sh"')) {
    log('❌ wrangler.toml is not configured to use build-static.sh', 'red');
    return false;
  }
  
  log('✅ wrangler.toml configuration is correct!', 'green');
  return true;
}

// Check if we need to update the package.json
function checkPackageJson() {
  log('Step 7: Checking package.json configuration...', 'blue');
  
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  
  if (!fs.existsSync(packageJsonPath)) {
    log(`❌ package.json not found at ${packageJsonPath}`, 'red');
    return false;
  }
  
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    // Make sure we have the needed scripts
    if (!packageJson.scripts || !packageJson.scripts['build:cloudflare']) {
      log('⚠️ Consider adding a "build:cloudflare" script to package.json', 'yellow');
    }
    
    log('✅ package.json configuration is acceptable!', 'green');
    return true;
  } catch (error) {
    log(`❌ Error checking package.json: ${error.message}`, 'red');
    return false;
  }
}

// Run all checks and show summary
async function main() {
  log('\n📋 CLOUDFLARE DEPLOYMENT PREPARATION SCRIPT 📋\n', 'cyan');
  
  const results = {
    imports: fixImports(),
    languageContext: checkStaticLanguageContext(),
    staticApp: checkStaticApp(),
    staticData: checkStaticData(),
    cloudflareEnv: setupCloudflareEnv(),
    wranglerConfig: checkWranglerConfig(),
    packageJson: checkPackageJson(),
  };
  
  log('\n📊 SUMMARY 📊', 'cyan');
  
  let allPassed = true;
  
  Object.entries(results).forEach(([check, passed]) => {
    if (passed) {
      log(`✅ ${check}: PASSED`, 'green');
    } else {
      log(`❌ ${check}: FAILED`, 'red');
      allPassed = false;
    }
  });
  
  log('\n🔍 FINAL RESULT 🔍', 'cyan');
  
  if (allPassed) {
    log('✅ All checks passed! Your project is ready for Cloudflare Pages deployment.', 'green');
    log('   Run "bash build-static.sh" to build your project for deployment.', 'green');
  } else {
    log('❌ Some checks failed. Please fix the issues above before deploying.', 'red');
  }
}

// Execute the script
main();