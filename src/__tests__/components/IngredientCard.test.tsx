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

const mockSpecialty: Ingredient = {
  id: 'test-2',
  name: 'Sesame oil',
  category: 'fat',
  tags: ['asian'],
};

const defaultProps = {
  category: 'fat' as const,
  ingredient: mockIngredient,
  specialtySuggestion: null as Ingredient | null,
  isLocked: false,
  onToggleLock: () => {},
  onReroll: () => {},
  onUseSpecialty: () => {},
  onSelect: () => {},
};

describe('IngredientCard', () => {
  test('renders category label', () => {
    const { getByText } = render(
      <IngredientCard {...defaultProps} />
    );

    expect(getByText('Fat')).toBeDefined();
  });

  test('renders category description', () => {
    const { getByText } = render(
      <IngredientCard {...defaultProps} />
    );

    expect(getByText('The cooking medium')).toBeDefined();
  });

  test('renders ingredient name', () => {
    const { getByText } = render(
      <IngredientCard {...defaultProps} />
    );

    expect(getByText('Olive oil')).toBeDefined();
  });

  test('shows placeholder when no ingredient', () => {
    const { getByText } = render(
      <IngredientCard {...defaultProps} ingredient={null} />
    );

    expect(getByText('Select a cuisine')).toBeDefined();
  });

  test('shows loading state', () => {
    const { container } = render(
      <IngredientCard {...defaultProps} ingredient={null} isLoading={true} />
    );

    // Should show loading skeleton
    const skeleton = container.querySelector('.animate-pulse');
    expect(skeleton).toBeDefined();
  });

  test('calls onToggleLock when lock button clicked', () => {
    const handleToggleLock = mock(() => {});
    const { getByText } = render(
      <IngredientCard {...defaultProps} onToggleLock={handleToggleLock} />
    );

    fireEvent.click(getByText('Lock'));

    expect(handleToggleLock).toHaveBeenCalledTimes(1);
  });

  test('calls onReroll when reroll button clicked', () => {
    const handleReroll = mock(() => {});
    const { getByText } = render(
      <IngredientCard {...defaultProps} onReroll={handleReroll} />
    );

    fireEvent.click(getByText('Reroll'));

    expect(handleReroll).toHaveBeenCalledTimes(1);
  });

  test('shows "Locked" when isLocked is true', () => {
    const { getByText } = render(
      <IngredientCard {...defaultProps} isLocked={true} />
    );

    expect(getByText('Locked')).toBeDefined();
  });

  test('lock button is disabled when no ingredient', () => {
    const { getByText } = render(
      <IngredientCard {...defaultProps} ingredient={null} />
    );

    const lockButton = getByText('Lock').closest('button');
    expect(lockButton?.hasAttribute('disabled')).toBe(true);
  });

  test('reroll button is disabled when locked', () => {
    const { getByText } = render(
      <IngredientCard {...defaultProps} isLocked={true} />
    );

    const rerollButton = getByText('Reroll').closest('button');
    expect(rerollButton?.hasAttribute('disabled')).toBe(true);
  });

  test('reroll button is disabled when no ingredient', () => {
    const { getByText } = render(
      <IngredientCard {...defaultProps} ingredient={null} />
    );

    const rerollButton = getByText('Reroll').closest('button');
    expect(rerollButton?.hasAttribute('disabled')).toBe(true);
  });

  test('reroll button is disabled when loading', () => {
    const { getByText } = render(
      <IngredientCard {...defaultProps} isLoading={true} />
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
          {...defaultProps}
          category={category}
          ingredient={{ ...mockIngredient, category }}
        />
      );

      expect(getByText(expectedLabels[index])).toBeDefined();
      unmount();
    });
  });

  test('applies ring styling when locked', () => {
    const { container } = render(
      <IngredientCard {...defaultProps} isLocked={true} />
    );

    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('ring-2');
  });

  test('calls onUseSpecialty when specialty suggestion clicked', () => {
    const handleUseSpecialty = mock(() => {});
    const { getByText } = render(
      <IngredientCard
        {...defaultProps}
        specialtySuggestion={mockSpecialty}
        onUseSpecialty={handleUseSpecialty}
      />
    );

    fireEvent.click(getByText('Sesame oil'));

    expect(handleUseSpecialty).toHaveBeenCalledTimes(1);
  });

  test('calls onSelect when ingredient name clicked and canSelect is true', () => {
    const handleSelect = mock(() => {});
    const { getByText } = render(
      <IngredientCard
        {...defaultProps}
        onSelect={handleSelect}
        canSelect={true}
      />
    );

    fireEvent.click(getByText('Olive oil'));

    expect(handleSelect).toHaveBeenCalledTimes(1);
  });

  test('does not call onSelect when ingredient name clicked and canSelect is false', () => {
    const handleSelect = mock(() => {});
    const { getByText } = render(
      <IngredientCard
        {...defaultProps}
        onSelect={handleSelect}
        canSelect={false}
      />
    );

    fireEvent.click(getByText('Olive oil'));

    expect(handleSelect).toHaveBeenCalledTimes(0);
  });

  test('does not call onSelect when locked', () => {
    const handleSelect = mock(() => {});
    const { getByText } = render(
      <IngredientCard
        {...defaultProps}
        onSelect={handleSelect}
        canSelect={true}
        isLocked={true}
      />
    );

    fireEvent.click(getByText('Olive oil'));

    expect(handleSelect).toHaveBeenCalledTimes(0);
  });

  test('shows "Choose" button when canSelect true and no ingredient', () => {
    const { getByText } = render(
      <IngredientCard {...defaultProps} ingredient={null} canSelect={true} />
    );

    expect(getByText('Choose')).toBeDefined();
  });
});
