'use client';

import { IngredientCard } from './IngredientCard';
import type {
  IngredientCategory,
  SelectedIngredients,
  LockedIngredients,
} from '@/types';
import { INGREDIENT_CATEGORIES } from '@/types';

interface IngredientGridProps {
  ingredients: SelectedIngredients;
  lockedIngredients: LockedIngredients;
  onToggleLock: (category: IngredientCategory) => void;
  onReroll: (category: IngredientCategory) => void;
  isLoading?: boolean;
}

export function IngredientGrid({
  ingredients,
  lockedIngredients,
  onToggleLock,
  onReroll,
  isLoading = false,
}: IngredientGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
      {INGREDIENT_CATEGORIES.map((category) => (
        <IngredientCard
          key={category}
          category={category}
          ingredient={ingredients[category]}
          isLocked={lockedIngredients[category]}
          onToggleLock={() => onToggleLock(category)}
          onReroll={() => onReroll(category)}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
}
