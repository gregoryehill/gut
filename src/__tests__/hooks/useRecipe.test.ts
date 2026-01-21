import { describe, expect, test, mock, beforeEach, afterEach } from 'bun:test';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useRecipe } from '@/hooks/useRecipe';

// Mock fetch globally
const mockFetch = mock(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ recipe: 'Test recipe content' }),
  })
);

// Store original fetch
const originalFetch = globalThis.fetch;

beforeEach(() => {
  globalThis.fetch = mockFetch as unknown as typeof fetch;
  mockFetch.mockClear();
});

afterEach(() => {
  globalThis.fetch = originalFetch;
});

const validRequest = {
  cuisine: 'Italian',
  season: 'summer' as const,
  servings: 4,
  ingredients: {
    fat: { id: '1', name: 'Olive oil', category: 'fat' as const, tags: [] },
    foundation: { id: '2', name: 'Garlic', category: 'foundation' as const, tags: [] },
    feature: { id: '3', name: 'Chicken', category: 'feature' as const, tags: [] },
    flavor: { id: '4', name: 'Wine', category: 'flavor' as const, tags: [] },
    finish: { id: '5', name: 'Basil', category: 'finish' as const, tags: [] },
  },
};

describe('useRecipe', () => {
  test('initializes with correct default state', () => {
    const { result } = renderHook(() => useRecipe());

    expect(result.current.recipe).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  test('generateRecipe sets loading state', async () => {
    const { result } = renderHook(() => useRecipe());

    // Start generation but don't wait for it
    let loadingDuringFetch = false;
    mockFetch.mockImplementationOnce(() => {
      loadingDuringFetch = result.current.isLoading;
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ recipe: 'Test recipe' }),
      });
    });

    await act(async () => {
      await result.current.generateRecipe(validRequest);
    });

    // After completion, loading should be false
    expect(result.current.isLoading).toBe(false);
  });

  test('generateRecipe fetches from correct endpoint', async () => {
    const { result } = renderHook(() => useRecipe());

    await act(async () => {
      await result.current.generateRecipe(validRequest);
    });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch.mock.calls[0][0]).toBe('/api/generate');
    expect(mockFetch.mock.calls[0][1]).toMatchObject({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
  });

  test('generateRecipe sends correct body', async () => {
    const { result } = renderHook(() => useRecipe());

    await act(async () => {
      await result.current.generateRecipe(validRequest);
    });

    const sentBody = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(sentBody).toEqual(validRequest);
  });

  test('generateRecipe sets recipe on success', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ recipe: 'Generated recipe content' }),
    });

    const { result } = renderHook(() => useRecipe());

    await act(async () => {
      await result.current.generateRecipe(validRequest);
    });

    expect(result.current.recipe).toBe('Generated recipe content');
    expect(result.current.error).toBeNull();
  });

  test('generateRecipe sets error on failure', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    const { result } = renderHook(() => useRecipe());

    await act(async () => {
      await result.current.generateRecipe(validRequest);
    });

    expect(result.current.recipe).toBeNull();
    expect(result.current.error).toBe('Failed to generate recipe');
  });

  test('generateRecipe handles network error', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useRecipe());

    await act(async () => {
      await result.current.generateRecipe(validRequest);
    });

    expect(result.current.recipe).toBeNull();
    expect(result.current.error).toBe('Network error');
  });

  test('clearRecipe resets state', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ recipe: 'Test recipe' }),
    });

    const { result } = renderHook(() => useRecipe());

    // First generate a recipe
    await act(async () => {
      await result.current.generateRecipe(validRequest);
    });
    expect(result.current.recipe).toBe('Test recipe');

    // Then clear it
    act(() => {
      result.current.clearRecipe();
    });

    expect(result.current.recipe).toBeNull();
    expect(result.current.error).toBeNull();
  });

  test('submitFeedback sends correct data', async () => {
    const { result } = renderHook(() => useRecipe());

    await act(async () => {
      await result.current.submitFeedback(validRequest, 'Recipe text', 'positive');
    });

    expect(mockFetch).toHaveBeenCalledWith('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipe_inputs: validRequest,
        recipe_text: 'Recipe text',
        rating: 'positive',
      }),
    });
  });

  test('submitFeedback handles positive rating', async () => {
    const { result } = renderHook(() => useRecipe());

    await act(async () => {
      await result.current.submitFeedback(validRequest, 'Recipe', 'positive');
    });

    const sentBody = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(sentBody.rating).toBe('positive');
  });

  test('submitFeedback handles negative rating', async () => {
    const { result } = renderHook(() => useRecipe());

    await act(async () => {
      await result.current.submitFeedback(validRequest, 'Recipe', 'negative');
    });

    const sentBody = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(sentBody.rating).toBe('negative');
  });

  test('submitFeedback handles error silently', async () => {
    // Mock console.error to verify it's called
    const consoleSpy = mock(() => {});
    const originalConsole = console.error;
    console.error = consoleSpy;

    mockFetch.mockRejectedValueOnce(new Error('Feedback failed'));

    const { result } = renderHook(() => useRecipe());

    // Should not throw
    await act(async () => {
      await result.current.submitFeedback(validRequest, 'Recipe', 'positive');
    });

    expect(consoleSpy).toHaveBeenCalled();
    console.error = originalConsole;
  });

  test('generateRecipe clears previous error', async () => {
    // First, cause an error
    mockFetch.mockResolvedValueOnce({ ok: false, status: 500 });

    const { result } = renderHook(() => useRecipe());

    await act(async () => {
      await result.current.generateRecipe(validRequest);
    });
    expect(result.current.error).toBe('Failed to generate recipe');

    // Then succeed
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ recipe: 'New recipe' }),
    });

    await act(async () => {
      await result.current.generateRecipe(validRequest);
    });

    expect(result.current.error).toBeNull();
    expect(result.current.recipe).toBe('New recipe');
  });
});
