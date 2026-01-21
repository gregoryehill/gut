'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/card';
import type { SelectedIngredients, Season } from '@/types';

interface RecipeCardProps {
  id: string;
  cuisine: string;
  season: Season;
  servings: number;
  ingredients: SelectedIngredients;
  createdAt: string;
}

// Extract a simple title from ingredients (feature + cuisine style)
function getRecipeTitle(ingredients: SelectedIngredients, cuisine: string): string {
  const feature = ingredients.feature?.name || 'Recipe';
  return `${cuisine} ${feature}`;
}

// Format relative time
function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return date.toLocaleDateString();
}

export function RecipeCard({
  id,
  cuisine,
  season,
  servings,
  ingredients,
  createdAt,
}: RecipeCardProps) {
  const title = getRecipeTitle(ingredients, cuisine);
  const relativeTime = getRelativeTime(createdAt);

  // Get the key ingredient names for display
  const ingredientNames = [
    ingredients.fat?.name,
    ingredients.foundation?.name,
    ingredients.feature?.name,
    ingredients.flavor?.name,
    ingredients.finish?.name,
  ].filter(Boolean);

  return (
    <Link href={`/recipe/${id}`}>
      <Card className="p-4 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer h-full flex flex-col">
        <div className="flex-1">
          <h3 className="font-serif text-lg font-semibold text-foreground mb-1 line-clamp-2">
            {title}
          </h3>
          <p className="text-xs text-muted-foreground mb-3">
            {season} &middot; {servings} servings &middot; {relativeTime}
          </p>
          <p className="text-sm text-muted-foreground/80 line-clamp-2">
            {ingredientNames.join(', ')}
          </p>
        </div>
      </Card>
    </Link>
  );
}
