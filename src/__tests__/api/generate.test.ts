import { describe, expect, test, mock, beforeEach } from 'bun:test';
import { NextRequest } from 'next/server';

// Check if we're in a browser-like environment (happy-dom)
// The Anthropic SDK throws when instantiated in browser environments
const isHappyDomLoaded = typeof window !== 'undefined' && typeof document !== 'undefined';

// Skip all tests when happy-dom is loaded (component test environment)
// These tests need to run without the happy-dom preload
const describeOrSkip = isHappyDomLoaded ? describe.skip : describe;

// Mock the Anthropic SDK first to prevent browser environment error
const mockAnthropicCreate = mock(() =>
  Promise.resolve({
    content: [{ type: 'text', text: '### Test Recipe\n\nA delicious test recipe.' }],
  })
);

mock.module('@anthropic-ai/sdk', () => ({
  default: class Anthropic {
    messages = {
      create: mockAnthropicCreate,
    };
  },
}));

mock.module('@/lib/anthropic', () => ({
  anthropic: {
    messages: {
      create: mockAnthropicCreate,
    },
  },
  RECIPE_SYSTEM_PROMPT: 'Test system prompt',
}));

// Mock rate limiting to allow all requests by default
const mockCheckRateLimit = mock(() => ({
  success: true,
  remaining: 29,
  resetTime: Date.now() + 3600000,
}));

mock.module('@/lib/rateLimit', () => ({
  checkRateLimit: mockCheckRateLimit,
  getClientIp: () => '127.0.0.1',
  RATE_LIMITS: {
    generate: { windowMs: 3600000, maxRequests: 30 },
  },
}));

// Only import if not in browser env
let POST: typeof import('@/app/api/generate/route').POST;
if (!isHappyDomLoaded) {
  POST = (await import('@/app/api/generate/route')).POST;
}

// Valid test data
const validRequestBody = {
  cuisine: 'Italian',
  season: 'summer',
  servings: 4,
  ingredients: {
    fat: { name: 'Olive oil' },
    foundation: { name: 'Garlic and onion' },
    feature: { name: 'Chicken breast' },
    flavor: { name: 'White wine' },
    finish: { name: 'Fresh basil' },
  },
};

function createRequest(body: unknown): NextRequest {
  return new NextRequest('http://localhost:3000/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
}

describeOrSkip('POST /api/generate', () => {
  beforeEach(() => {
    mockAnthropicCreate.mockClear();
    mockCheckRateLimit.mockClear();
    mockCheckRateLimit.mockReturnValue({
      success: true,
      remaining: 29,
      resetTime: Date.now() + 3600000,
    });
  });

  test('returns recipe on valid request', async () => {
    const request = createRequest(validRequestBody);
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.recipe).toBeDefined();
    expect(data.recipe).toContain('Test Recipe');
  });

  test('calls Anthropic API with correct parameters', async () => {
    const request = createRequest(validRequestBody);
    await POST(request);

    expect(mockAnthropicCreate).toHaveBeenCalledTimes(1);
    const call = mockAnthropicCreate.mock.calls[0][0];
    expect(call.model).toBe('claude-sonnet-4-20250514');
    expect(call.max_tokens).toBe(1500);
    expect(call.system).toBe('Test system prompt');
    expect(call.messages[0].role).toBe('user');
    expect(call.messages[0].content).toContain('Italian');
    expect(call.messages[0].content).toContain('Summer');
    expect(call.messages[0].content).toContain('Olive oil');
  });

  test('returns 429 when rate limited', async () => {
    mockCheckRateLimit.mockReturnValue({
      success: false,
      remaining: 0,
      resetTime: Date.now() + 3600000,
    });

    const request = createRequest(validRequestBody);
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(429);
    expect(data.error).toContain('Too many requests');
    expect(response.headers.get('X-RateLimit-Remaining')).toBe('0');
    expect(response.headers.get('Retry-After')).toBeDefined();
  });

  test('returns 400 for invalid season', async () => {
    const request = createRequest({
      ...validRequestBody,
      season: 'autumn', // invalid
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Invalid request data');
  });

  test('returns 400 for invalid servings', async () => {
    const request = createRequest({
      ...validRequestBody,
      servings: 0,
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Invalid request data');
  });

  test('returns 400 for missing ingredients', async () => {
    const request = createRequest({
      cuisine: 'Italian',
      season: 'summer',
      servings: 4,
      ingredients: {
        fat: { name: 'Olive oil' },
        // missing other categories
      },
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Invalid request data');
  });

  test('returns 400 for invalid cuisine characters', async () => {
    const request = createRequest({
      ...validRequestBody,
      cuisine: '<script>alert(1)</script>',
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Invalid request data');
  });

  test('returns 500 when Anthropic API fails', async () => {
    mockAnthropicCreate.mockRejectedValueOnce(new Error('API Error'));

    const request = createRequest(validRequestBody);
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Failed to generate recipe');
  });

  test('handles empty response content', async () => {
    mockAnthropicCreate.mockResolvedValueOnce({
      content: [],
    });

    const request = createRequest(validRequestBody);
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.recipe).toBe('');
  });

  test('includes all ingredient names in API request', async () => {
    const request = createRequest(validRequestBody);
    await POST(request);

    const call = mockAnthropicCreate.mock.calls[0][0];
    const userMessage = call.messages[0].content;

    expect(userMessage).toContain('Olive oil');
    expect(userMessage).toContain('Garlic and onion');
    expect(userMessage).toContain('Chicken breast');
    expect(userMessage).toContain('White wine');
    expect(userMessage).toContain('Fresh basil');
  });

  test('capitalizes season in API request', async () => {
    const request = createRequest(validRequestBody);
    await POST(request);

    const call = mockAnthropicCreate.mock.calls[0][0];
    const userMessage = call.messages[0].content;

    expect(userMessage).toContain('Season: Summer');
  });
});
