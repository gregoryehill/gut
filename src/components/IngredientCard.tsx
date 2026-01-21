'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Ingredient, IngredientCategory } from '@/types';
import { CATEGORY_LABELS, CATEGORY_DESCRIPTIONS } from '@/types';

interface IngredientCardProps {
  category: IngredientCategory;
  ingredient: Ingredient | null;
  isLocked: boolean;
  onToggleLock: () => void;
  onReroll: () => void;
  isLoading?: boolean;
}

const CATEGORY_COLORS: Record<IngredientCategory, string> = {
  fat: 'bg-amber-50 border-amber-200',
  foundation: 'bg-orange-50 border-orange-200',
  feature: 'bg-rose-50 border-rose-200',
  flavor: 'bg-purple-50 border-purple-200',
  finish: 'bg-emerald-50 border-emerald-200',
};

export function IngredientCard({
  category,
  ingredient,
  isLocked,
  onToggleLock,
  onReroll,
  isLoading = false,
}: IngredientCardProps) {
  return (
    <Card
      className={`p-3 sm:p-4 transition-all duration-200 hover:shadow-md ${CATEGORY_COLORS[category]} ${
        isLocked ? 'ring-2 ring-primary' : ''
      }`}
    >
      <div className="flex flex-col gap-1.5 sm:gap-2">
        {/* Category header */}
        <div>
          <h3 className="font-serif text-base sm:text-lg font-medium">
            {CATEGORY_LABELS[category]}
          </h3>
          <p className="text-[10px] sm:text-xs text-muted-foreground leading-tight">
            {CATEGORY_DESCRIPTIONS[category]}
          </p>
        </div>

        {/* Ingredient name */}
        <div className="min-h-[2rem] sm:min-h-[2.5rem] flex items-center">
          {isLoading ? (
            <div className="h-4 sm:h-5 w-20 sm:w-24 bg-muted animate-pulse rounded" />
          ) : ingredient ? (
            <p className="text-sm sm:text-base font-medium">{ingredient.name}</p>
          ) : (
            <p className="text-xs sm:text-sm text-muted-foreground italic">
              Select a cuisine
            </p>
          )}
        </div>

        {/* Controls */}
        <div className="flex gap-1.5 sm:gap-2 mt-0.5 sm:mt-1">
          <Button
            variant={isLocked ? 'default' : 'outline'}
            size="sm"
            onClick={onToggleLock}
            disabled={!ingredient}
            className="flex-1 text-xs sm:text-sm px-2 sm:px-3"
          >
            {isLocked ? '🔒' : '🔓'}
            <span className="hidden sm:inline ml-1">{isLocked ? 'Locked' : 'Lock'}</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onReroll}
            disabled={isLocked || !ingredient || isLoading}
            className="flex-1 text-xs sm:text-sm px-2 sm:px-3"
          >
            🎲
            <span className="hidden sm:inline ml-1">Re-roll</span>
          </Button>
        </div>
      </div>
    </Card>
  );
}
