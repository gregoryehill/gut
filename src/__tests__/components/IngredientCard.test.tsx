import { describe, expect, test, mock } from 'bun:test';
import { render, fireEvent } from '@testing-library/react';
import { IngredientCard } from '@/components/IngredientCard';
import type { Ingredient } from '@/types';

const mockIngredient: Ingredient = {
  id: 'test-1',
  name: 'Olive oil',
  category: 'fat',
  tags: ['italian', 'mediterranean'],
};

describe('IngredientCard', () => {
  test('renders category label', () => {
    const { getByText } = render(
      <IngredientCard
        category="fat"
        ingredient={mockIngredient}
        isLocked={false}
        onToggleLock={() => {}}
        onReroll={() => {}}
      />
    );

    expect(getByText('Fat')).toBeDefined();
  });

  test('renders category description', () => {
    const { getByText } = render(
      <IngredientCard
        category="fat"
        ingredient={mockIngredient}
        isLocked={false}
        onToggleLock={() => {}}
        onReroll={() => {}}
      />
    );

    expect(getByText('The cooking medium')).toBeDefined();
  });

  test('renders ingredient name', () => {
    const { getByText } = render(
      <IngredientCard
        category="fat"
        ingredient={mockIngredient}
        isLocked={false}
        onToggleLock={() => {}}
        onReroll={() => {}}
      />
    );

    expect(getByText('Olive oil')).toBeDefined();
  });

  test('shows placeholder when no ingredient', () => {
    const { getByText } = render(
      <IngredientCard
        category="fat"
        ingredient={null}
        isLocked={false}
        onToggleLock={() => {}}
        onReroll={() => {}}
      />
    );

    expect(getByText('Select a cuisine')).toBeDefined();
  });

  test('shows loading state', () => {
    const { container } = render(
      <IngredientCard
        category="fat"
        ingredient={null}
        isLocked={false}
        onToggleLock={() => {}}
        onReroll={() => {}}
        isLoading={true}
      />
    );

    // Should show loading skeleton
    const skeleton = container.querySelector('.animate-pulse');
    expect(skeleton).toBeDefined();
  });

  test('calls onToggleLock when lock button clicked', () => {
    const handleToggleLock = mock(() => {});
    const { getByText } = render(
      <IngredientCard
        category="fat"
        ingredient={mockIngredient}
        isLocked={false}
        onToggleLock={handleToggleLock}
        onReroll={() => {}}
      />
    );

    fireEvent.click(getByText('Lock'));

    expect(handleToggleLock).toHaveBeenCalledTimes(1);
  });

  test('calls onReroll when reroll button clicked', () => {
    const handleReroll = mock(() => {});
    const { getByText } = render(
      <IngredientCard
        category="fat"
        ingredient={mockIngredient}
        isLocked={false}
        onToggleLock={() => {}}
        onReroll={handleReroll}
      />
    );

    fireEvent.click(getByText('Reroll'));

    expect(handleReroll).toHaveBeenCalledTimes(1);
  });

  test('shows "Locked" when isLocked is true', () => {
    const { getByText } = render(
      <IngredientCard
        category="fat"
        ingredient={mockIngredient}
        isLocked={true}
        onToggleLock={() => {}}
        onReroll={() => {}}
      />
    );

    expect(getByText('Locked')).toBeDefined();
  });

  test('lock button is disabled when no ingredient', () => {
    const { getByText } = render(
      <IngredientCard
        category="fat"
        ingredient={null}
        isLocked={false}
        onToggleLock={() => {}}
        onReroll={() => {}}
      />
    );

    const lockButton = getByText('Lock').closest('button');
    expect(lockButton?.hasAttribute('disabled')).toBe(true);
  });

  test('reroll button is disabled when locked', () => {
    const { getByText } = render(
      <IngredientCard
        category="fat"
        ingredient={mockIngredient}
        isLocked={true}
        onToggleLock={() => {}}
        onReroll={() => {}}
      />
    );

    const rerollButton = getByText('Reroll').closest('button');
    expect(rerollButton?.hasAttribute('disabled')).toBe(true);
  });

  test('reroll button is disabled when no ingredient', () => {
    const { getByText } = render(
      <IngredientCard
        category="fat"
        ingredient={null}
        isLocked={false}
        onToggleLock={() => {}}
        onReroll={() => {}}
      />
    );

    const rerollButton = getByText('Reroll').closest('button');
    expect(rerollButton?.hasAttribute('disabled')).toBe(true);
  });

  test('reroll button is disabled when loading', () => {
    const { getByText } = render(
      <IngredientCard
        category="fat"
        ingredient={mockIngredient}
        isLocked={false}
        onToggleLock={() => {}}
        onReroll={() => {}}
        isLoading={true}
      />
    );

    const rerollButton = getByText('Reroll').closest('button');
    expect(rerollButton?.hasAttribute('disabled')).toBe(true);
  });

  test('renders all category types correctly', () => {
    const categories = ['fat', 'foundation', 'feature', 'flavor', 'finish'] as const;
    const expectedLabels = ['Fat', 'Foundation', 'Feature', 'Flavor', 'Finish'];

    categories.forEach((category, index) => {
      const { getByText, unmount } = render(
        <IngredientCard
          category={category}
          ingredient={{ ...mockIngredient, category }}
          isLocked={false}
          onToggleLock={() => {}}
          onReroll={() => {}}
        />
      );

      expect(getByText(expectedLabels[index])).toBeDefined();
      unmount();
    });
  });

  test('applies ring styling when locked', () => {
    const { container } = render(
      <IngredientCard
        category="fat"
        ingredient={mockIngredient}
        isLocked={true}
        onToggleLock={() => {}}
        onReroll={() => {}}
      />
    );

    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('ring-2');
  });
});
