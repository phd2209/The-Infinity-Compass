import cache from './utils/cache.js';

/**
 * Health check endpoint
 * GET /api/health
 */
export default function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const cacheStats = cache.stats();

  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    cache: cacheStats,
    environment: process.env.NODE_ENV || 'development',
  });
}
