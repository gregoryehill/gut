'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
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
  limit: number;
  offset: number;
}

const PAGE_SIZE = 12;

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<RecipeListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecipes = useCallback(async (newOffset: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/recipes?limit=${PAGE_SIZE}&offset=${newOffset}`);
      if (!response.ok) {
        throw new Error('Failed to fetch recipes');
      }
      const data: RecipesResponse = await response.json();
      setRecipes(data.recipes);
      setTotal(data.total);
      setOffset(newOffset);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecipes(0);
  }, [fetchRecipes]);

  const hasMore = offset + PAGE_SIZE < total;
  const hasPrev = offset > 0;
  const currentPage = Math.floor(offset / PAGE_SIZE) + 1;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back link */}
        <Link href="/">
          <Button variant="ghost" className="mb-8">
            &larr; Back to app
          </Button>
        </Link>

        {/* Hero */}
        <header className="mb-8 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-normal mb-3">
            Saved Recipes
          </h1>
          <p className="text-muted-foreground text-lg">
            Browse recipes created by the GUT community.
          </p>
          {!isLoading && !error && total > 0 && (
            <p className="text-muted-foreground text-sm mt-2">
              {total} recipe{total !== 1 ? 's' : ''} saved
            </p>
          )}
        </header>

        {/* Loading state */}
        {isLoading && (
          <div className="text-center text-muted-foreground py-12">
            Loading recipes...
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="text-center text-destructive py-12">
            {error}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && recipes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No recipes saved yet.</p>
            <Link href="/">
              <Button className="font-serif">Create the first one &rarr;</Button>
            </Link>
          </div>
        )}

        {/* Recipe grid */}
        {!isLoading && !error && recipes.length > 0 && (
          <>
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <Button
                  variant="outline"
                  onClick={() => fetchRecipes(offset - PAGE_SIZE)}
                  disabled={!hasPrev || isLoading}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => fetchRecipes(offset + PAGE_SIZE)}
                  disabled={!hasMore || isLoading}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link href="/">
            <Button size="lg" className="font-serif text-lg px-8">
              Create a Recipe &rarr;
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
