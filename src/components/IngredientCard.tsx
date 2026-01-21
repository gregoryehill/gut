'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Ingredient, IngredientCategory } from '@/types';
import { CATEGORY_LABELS, CATEGORY_DESCRIPTIONS } from '@/types';

interface IngredientCardProps {
  category: IngredientCategory;
  ingredient: Ingredient | null;
  specialtySuggestion: Ingredient | null;
  isLocked: boolean;
  onToggleLock: () => void;
  onReroll: () => void;
  onUseSpecialty: () => void;
  isLoading?: boolean;
}

const CATEGORY_COLORS: Record<IngredientCategory, string> = {
  fat: 'bg-[var(--category-fat)] border-[var(--category-fat-border)]',
  foundation: 'bg-[var(--category-foundation)] border-[var(--category-foundation-border)]',
  feature: 'bg-[var(--category-feature)] border-[var(--category-feature-border)]',
  flavor: 'bg-[var(--category-flavor)] border-[var(--category-flavor-border)]',
  finish: 'bg-[var(--category-finish)] border-[var(--category-finish-border)]',
};

export function IngredientCard({
  category,
  ingredient,
  specialtySuggestion,
  isLocked,
  onToggleLock,
  onReroll,
  onUseSpecialty,
  isLoading = false,
}: IngredientCardProps) {
  return (
    <Card
      className={`p-4 sm:p-5 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${CATEGORY_COLORS[category]} ${
        isLocked ? 'ring-2 ring-primary/50' : ''
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Category header */}
        <div className="mb-2">
          <h3 className="font-serif text-lg sm:text-xl font-semibold text-foreground">
            {CATEGORY_LABELS[category]}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground leading-tight">
            {CATEGORY_DESCRIPTIONS[category]}
          </p>
        </div>

        {/* Ingredient name - the hero */}
        <div className="flex-1 min-h-[3.5rem] sm:min-h-[4rem] flex flex-col items-center justify-center text-center py-3">
          {isLoading && !isLocked ? (
            <div className="h-6 w-28 bg-muted/50 animate-pulse rounded" />
          ) : ingredient ? (
            <>
              <p className="font-serif text-xl sm:text-2xl font-medium text-foreground">
                {ingredient.name}
              </p>
              {/* Specialty suggestion - clickable to swap */}
              {specialtySuggestion && !isLocked && (
                <button
                  onClick={onUseSpecialty}
                  className="mt-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  title={`Switch to ${specialtySuggestion.name}`}
                >
                  or try: <span className="underline underline-offset-2">{specialtySuggestion.name}</span>
                </button>
              )}
            </>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              Select a cuisine
            </p>
          )}
        </div>

        {/* Controls */}
        <div className="flex gap-2 mt-auto pt-2">
          <Button
            variant={isLocked ? 'default' : 'outline'}
            size="sm"
            onClick={onToggleLock}
            disabled={!ingredient}
            className="flex-1 text-xs font-medium"
          >
            {isLocked ? 'Locked' : 'Lock'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onReroll}
            disabled={isLocked || !ingredient || isLoading}
            className="flex-1 text-xs font-medium"
          >
            Reroll
          </Button>
        </div>
      </div>
    </Card>
  );
}
