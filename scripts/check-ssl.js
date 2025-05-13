import https from 'https';
import dns from 'dns';
import { promisify } from 'util';

const domains = [
  'topapps.store',
  'www.topapps.store'
];

async function checkDomain(domain) {
  console.log(`\nChecking domain: ${domain}`);
  
  // Check DNS resolution first
  try {
    const resolve4 = promisify(dns.resolve4);
    const addresses = await resolve4(domain);
    console.log(`✅ DNS Resolution: Success (IP: ${addresses.join(', ')})`);
  } catch (error) {
    console.log(`❌ DNS Resolution: Failed (${error.message})`);
    return;
  }
  
  // Try HTTPS connection
  try {
    const result = await new Promise((resolve, reject) => {
      const req = https.request({
        host: domain,
        port: 443,
        method: 'GET',
        path: '/',
        timeout: 5000,
        rejectUnauthorized: true
      }, (res) => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers
        });
        res.on('data', () => {}); // Consume data
      });
      
      req.on('error', (error) => {
        reject(error);
      });
      
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Connection timed out'));
      });
      
      req.end();
    });
    
    console.log(`✅ HTTPS Connection: Success (Status: ${result.statusCode})`);
    
    // Check certificate info
    if (result.headers && result.headers['strict-transport-security']) {
      console.log(`✅ HSTS Header: Present (${result.headers['strict-transport-security']})`);
    } else {
      console.log(`❌ HSTS Header: Missing`);
    }
  } catch (error) {
    console.log(`❌ HTTPS Connection: Failed (${error.message})`);
  }
}

async function main() {
  console.log('SSL Certificate Check Tool');
  console.log('=========================\n');
  
  for (const domain of domains) {
    await checkDomain(domain);
  }
  
  console.log('\nChecking complete! If you see any failures, please ensure:');
  console.log('1. Your DNS settings are correctly pointing to Replit');
  console.log('2. Your domain is verified in Replit');
  console.log('3. You have waited 24-48 hours for SSL certificates to provision');
}

main().catch(console.error);