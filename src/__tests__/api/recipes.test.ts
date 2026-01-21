import { describe, expect, test, mock, beforeEach } from 'bun:test';
import { NextRequest } from 'next/server';

// Mock supabase
const mockSupabaseInsert = mock(() => Promise.resolve({ error: null }));
const mockSupabaseSelect = mock(() => ({
  eq: mock(() => ({
    single: mock(() =>
      Promise.resolve({
        data: {
          id: 'test123456',
          cuisine: 'Italian',
          season: 'summer',
          servings: 4,
          ingredients: {},
          recipe_text: 'Test recipe',
          created_at: '2024-01-01T00:00:00Z',
        },
        error: null,
      })
    ),
  })),
}));

mock.module('@/lib/supabase', () => ({
  supabase: {
    from: (table: string) => {
      if (table === 'recipes') {
        return {
          insert: mockSupabaseInsert,
          select: mockSupabaseSelect,
        };
      }
      return {};
    },
  },
}));

// Mock rate limiting
const mockCheckRateLimit = mock(() => ({
  success: true,
  remaining: 59,
  resetTime: Date.now() + 3600000,
}));

mock.module('@/lib/rateLimit', () => ({
  checkRateLimit: mockCheckRateLimit,
  getClientIp: () => '127.0.0.1',
  RATE_LIMITS: {
    saveRecipe: { windowMs: 3600000, maxRequests: 60 },
    getRecipe: { windowMs: 60000, maxRequests: 60 },
  },
}));

// Mock shortId
mock.module('@/utils/shortId', () => ({
  generateShortId: () => 'abc123xyz789',
}));

// Import after mocking
import { POST } from '@/app/api/recipes/route';
import { GET } from '@/app/api/recipes/[id]/route';

const validSaveBody = {
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
  recipe_text: 'Test recipe content here',
};

function createPostRequest(body: unknown): NextRequest {
  return new NextRequest('http://localhost:3000/api/recipes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

function createGetRequest(id: string): NextRequest {
  return new NextRequest(`http://localhost:3000/api/recipes/${id}`, {
    method: 'GET',
  });
}

describe('POST /api/recipes (save recipe)', () => {
  beforeEach(() => {
    mockSupabaseInsert.mockClear();
    mockCheckRateLimit.mockClear();
    mockCheckRateLimit.mockReturnValue({
      success: true,
      remaining: 59,
      resetTime: Date.now() + 3600000,
    });
    mockSupabaseInsert.mockResolvedValue({ error: null });
  });

  test('saves recipe and returns ID', async () => {
    const request = createPostRequest(validSaveBody);
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.id).toBe('abc123xyz789');
  });

  test('calls Supabase with correct data', async () => {
    const request = createPostRequest(validSaveBody);
    await POST(request);

    expect(mockSupabaseInsert).toHaveBeenCalledTimes(1);
    const insertData = mockSupabaseInsert.mock.calls[0][0];
    expect(insertData.id).toBe('abc123xyz789');
    expect(insertData.cuisine).toBe('Italian');
    expect(insertData.season).toBe('summer');
    expect(insertData.servings).toBe(4);
    expect(insertData.recipe_text).toBe('Test recipe content here');
  });

  test('returns 429 when rate limited', async () => {
    mockCheckRateLimit.mockReturnValue({
      success: false,
      remaining: 0,
      resetTime: Date.now() + 3600000,
    });

    const request = createPostRequest(validSaveBody);
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(429);
    expect(data.error).toContain('Too many requests');
  });

  test('returns 400 for missing recipe_text', async () => {
    const { recipe_text, ...bodyWithoutText } = validSaveBody;
    const request = createPostRequest(bodyWithoutText);
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Invalid request data');
  });

  test('returns 400 for empty recipe_text', async () => {
    const request = createPostRequest({ ...validSaveBody, recipe_text: '' });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Invalid request data');
  });

  test('returns 400 for invalid season', async () => {
    const request = createPostRequest({ ...validSaveBody, season: 'autumn' });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Invalid request data');
  });

  test('returns 500 when Supabase insert fails', async () => {
    mockSupabaseInsert.mockResolvedValueOnce({
      error: { message: 'Database error' },
    });

    const request = createPostRequest(validSaveBody);
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Failed to save recipe');
  });

  test('returns 500 on unexpected error', async () => {
    mockSupabaseInsert.mockRejectedValueOnce(new Error('Unexpected'));

    const request = createPostRequest(validSaveBody);
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Internal server error');
  });
});

describe('GET /api/recipes/[id] (get recipe)', () => {
  beforeEach(() => {
    mockCheckRateLimit.mockClear();
    mockCheckRateLimit.mockReturnValue({
      success: true,
      remaining: 59,
      resetTime: Date.now() + 60000,
    });
  });

  test('returns recipe for valid ID', async () => {
    const request = createGetRequest('test123456');
    const response = await GET(request, { params: Promise.resolve({ id: 'test123456' }) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.id).toBe('test123456');
    expect(data.cuisine).toBe('Italian');
    expect(data.recipe_text).toBe('Test recipe');
  });

  test('returns 429 when rate limited', async () => {
    mockCheckRateLimit.mockReturnValue({
      success: false,
      remaining: 0,
      resetTime: Date.now() + 60000,
    });

    const request = createGetRequest('test123456');
    const response = await GET(request, { params: Promise.resolve({ id: 'test123456' }) });
    const data = await response.json();

    expect(response.status).toBe(429);
    expect(data.error).toContain('Too many requests');
  });

  test('returns 400 for invalid ID format (too short)', async () => {
    const request = createGetRequest('abc');
    const response = await GET(request, { params: Promise.resolve({ id: 'abc' }) });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Invalid recipe ID format');
  });

  test('returns 400 for ID with special characters', async () => {
    const request = createGetRequest('test!@#$%');
    const response = await GET(request, { params: Promise.resolve({ id: 'test!@#$%' }) });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Invalid recipe ID format');
  });

  test('returns 404 when recipe not found', async () => {
    // Override the select mock for this test
    const originalSelect = mockSupabaseSelect;
    mockSupabaseSelect.mockReturnValueOnce({
      eq: mock(() => ({
        single: mock(() => Promise.resolve({ data: null, error: null })),
      })),
    });

    const request = createGetRequest('notfound1234');
    const response = await GET(request, { params: Promise.resolve({ id: 'notfound1234' }) });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe('Recipe not found');
  });

  test('returns 404 when Supabase returns error', async () => {
    mockSupabaseSelect.mockReturnValueOnce({
      eq: mock(() => ({
        single: mock(() =>
          Promise.resolve({ data: null, error: { message: 'Not found' } })
        ),
      })),
    });

    const request = createGetRequest('test123456');
    const response = await GET(request, { params: Promise.resolve({ id: 'test123456' }) });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe('Recipe not found');
  });
});
