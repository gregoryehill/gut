import { describe, expect, test, beforeEach } from 'bun:test';
import { checkRateLimit, getClientIp, RATE_LIMITS, type RateLimitConfig } from '@/lib/rateLimit';

describe('checkRateLimit', () => {
  // Use unique identifiers for each test to avoid state pollution
  let testId = 0;

  beforeEach(() => {
    testId++;
  });

  const getUniqueId = (prefix: string) => `${prefix}-${testId}-${Date.now()}`;

  test('allows first request in a new window', () => {
    const config: RateLimitConfig = { windowMs: 60000, maxRequests: 5 };
    const result = checkRateLimit(getUniqueId('test'), config);

    expect(result.success).toBe(true);
    expect(result.remaining).toBe(4);
  });

  test('tracks request count within window', () => {
    const config: RateLimitConfig = { windowMs: 60000, maxRequests: 5 };
    const identifier = getUniqueId('tracking');

    const result1 = checkRateLimit(identifier, config);
    expect(result1.remaining).toBe(4);

    const result2 = checkRateLimit(identifier, config);
    expect(result2.remaining).toBe(3);

    const result3 = checkRateLimit(identifier, config);
    expect(result3.remaining).toBe(2);
  });

  test('blocks requests when limit is reached', () => {
    const config: RateLimitConfig = { windowMs: 60000, maxRequests: 3 };
    const identifier = getUniqueId('blocking');

    // Use up all allowed requests
    checkRateLimit(identifier, config); // 1st
    checkRateLimit(identifier, config); // 2nd
    checkRateLimit(identifier, config); // 3rd - last allowed

    // 4th request should be blocked
    const result = checkRateLimit(identifier, config);
    expect(result.success).toBe(false);
    expect(result.remaining).toBe(0);
  });

  test('resets after window expires', async () => {
    const config: RateLimitConfig = { windowMs: 50, maxRequests: 2 }; // 50ms window
    const identifier = getUniqueId('reset');

    // Use up all requests
    checkRateLimit(identifier, config);
    checkRateLimit(identifier, config);

    // Should be blocked
    const blockedResult = checkRateLimit(identifier, config);
    expect(blockedResult.success).toBe(false);

    // Wait for window to expire
    await new Promise((resolve) => setTimeout(resolve, 60));

    // Should be allowed again
    const newResult = checkRateLimit(identifier, config);
    expect(newResult.success).toBe(true);
    expect(newResult.remaining).toBe(1);
  });

  test('returns correct resetTime', () => {
    const config: RateLimitConfig = { windowMs: 60000, maxRequests: 5 };
    const identifier = getUniqueId('resetTime');
    const beforeTime = Date.now();

    const result = checkRateLimit(identifier, config);

    const afterTime = Date.now();

    // resetTime should be approximately now + windowMs
    expect(result.resetTime).toBeGreaterThanOrEqual(beforeTime + config.windowMs);
    expect(result.resetTime).toBeLessThanOrEqual(afterTime + config.windowMs + 10);
  });

  test('different identifiers have separate limits', () => {
    const config: RateLimitConfig = { windowMs: 60000, maxRequests: 2 };
    const identifier1 = getUniqueId('user1');
    const identifier2 = getUniqueId('user2');

    // Use up all requests for identifier1
    checkRateLimit(identifier1, config);
    checkRateLimit(identifier1, config);
    const blocked = checkRateLimit(identifier1, config);
    expect(blocked.success).toBe(false);

    // identifier2 should still have full quota
    const result = checkRateLimit(identifier2, config);
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(1);
  });
});

describe('getClientIp', () => {
  test('extracts IP from x-forwarded-for header', () => {
    const headers = new Headers({
      'x-forwarded-for': '192.168.1.1',
    });

    expect(getClientIp(headers)).toBe('192.168.1.1');
  });

  test('extracts first IP from x-forwarded-for with multiple IPs', () => {
    const headers = new Headers({
      'x-forwarded-for': '192.168.1.1, 10.0.0.1, 172.16.0.1',
    });

    expect(getClientIp(headers)).toBe('192.168.1.1');
  });

  test('trims whitespace from x-forwarded-for', () => {
    const headers = new Headers({
      'x-forwarded-for': '  192.168.1.1  , 10.0.0.1',
    });

    expect(getClientIp(headers)).toBe('192.168.1.1');
  });

  test('falls back to x-real-ip when x-forwarded-for is not present', () => {
    const headers = new Headers({
      'x-real-ip': '10.0.0.1',
    });

    expect(getClientIp(headers)).toBe('10.0.0.1');
  });

  test('prefers x-forwarded-for over x-real-ip', () => {
    const headers = new Headers({
      'x-forwarded-for': '192.168.1.1',
      'x-real-ip': '10.0.0.1',
    });

    expect(getClientIp(headers)).toBe('192.168.1.1');
  });

  test('returns unknown when no IP headers are present', () => {
    const headers = new Headers({});

    expect(getClientIp(headers)).toBe('unknown');
  });

  test('returns unknown when headers are empty', () => {
    const headers = new Headers();

    expect(getClientIp(headers)).toBe('unknown');
  });

  test('handles IPv6 addresses', () => {
    const headers = new Headers({
      'x-forwarded-for': '2001:db8::1',
    });

    expect(getClientIp(headers)).toBe('2001:db8::1');
  });
});

describe('RATE_LIMITS', () => {
  test('generate rate limit has correct values', () => {
    expect(RATE_LIMITS.generate.windowMs).toBe(60 * 60 * 1000); // 1 hour
    expect(RATE_LIMITS.generate.maxRequests).toBe(30);
  });

  test('saveRecipe rate limit has correct values', () => {
    expect(RATE_LIMITS.saveRecipe.windowMs).toBe(60 * 60 * 1000); // 1 hour
    expect(RATE_LIMITS.saveRecipe.maxRequests).toBe(60);
  });

  test('getRecipe rate limit has correct values', () => {
    expect(RATE_LIMITS.getRecipe.windowMs).toBe(60 * 1000); // 1 minute
    expect(RATE_LIMITS.getRecipe.maxRequests).toBe(60);
  });

  test('feedback rate limit has correct values', () => {
    expect(RATE_LIMITS.feedback.windowMs).toBe(60 * 60 * 1000); // 1 hour
    expect(RATE_LIMITS.feedback.maxRequests).toBe(100);
  });

  test('all rate limits have required properties', () => {
    const limitKeys = ['generate', 'saveRecipe', 'getRecipe', 'feedback'] as const;

    for (const key of limitKeys) {
      expect(RATE_LIMITS[key]).toHaveProperty('windowMs');
      expect(RATE_LIMITS[key]).toHaveProperty('maxRequests');
      expect(typeof RATE_LIMITS[key].windowMs).toBe('number');
      expect(typeof RATE_LIMITS[key].maxRequests).toBe('number');
      expect(RATE_LIMITS[key].windowMs).toBeGreaterThan(0);
      expect(RATE_LIMITS[key].maxRequests).toBeGreaterThan(0);
    }
  });
});
