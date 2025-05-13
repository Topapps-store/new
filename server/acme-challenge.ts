import express from 'express';
import path from 'path';
import fs from 'fs';
import { log } from './vite';

// Function to set up the ACME challenge routes for Let's Encrypt SSL verification
export function setupAcmeChallengeRoutes(app: express.Express) {
  const acmeChallengeDir = path.join(process.cwd(), '.well-known', 'acme-challenge');
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(acmeChallengeDir)) {
    try {
      fs.mkdirSync(acmeChallengeDir, { recursive: true });
      log('Created ACME challenge directory for SSL verification');
    } catch (error) {
      console.error('Error creating ACME challenge directory:', error);
    }
  }

  // Ensure there's a test file to verify the directory is accessible
  const testFilePath = path.join(acmeChallengeDir, 'test.txt');
  if (!fs.existsSync(testFilePath)) {
    try {
      fs.writeFileSync(testFilePath, 'This is a test file for Let\'s Encrypt verification');
      log('Created test file in ACME challenge directory');
    } catch (error) {
      console.error('Error creating test file in ACME challenge directory:', error);
    }
  }

  // Log when an ACME challenge file is requested (before serving)
  app.use('/.well-known/acme-challenge', (req, res, next) => {
    log(`ACME Challenge requested: ${req.path}`);
    next();
  });
  
  // Serve files from the .well-known/acme-challenge directory with high priority
  app.use('/.well-known/acme-challenge', express.static(acmeChallengeDir, {
    maxAge: 0,
    etag: false,
    lastModified: false
  }));

  // Add a specific route for debugging
  app.get('/.well-known/acme-challenge/test.txt', (req, res) => {
    log('Test file accessed for ACME challenge');
    res.sendFile(testFilePath);
  });

  log('ACME challenge routes set up for SSL verification');
}