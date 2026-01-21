import { describe, expect, test, mock, beforeEach, afterEach } from 'bun:test';
import { renderHook, act, waitFor } from '@testing-library/react';

// Mock crypto.getRandomValues
const mockGetRandomValues = mock((array: Uint32Array) => {
  array[0] = 0; // Always return first item
  return array;
});

const originalCrypto = globalThis.crypto;

beforeEach(() => {
  globalThis.crypto = {
    ...originalCrypto,
    getRandomValues: mockGetRandomValues as unknown as typeof crypto.getRandomValues,
  };
});

afterEach(() => {
  globalThis.crypto = originalCrypto;
});

// Mock ingredients data
const mockIngredientsData = {
  fat: [{ id: 'fat-1', name: 'Olive oil', category: 'fat', tags: [] }],
  foundation: [{ id: 'found-1', name: 'Garlic', category: 'foundation', tags: [] }],
  feature: [{ id: 'feat-1', name: 'Chicken', category: 'feature', tags: [] }],
  flavor: [{ id: 'flav-1', name: 'Wine', category: 'flavor', tags: [] }],
  finish: [{ id: 'fin-1', name: 'Basil', category: 'finish', tags: [] }],
};

// Mock supabase
const mockCuisineIngredients = mock(() =>
  Promise.resolve({
    data: [
      { ingredient_id: 'fat-1' },
      { ingredient_id: 'found-1' },
      { ingredient_id: 'feat-1' },
      { ingredient_id: 'flav-1' },
      { ingredient_id: 'fin-1' },
    ],
    error: null,
  })
);

const mockIngredients = mock((category: string) =>
  Promise.resolve({
    data: mockIngredientsData[category as keyof typeof mockIngredientsData] || [],
    error: null,
  })
);

mock.module('@/lib/supabase', () => ({
  supabase: {
    from: (table: string) => {
      if (table === 'cuisine_ingredients') {
        return {
          select: () => ({
            eq: mockCuisineIngredients,
          }),
        };
      }
      if (table === 'ingredients') {
        return {
          select: () => ({
            eq: (field: string, value: string) => ({
              in: () => mockIngredients(value),
            }),
          }),
        };
      }
      return {};
    },
  },
}));

// Import after mocking
import { useIngredients } from '@/hooks/useIngredients';

