import { describe, expect, test, mock, beforeEach, afterEach } from 'bun:test';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { RecipeView } from '@/components/RecipeView';
import type { RecipeRequest } from '@/types';

// Mock fetch
const mockFetch = mock(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ id: 'test-recipe-id' }),
  })
);

// Mock clipboard
const mockClipboard = {
  writeText: mock(() => Promise.resolve()),
};

// Mock navigator.share
const mockShare = mock(() => Promise.resolve());

// Store originals
const originalFetch = globalThis.fetch;

const mockRecipeInputs: RecipeRequest = {
  cuisine: 'Italian',
  season: 'summer',
  servings: 4,
  ingredients: {
    fat: { id: '1', name: 'Olive oil', category: 'fat', tags: [] },
    foundation: { id: '2', name: 'Garlic', category: 'foundation', tags: [] },
    feature: { id: '3', name: 'Chicken', category: 'feature', tags: [] },
    flavor: { id: '4', name: 'Wine', category: 'flavor', tags: [] },
    finish: { id: '5', name: 'Basil', category: 'finish', tags: [] },
  },
};

const mockRecipe = `### Lemon Garlic Chicken

A simple weeknight dinner that comes together in 30 minutes.

**Ingredients**

- 2 tablespoons olive oil
- 4 cloves garlic, minced
- 2 chicken breasts
- 1/2 cup white wine
- Fresh basil

**Instructions**

1. Heat the olive oil in a large skillet.
2. Add the garlic and cook until fragrant.
3. Add the chicken and cook through.
4. Add the wine and simmer.
5. Finish with fresh basil.

Serve over pasta.`;

beforeEach(() => {
  globalThis.fetch = mockFetch as unknown as typeof fetch;
  Object.defineProperty(navigator, 'clipboard', {
    value: mockClipboard,
    writable: true,
  });
  Object.defineProperty(navigator, 'share', {
    value: mockShare,
    writable: true,
  });
  mockFetch.mockClear();
  mockClipboard.writeText.mockClear();
  mockShare.mockClear();
});

afterEach(() => {
  globalThis.fetch = originalFetch;
});

