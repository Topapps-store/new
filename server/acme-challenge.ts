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

  // Serve files from the .well-known/acme-challenge directory
  app.use('/.well-known/acme-challenge', express.static(acmeChallengeDir));
  
  // Log when an ACME challenge file is requested
  app.use('/.well-known/acme-challenge', (req, res, next) => {
    log(`ACME Challenge requested: ${req.path}`);
    next();
  });

  log('ACME challenge routes set up for SSL verification');
}