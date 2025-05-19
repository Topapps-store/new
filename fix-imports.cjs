#!/usr/bin/env node

/**
 * This script automatically converts @/ alias imports to relative path imports
 * to ensure compatibility with Cloudflare Pages deployments.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Main source directories
const CLIENT_SRC = path.join(process.cwd(), 'client', 'src');

// Regex patterns to match import statements with @/ aliases
const IMPORT_REGEX = /import\s+(?:(?:[\w\s{},*]+)\s+from\s+)?["']@\/([^"']+)["']/g;
const TYPE_IMPORT_REGEX = /import\s+type\s+(?:{[^}]+})\s+from\s+["']@\/([^"']+)["']/g;
const DYNAMIC_IMPORT_REGEX = /import\(["']@\/([^"']+)["']\)/g;

/**
 * Get the relative path from source file to the target import
 */
function getRelativePath(sourceFile, targetImport) {
  // Map import alias paths to actual directories
  const aliasMapping = {
    'components': path.join(CLIENT_SRC, 'components'),
    'lib': path.join(CLIENT_SRC, 'lib'),
    'hooks': path.join(CLIENT_SRC, 'hooks'),
    'pages': path.join(CLIENT_SRC, 'pages'),
    'assets': path.join(CLIENT_SRC, 'assets'),
    'context': path.join(CLIENT_SRC, 'context'),
    'services': path.join(CLIENT_SRC, 'services'),
    'data': path.join(CLIENT_SRC, 'data'),
  };

  // Extract the first part of the import path to determine the alias directory
  const parts = targetImport.split('/');
  const aliasDir = parts[0];
  
  // Get the real path for the alias directory
  const realTargetBase = aliasMapping[aliasDir] || path.join(CLIENT_SRC, aliasDir);
  
  // Reconstruct the full real path to the target file
  const realTarget = path.join(realTargetBase, ...parts.slice(1));
  
  // Get the directory of the source file
  const sourceDir = path.dirname(sourceFile);
  
  // Calculate relative path
  let relativePath = path.relative(sourceDir, realTarget);
  
  // Ensure path starts with ./ or ../
  if (!relativePath.startsWith('.')) {
    relativePath = './' + relativePath;
  }
  
  return relativePath;
}

/**
 * Process a file to convert @/ imports to relative paths
 */
function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    let modified = false;

    // Process standard imports
    content = content.replace(IMPORT_REGEX, (match, importPath) => {
      const relativePath = getRelativePath(filePath, importPath);
      modified = true;
      return match.replace(`@/${importPath}`, relativePath);
    });

    // Process type imports
    content = content.replace(TYPE_IMPORT_REGEX, (match, importPath) => {
      const relativePath = getRelativePath(filePath, importPath);
      modified = true;
      return match.replace(`@/${importPath}`, relativePath);
    });

    // Process dynamic imports
    content = content.replace(DYNAMIC_IMPORT_REGEX, (match, importPath) => {
      const relativePath = getRelativePath(filePath, importPath);
      modified = true;
      return match.replace(`@/${importPath}`, relativePath);
    });

    // Save the file if it was modified
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed imports in: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Error processing file ${filePath}:`, error.message);
    return false;
  }
}

/**
 * Recursively find all .tsx and .ts files in a directory
 */
function findFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      fileList = findFiles(filePath, fileList);
    } else if (/\.(tsx|ts|js|jsx)$/.test(file)) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

/**
 * Main function to process all files
 */
function main() {
  console.log('🔍 Finding TypeScript and JavaScript files in client/src...');
  
  const files = findFiles(CLIENT_SRC);
  console.log(`Found ${files.length} files to process.`);
  
  let fixedCount = 0;
  
  files.forEach(file => {
    const fixed = processFile(file);
    if (fixed) fixedCount++;
  });
  
  console.log(`\n🎉 Done! Fixed imports in ${fixedCount}/${files.length} files.`);
}

// Execute the script
main();