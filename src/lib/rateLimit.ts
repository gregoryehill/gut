// Simple in-memory rate limiter
// For production, consider using Redis-based solution like @upstash/ratelimit

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}, 60000); // Clean up every minute

export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetTime: number;
}

export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const key = identifier;

  const entry = rateLimitStore.get(key);

  if (!entry || entry.resetTime < now) {
    // New window
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + config.windowMs,
    });
    return {
      success: true,
      remaining: config.maxRequests - 1,
      resetTime: now + config.windowMs,
    };
  }

  if (entry.count >= config.maxRequests) {
    // Rate limited
    return {
      success: false,
      remaining: 0,
      resetTime: entry.resetTime,
    };
  }

  // Increment count
  entry.count++;
  return {
    success: true,
    remaining: config.maxRequests - entry.count,
    resetTime: entry.resetTime,
  };
}

// Pre-configured rate limiters for different endpoints
export const RATE_LIMITS = {
  // Generate endpoint - expensive AI calls, strict limit
  generate: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 30, // 30 requests per hour
  },
  // Save recipe - moderate limit
  saveRecipe: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 60, // 60 saves per hour
  },
  // Get recipe - more lenient for sharing
  getRecipe: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 60, // 60 requests per minute
  },
  // Feedback - moderate limit
  feedback: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 100, // 100 feedback submissions per hour
  },
} as const;

// Helper to get client IP from request headers
export function getClientIp(headers: Headers): string {
  // Try various headers that might contain the real IP
  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwardedFor.split(',')[0].trim();
  }

  const realIp = headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  // Fallback - this shouldn't happen in production behind a proxy
  return 'unknown';
}
