import { describe, expect, test, mock, beforeEach } from 'bun:test';
import { NextRequest } from 'next/server';

// Mock supabase
const mockSupabaseInsert = mock(() => Promise.resolve({ error: null }));

mock.module('@/lib/supabase', () => ({
  supabase: {
    from: (table: string) => {
      if (table === 'feedback') {
        return {
          insert: mockSupabaseInsert,
        };
      }
      return {};
    },
  },
}));

// Mock rate limiting
const mockCheckRateLimit = mock(() => ({
  success: true,
  remaining: 99,
  resetTime: Date.now() + 3600000,
}));

mock.module('@/lib/rateLimit', () => ({
  checkRateLimit: mockCheckRateLimit,
  getClientIp: () => '127.0.0.1',
  RATE_LIMITS: {
    feedback: { windowMs: 3600000, maxRequests: 100 },
  },
}));

// Import after mocking
import { POST } from '@/app/api/feedback/route';

const validFeedback = {
  recipe_inputs: {
    cuisine: 'Italian',
    season: 'summer',
    servings: 4,
    ingredients: {
      fat: { name: 'Olive oil' },
      foundation: { name: 'Garlic' },
      feature: { name: 'Chicken' },
      flavor: { name: 'Wine' },
      finish: { name: 'Basil' },
    },
  },
  recipe_text: 'Test recipe content',
  rating: 'positive',
};

function createRequest(body: unknown): NextRequest {
  return new NextRequest('http://localhost:3000/api/feedback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('POST /api/feedback', () => {
  beforeEach(() => {
    mockSupabaseInsert.mockClear();
    mockCheckRateLimit.mockClear();
    mockCheckRateLimit.mockReturnValue({
      success: true,
      remaining: 99,
      resetTime: Date.now() + 3600000,
    });
    mockSupabaseInsert.mockResolvedValue({ error: null });
  });

  test('submits positive feedback successfully', async () => {
    const request = createRequest(validFeedback);
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });

  test('submits negative feedback successfully', async () => {
    const request = createRequest({ ...validFeedback, rating: 'negative' });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });

  test('submits feedback without recipe_text (optional)', async () => {
    const { recipe_text, ...feedbackWithoutText } = validFeedback;
    const request = createRequest(feedbackWithoutText);
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });

  test('calls Supabase with correct data', async () => {
    const request = createRequest(validFeedback);
    await POST(request);

    expect(mockSupabaseInsert).toHaveBeenCalledTimes(1);
    const insertData = mockSupabaseInsert.mock.calls[0][0];
    expect(insertData.recipe_inputs).toEqual(validFeedback.recipe_inputs);
    expect(insertData.recipe_text).toBe('Test recipe content');
    expect(insertData.rating).toBe('positive');
  });

  test('returns 429 when rate limited', async () => {
    mockCheckRateLimit.mockReturnValue({
      success: false,
      remaining: 0,
      resetTime: Date.now() + 3600000,
    });

    const request = createRequest(validFeedback);
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(429);
    expect(data.error).toContain('Too many requests');
  });

  test('returns 400 for missing rating', async () => {
    const { rating, ...feedbackWithoutRating } = validFeedback;
    const request = createRequest(feedbackWithoutRating);
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Invalid request data');
  });

  test('returns 400 for invalid rating value', async () => {
    const request = createRequest({ ...validFeedback, rating: 'neutral' });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Invalid request data');
  });

  test('returns 400 for missing recipe_inputs', async () => {
    const request = createRequest({ rating: 'positive' });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Invalid request data');
  });

  test('returns 400 for invalid recipe_inputs', async () => {
    const request = createRequest({
      recipe_inputs: {
        cuisine: '<script>alert(1)</script>',
        season: 'summer',
        servings: 4,
        ingredients: validFeedback.recipe_inputs.ingredients,
      },
      rating: 'positive',
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Invalid request data');
  });

  test('returns 500 when Supabase insert fails', async () => {
    mockSupabaseInsert.mockResolvedValueOnce({
      error: { message: 'Database error' },
    });

    const request = createRequest(validFeedback);
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Failed to save feedback');
  });

  test('returns 500 on unexpected error', async () => {
    mockSupabaseInsert.mockRejectedValueOnce(new Error('Unexpected'));

    const request = createRequest(validFeedback);
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Failed to process feedback');
  });

  test('accepts all valid seasons in recipe_inputs', async () => {
    const seasons = ['spring', 'summer', 'fall', 'winter'];

    for (const season of seasons) {
      mockSupabaseInsert.mockClear();
      const request = createRequest({
        ...validFeedback,
        recipe_inputs: { ...validFeedback.recipe_inputs, season },
      });
      const response = await POST(request);

      expect(response.status).toBe(200);
    }
  });

  test('validates servings range in recipe_inputs', async () => {
    // Valid servings (1-12)
    const request = createRequest({
      ...validFeedback,
      recipe_inputs: { ...validFeedback.recipe_inputs, servings: 12 },
    });
    const response = await POST(request);
    expect(response.status).toBe(200);

    // Invalid servings (13)
    const invalidRequest = createRequest({
      ...validFeedback,
      recipe_inputs: { ...validFeedback.recipe_inputs, servings: 13 },
    });
    const invalidResponse = await POST(invalidRequest);
    expect(invalidResponse.status).toBe(400);
  });
});
