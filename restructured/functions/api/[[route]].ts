import { createRouter } from './router';
import { registerAuthRoutes } from './routes/auth';
import { registerAppRoutes } from './routes/apps';
import { registerCategoryRoutes } from './routes/categories';
import { registerAffiliateLinkRoutes } from './routes/affiliate-links';
import { registerAdminRoutes } from './routes/admin';

// Create router instance
const router = createRouter();

// Register API routes
registerAuthRoutes(router);
registerAppRoutes(router);
registerCategoryRoutes(router);
registerAffiliateLinkRoutes(router);
registerAdminRoutes(router);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Error handler
router.onError((err, req, res) => {
  console.error('API error:', err);
  res.status(500).json({
    error: err.message || 'Internal Server Error',
    status: 'error',
    timestamp: new Date().toISOString()
  });
});

// Export the default Cloudflare Pages function
export const onRequest = router.handle;