'use client';

import { useState, useCallback } from 'react';
import type { RecipeRequest } from '@/types';

interface UseRecipeReturn {
  recipe: string | null;
  isLoading: boolean;
  error: string | null;
  generateRecipe: (request: RecipeRequest) => Promise<void>;
  clearRecipe: () => void;
  submitFeedback: (request: RecipeRequest) => Promise<void>;
}

export function useRecipe(): UseRecipeReturn {
  const [recipe, setRecipe] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateRecipe = useCallback(async (request: RecipeRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error('Failed to generate recipe');
      }

      const data = await response.json();
      setRecipe(data.recipe);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearRecipe = useCallback(() => {
    setRecipe(null);
    setError(null);
  }, []);

  const submitFeedback = useCallback(async (request: RecipeRequest) => {
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ recipe_inputs: request }),
      });
    } catch (err) {
      console.error('Failed to submit feedback:', err);
    }
  }, []);

  return {
    recipe,
    isLoading,
    error,
    generateRecipe,
    clearRecipe,
    submitFeedback,
  };
}