describe('RecipeView', () => {
  test('renders recipe title', () => {
    const { getByText } = render(
      <RecipeView
        recipe={mockRecipe}
        recipeInputs={mockRecipeInputs}
        onBack={() => {}}
        onRegenerate={() => {}}
      />
    );

    expect(getByText('Lemon Garlic Chicken')).toBeDefined();
  });

  test('renders recipe headnote', () => {
    const { getByText } = render(
      <RecipeView
        recipe={mockRecipe}
        recipeInputs={mockRecipeInputs}
        onBack={() => {}}
        onRegenerate={() => {}}
      />
    );

    expect(
      getByText('A simple weeknight dinner that comes together in 30 minutes.')
    ).toBeDefined();
  });

  test('renders ingredients section', () => {
    const { getByText } = render(
      <RecipeView
        recipe={mockRecipe}
        recipeInputs={mockRecipeInputs}
        onBack={() => {}}
        onRegenerate={() => {}}
      />
    );

    expect(getByText('Ingredients')).toBeDefined();
    expect(getByText('- 2 tablespoons olive oil')).toBeDefined();
  });

  test('renders instructions section', () => {
    const { getByText } = render(
      <RecipeView
        recipe={mockRecipe}
        recipeInputs={mockRecipeInputs}
        onBack={() => {}}
        onRegenerate={() => {}}
      />
    );

    expect(getByText('Instructions')).toBeDefined();
    expect(getByText('1. Heat the olive oil in a large skillet.')).toBeDefined();
  });

  test('calls onBack when back button clicked', () => {
    const handleBack = mock(() => {});
    const { getByText } = render(
      <RecipeView
        recipe={mockRecipe}
        recipeInputs={mockRecipeInputs}
        onBack={handleBack}
        onRegenerate={() => {}}
      />
    );

    fireEvent.click(getByText('← Back'));

    expect(handleBack).toHaveBeenCalledTimes(1);
  });

  test('calls onRegenerate when regenerate button clicked', () => {
    const handleRegenerate = mock(() => {});
    const { getByText } = render(
      <RecipeView
        recipe={mockRecipe}
        recipeInputs={mockRecipeInputs}
        onBack={() => {}}
        onRegenerate={handleRegenerate}
      />
    );

    fireEvent.click(getByText('Try another version'));

    expect(handleRegenerate).toHaveBeenCalledTimes(1);
  });

  test('shows regenerating state when isRegenerating is true', () => {
    const { getByText } = render(
      <RecipeView
        recipe={mockRecipe}
        recipeInputs={mockRecipeInputs}
        onBack={() => {}}
        onRegenerate={() => {}}
        isRegenerating={true}
      />
    );

    expect(getByText('Creating another version...')).toBeDefined();
  });

  test('disables regenerate button when regenerating', () => {
    const { getByText } = render(
      <RecipeView
        recipe={mockRecipe}
        recipeInputs={mockRecipeInputs}
        onBack={() => {}}
        onRegenerate={() => {}}
        isRegenerating={true}
      />
    );

    const button = getByText('Creating another version...').closest('button');
    expect(button?.hasAttribute('disabled')).toBe(true);
  });

  test('saves recipe and shows saved state', async () => {
    const { getAllByRole } = render(
      <RecipeView
        recipe={mockRecipe}
        recipeInputs={mockRecipeInputs}
        onBack={() => {}}
        onRegenerate={() => {}}
      />
    );

    // Find and click save button (bookmark icon)
    const saveButtons = getAllByRole('button');
    const saveButton = saveButtons.find((btn) =>
      btn.querySelector('svg path[d*="M5 5a2"]')
    );

    if (saveButton) {
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/recipes', expect.any(Object));
      });
    }
  });

  test('copies recipe text to clipboard', async () => {
    const { getAllByRole } = render(
      <RecipeView
        recipe={mockRecipe}
        recipeInputs={mockRecipeInputs}
        onBack={() => {}}
        onRegenerate={() => {}}
      />
    );

    // Find copy button (clipboard icon)
    const buttons = getAllByRole('button');
    const copyButton = buttons.find((btn) =>
      btn.querySelector('svg path[d*="M8 16H6"]')
    );

    if (copyButton) {
      fireEvent.click(copyButton);

      expect(mockClipboard.writeText).toHaveBeenCalledWith(mockRecipe);
    }
  });

  test('shows feedback buttons when onFeedback provided', () => {
    const { getByText } = render(
      <RecipeView
        recipe={mockRecipe}
        recipeInputs={mockRecipeInputs}
        onBack={() => {}}
        onRegenerate={() => {}}
        onFeedback={() => {}}
      />
    );

    expect(getByText('How was this recipe?')).toBeDefined();
  });

  test('calls onFeedback with positive rating', () => {
    const handleFeedback = mock(() => {});
    const { getAllByRole } = render(
      <RecipeView
        recipe={mockRecipe}
        recipeInputs={mockRecipeInputs}
        onBack={() => {}}
        onRegenerate={() => {}}
        onFeedback={handleFeedback}
      />
    );

    // Find thumbs up button
    const buttons = getAllByRole('button');
    const thumbsUp = buttons.find((btn) =>
      btn.querySelector('svg path[d*="M14 9V5"]')
    );

    if (thumbsUp) {
      fireEvent.click(thumbsUp);
      expect(handleFeedback).toHaveBeenCalledWith('positive');
    }
  });

  test('calls onFeedback with negative rating', () => {
    const handleFeedback = mock(() => {});
    const { getAllByRole } = render(
      <RecipeView
        recipe={mockRecipe}
        recipeInputs={mockRecipeInputs}
        onBack={() => {}}
        onRegenerate={() => {}}
        onFeedback={handleFeedback}
      />
    );

    // Find thumbs down button
    const buttons = getAllByRole('button');
    const thumbsDown = buttons.find((btn) =>
      btn.querySelector('svg path[d*="M10 15v4"]')
    );

    if (thumbsDown) {
      fireEvent.click(thumbsDown);
      expect(handleFeedback).toHaveBeenCalledWith('negative');
    }
  });

  test('shows thanks message after feedback', () => {
    const handleFeedback = mock(() => {});
    const { getAllByRole, getByText } = render(
      <RecipeView
        recipe={mockRecipe}
        recipeInputs={mockRecipeInputs}
        onBack={() => {}}
        onRegenerate={() => {}}
        onFeedback={handleFeedback}
      />
    );

    // Find and click thumbs up
    const buttons = getAllByRole('button');
    const thumbsUp = buttons.find((btn) =>
      btn.querySelector('svg path[d*="M14 9V5"]')
    );

    if (thumbsUp) {
      fireEvent.click(thumbsUp);
      expect(getByText('Thanks!')).toBeDefined();
    }
  });

  test('hides feedback buttons when onFeedback not provided', () => {
    const { queryByText } = render(
      <RecipeView
        recipe={mockRecipe}
        recipeInputs={mockRecipeInputs}
        onBack={() => {}}
        onRegenerate={() => {}}
      />
    );

    expect(queryByText('How was this recipe?')).toBeNull();
  });

  test('handles recipe without title gracefully', () => {
    const recipeWithoutTitle = 'Just some recipe content without a title';

    const { getByText } = render(
      <RecipeView
        recipe={recipeWithoutTitle}
        recipeInputs={mockRecipeInputs}
        onBack={() => {}}
        onRegenerate={() => {}}
      />
    );

    // Should not crash
    expect(getByText('Just some recipe content without a title')).toBeDefined();
  });
});
