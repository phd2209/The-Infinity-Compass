import cache, { CacheKeys, TTL } from './cache.js';

/**
 * Rate limiter using cache
 * Tracks requests per hour per identifier (IP or wallet)
 */
export class RateLimiter {
  constructor(maxRequests = 5, windowMinutes = 1) {
    this.maxRequests = maxRequests;
    this.windowMinutes = windowMinutes;
  }

  /**
   * Check if request should be allowed
   * Returns { allowed: boolean, remaining: number, resetTime: number }
   */
  check(identifier) {
    const hour = new Date().getHours();
    const key = CacheKeys.rateLimit(identifier, hour);

    const current = cache.get(key) || 0;

    if (current >= this.maxRequests) {
      const resetTime = new Date();
      resetTime.setMinutes(resetTime.getMinutes() + this.windowMinutes);

      return {
        allowed: false,
        remaining: 0,
        resetTime: resetTime.getTime(),
        current,
      };
    }

    // Increment counter
    cache.set(key, current + 1, TTL.RATE_LIMIT);

    return {
      allowed: true,
      remaining: this.maxRequests - (current + 1),
      resetTime: Date.now() + TTL.RATE_LIMIT * 1000,
      current: current + 1,
    };
  }

  /**
   * Reset rate limit for an identifier
   */
  reset(identifier) {
    const hour = new Date().getHours();
    const key = CacheKeys.rateLimit(identifier, hour);
    cache.delete(key);
  }
}

/**
 * Express middleware for rate limiting
 */
export function rateLimitMiddleware(limiter) {
  return (req, res, next) => {
    // Use IP or wallet address as identifier
    const identifier = req.body?.wallet || req.query?.wallet || req.ip || 'unknown';

    const result = limiter.check(identifier);

    // Add rate limit headers
    res.setHeader('X-RateLimit-Limit', limiter.maxRequests);
    res.setHeader('X-RateLimit-Remaining', result.remaining);
    res.setHeader('X-RateLimit-Reset', Math.floor(result.resetTime / 1000));

    if (!result.allowed) {
      return res.status(429).json({
        error: 'rate_limit_exceeded',
        message: 'The cosmic winds are swirling too strongly right now — try again in a few minutes.',
        retryAfter: Math.floor((result.resetTime - Date.now()) / 1000),
      });
    }

    next();
  };
}

export default RateLimiter;
