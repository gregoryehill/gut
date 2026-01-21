'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { RecipeCard } from '@/components/RecipeCard';
import type { SelectedIngredients, Season } from '@/types';

interface RecipeListItem {
  id: string;
  cuisine: string;
  season: Season;
  servings: number;
  ingredients: SelectedIngredients;
  created_at: string;
}

interface RecipesResponse {
  recipes: RecipeListItem[];
  total: number;
}

export function RecentRecipes() {
  const [recipes, setRecipes] = useState<RecipeListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRecent() {
      try {
        const response = await fetch('/api/recipes?limit=3');
        if (response.ok) {
          const data: RecipesResponse = await response.json();
          setRecipes(data.recipes);
          setTotal(data.total);
        }
      } catch {
        // Silently fail - this is a nice-to-have feature
      } finally {
        setIsLoading(false);
      }
    }
    fetchRecent();
  }, []);

  // Don't show anything if loading or no recipes
  if (isLoading || recipes.length === 0) {
    return null;
  }

  return (
    <section className="mt-16 pt-12 border-t border-foreground/10">
      <div className="flex items-baseline justify-between mb-6">
        <h2 className="font-serif text-2xl font-normal">Recent Recipes</h2>
        {total > 3 && (
          <Link
            href="/recipes"
            className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
          >
            View all {total} &rarr;
          </Link>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            id={recipe.id}
            cuisine={recipe.cuisine}
            season={recipe.season}
            servings={recipe.servings}
            ingredients={recipe.ingredients}
            createdAt={recipe.created_at}
          />
        ))}
      </div>
    </section>
  );
}
