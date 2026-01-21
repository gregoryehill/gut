'use client';

import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type {
  Ingredient,
  IngredientCategory,
  SelectedIngredients,
  LockedIngredients,
} from '@/types';
import { INGREDIENT_CATEGORIES } from '@/types';

const EMPTY_INGREDIENTS: SelectedIngredients = {
  fat: null,
  foundation: null,
  feature: null,
  flavor: null,
  finish: null,
};

const EMPTY_LOCKS: LockedIngredients = {
  fat: false,
  foundation: false,
  feature: false,
  flavor: false,
  finish: false,
};

export function useIngredients() {
  const [ingredients, setIngredients] =
    useState<SelectedIngredients>(EMPTY_INGREDIENTS);
  const [lockedIngredients, setLockedIngredients] =
    useState<LockedIngredients>(EMPTY_LOCKS);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch a random ingredient for a specific category and cuisine
  const fetchRandomIngredient = useCallback(
    async (
      cuisineId: string,
      category: IngredientCategory
    ): Promise<Ingredient | null> => {
      // First get ingredient IDs for this cuisine
      const { data: links, error: linksError } = await supabase
        .from('cuisine_ingredients')
        .select('ingredient_id')
        .eq('cuisine_id', cuisineId);

      if (linksError || !links || links.length === 0) {
        console.error('Error fetching cuisine ingredients:', linksError);
        return null;
      }

      const ingredientIds = links.map((l) => l.ingredient_id);

      // Now fetch ingredients matching category and IDs
      const { data, error } = await supabase
        .from('ingredients')
        .select('id, name, category, tags')
        .eq('category', category)
        .in('id', ingredientIds);

      if (error) {
        console.error('Supabase error fetching ingredient:', error.message, error);
        return null;
      }

      if (!data || data.length === 0) {
        console.warn(`No ingredients found for category "${category}" in cuisine "${cuisineId}"`);
        return null;
      }

      // Pick a random one client-side
      const randomIndex = Math.floor(Math.random() * data.length);
      const item = data[randomIndex];

      return {
        id: item.id,
        name: item.name,
        category: item.category as IngredientCategory,
        tags: item.tags || [],
      };
    },
    []
  );

  // Fetch all ingredients for a cuisine (respects locks)
  const fetchAllIngredients = useCallback(
    async (cuisineId: string) => {
      console.log('fetchAllIngredients called with cuisineId:', cuisineId);
      setIsLoading(true);

      // Fetch all categories in parallel
      const results = await Promise.all(
        INGREDIENT_CATEGORIES.map(async (category) => {
          const ingredient = await fetchRandomIngredient(cuisineId, category);
          console.log(`Fetched ${category}:`, ingredient?.name ?? 'null');
          return { category, ingredient };
        })
      );

      console.log('All results:', results);

      // Update state, preserving locked ingredients
      setIngredients((prev) => {
        const updated = { ...prev };
        for (const { category, ingredient } of results) {
          // Only update if not locked and we got a result
          if (!lockedIngredients[category] && ingredient) {
            updated[category] = ingredient;
          }
        }
        console.log('Updated ingredients:', updated);
        return updated;
      });

      setIsLoading(false);
    },
    [lockedIngredients, fetchRandomIngredient]
  );

  // Re-roll a single ingredient
  const rerollIngredient = useCallback(
    async (cuisineId: string, category: IngredientCategory) => {
      if (lockedIngredients[category]) return;

      const ingredient = await fetchRandomIngredient(cuisineId, category);
      if (ingredient) {
        setIngredients((prev) => ({
          ...prev,
          [category]: ingredient,
        }));
      }
    },
    [lockedIngredients, fetchRandomIngredient]
  );

  // Toggle lock state for a category
  const toggleLock = useCallback((category: IngredientCategory) => {
    setLockedIngredients((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  }, []);

  // Reset all ingredients and locks
  const reset = useCallback(() => {
    setIngredients(EMPTY_INGREDIENTS);
    setLockedIngredients(EMPTY_LOCKS);
  }, []);

  // Check if all ingredients are selected
  const allSelected = INGREDIENT_CATEGORIES.every(
    (cat) => ingredients[cat] !== null
  );

  return {
    ingredients,
    lockedIngredients,
    isLoading,
    fetchAllIngredients,
    rerollIngredient,
    toggleLock,
    reset,
    allSelected,
  };
}