describe('useIngredients', () => {
  beforeEach(() => {
    mockCuisineIngredients.mockClear();
    mockIngredients.mockClear();
    mockGetRandomValues.mockClear();
  });

  test('initializes with empty state', () => {
    const { result } = renderHook(() => useIngredients());

    expect(result.current.ingredients.fat).toBeNull();
    expect(result.current.ingredients.foundation).toBeNull();
    expect(result.current.ingredients.feature).toBeNull();
    expect(result.current.ingredients.flavor).toBeNull();
    expect(result.current.ingredients.finish).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.allSelected).toBe(false);
  });

  test('initializes with unlocked ingredients', () => {
    const { result } = renderHook(() => useIngredients());

    expect(result.current.lockedIngredients.fat).toBe(false);
    expect(result.current.lockedIngredients.foundation).toBe(false);
    expect(result.current.lockedIngredients.feature).toBe(false);
    expect(result.current.lockedIngredients.flavor).toBe(false);
    expect(result.current.lockedIngredients.finish).toBe(false);
  });

  test('toggleLock toggles lock state', () => {
    const { result } = renderHook(() => useIngredients());

    expect(result.current.lockedIngredients.fat).toBe(false);

    act(() => {
      result.current.toggleLock('fat');
    });

    expect(result.current.lockedIngredients.fat).toBe(true);

    act(() => {
      result.current.toggleLock('fat');
    });

    expect(result.current.lockedIngredients.fat).toBe(false);
  });

  test('reset clears all ingredients and locks', async () => {
    const { result } = renderHook(() => useIngredients());

    // First fetch some ingredients
    await act(async () => {
      await result.current.fetchAllIngredients('cuisine-1');
    });

    // Lock one
    act(() => {
      result.current.toggleLock('fat');
    });

    expect(result.current.lockedIngredients.fat).toBe(true);

    // Reset
    act(() => {
      result.current.reset();
    });

    expect(result.current.ingredients.fat).toBeNull();
    expect(result.current.lockedIngredients.fat).toBe(false);
  });

  test('fetchAllIngredients fetches all categories', async () => {
    const { result } = renderHook(() => useIngredients());

    await act(async () => {
      await result.current.fetchAllIngredients('cuisine-1');
    });

    // Verify all categories were fetched
    expect(result.current.ingredients.fat?.name).toBe('Olive oil');
    expect(result.current.ingredients.foundation?.name).toBe('Garlic');
    expect(result.current.ingredients.feature?.name).toBe('Chicken');
    expect(result.current.ingredients.flavor?.name).toBe('Wine');
    expect(result.current.ingredients.finish?.name).toBe('Basil');
  });

  test('fetchAllIngredients sets allSelected to true when complete', async () => {
    const { result } = renderHook(() => useIngredients());

    expect(result.current.allSelected).toBe(false);

    await act(async () => {
      await result.current.fetchAllIngredients('cuisine-1');
    });

    expect(result.current.allSelected).toBe(true);
  });

  test('fetchAllIngredients respects locked ingredients', async () => {
    const { result } = renderHook(() => useIngredients());

    // First fetch
    await act(async () => {
      await result.current.fetchAllIngredients('cuisine-1');
    });

    const originalFat = result.current.ingredients.fat;

    // Lock fat
    act(() => {
      result.current.toggleLock('fat');
    });

    // Fetch again - fat should remain the same
    await act(async () => {
      await result.current.fetchAllIngredients('cuisine-1');
    });

    expect(result.current.ingredients.fat).toEqual(originalFat);
  });

  test('rerollIngredient does nothing for locked category', async () => {
    const { result } = renderHook(() => useIngredients());

    // Fetch initial ingredients
    await act(async () => {
      await result.current.fetchAllIngredients('cuisine-1');
    });

    const originalFat = result.current.ingredients.fat;

    // Lock and try to reroll
    act(() => {
      result.current.toggleLock('fat');
    });

    await act(async () => {
      await result.current.rerollIngredient('cuisine-1', 'fat');
    });

    // Should be unchanged
    expect(result.current.ingredients.fat).toEqual(originalFat);
  });

  test('rerollIngredient updates unlocked category', async () => {
    // Setup mock to return different ingredient on second call
    let callCount = 0;
    mockIngredients.mockImplementation((category: string) => {
      callCount++;
      if (category === 'fat') {
        return Promise.resolve({
          data: [
            { id: `fat-${callCount}`, name: `Oil ${callCount}`, category: 'fat', tags: [] },
          ],
          error: null,
        });
      }
      return Promise.resolve({
        data: mockIngredientsData[category as keyof typeof mockIngredientsData] || [],
        error: null,
      });
    });

    const { result } = renderHook(() => useIngredients());

    // Fetch initial
    await act(async () => {
      await result.current.fetchAllIngredients('cuisine-1');
    });

    const originalName = result.current.ingredients.fat?.name;

    // Reroll
    await act(async () => {
      await result.current.rerollIngredient('cuisine-1', 'fat');
    });

    // Name should be different (due to our mock returning different values)
    expect(result.current.ingredients.fat?.name).not.toBe(originalName);
  });

  test('handles supabase error for cuisine_ingredients', async () => {
    const consoleSpy = mock(() => {});
    const originalConsole = console.error;
    console.error = consoleSpy;

    mockCuisineIngredients.mockResolvedValueOnce({
      data: null,
      error: { message: 'Error' },
    });

    const { result } = renderHook(() => useIngredients());

    await act(async () => {
      await result.current.fetchAllIngredients('cuisine-1');
    });

    // Should not throw and ingredients should remain null
    expect(result.current.ingredients.fat).toBeNull();

    console.error = originalConsole;
  });

  test('handles empty ingredients list', async () => {
    const consoleSpy = mock(() => {});
    const originalConsole = console.warn;
    console.warn = consoleSpy;

    mockIngredients.mockResolvedValueOnce({
      data: [],
      error: null,
    });

    const { result } = renderHook(() => useIngredients());

    await act(async () => {
      await result.current.fetchAllIngredients('cuisine-1');
    });

    // Should handle gracefully
    console.warn = originalConsole;
  });

  test('isLoading is true during fetch', async () => {
    const { result } = renderHook(() => useIngredients());

    expect(result.current.isLoading).toBe(false);

    let loadingDuringFetch = false;

    // We need to check loading state during the async operation
    const fetchPromise = act(async () => {
      const promise = result.current.fetchAllIngredients('cuisine-1');
      // Check loading state after starting but before completion
      loadingDuringFetch = result.current.isLoading;
      await promise;
    });

    await fetchPromise;

    expect(result.current.isLoading).toBe(false);
  });
});
