'use client';

import { IngredientCard } from './IngredientCard';
import type {
  IngredientCategory,
  SelectedIngredients,
  LockedIngredients,
  SpecialtySuggestions,
} from '@/types';
import { INGREDIENT_CATEGORIES } from '@/types';

interface IngredientGridProps {
  ingredients: SelectedIngredients;
  lockedIngredients: LockedIngredients;
  specialtySuggestions: SpecialtySuggestions;
  onToggleLock: (category: IngredientCategory) => void;
  onReroll: (category: IngredientCategory) => void;
  onUseSpecialty: (category: IngredientCategory) => void;
  onSelect: (category: IngredientCategory) => void;
  isLoading?: boolean;
  canSelect?: boolean;
}

export function IngredientGrid({
  ingredients,
  lockedIngredients,
  specialtySuggestions,
  onToggleLock,
  onReroll,
  onUseSpecialty,
  onSelect,
  isLoading = false,
  canSelect = false,
}: IngredientGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
      {INGREDIENT_CATEGORIES.map((category) => (
        <IngredientCard
          key={category}
          category={category}
          ingredient={ingredients[category]}
          specialtySuggestion={specialtySuggestions[category]}
          isLocked={lockedIngredients[category]}
          onToggleLock={() => onToggleLock(category)}
          onReroll={() => onReroll(category)}
          onUseSpecialty={() => onUseSpecialty(category)}
          onSelect={() => onSelect(category)}
          isLoading={isLoading}
          canSelect={canSelect}
        />
      ))}
    </div>
  );
}
